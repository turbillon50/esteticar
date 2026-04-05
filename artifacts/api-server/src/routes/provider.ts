import { Router } from "express";
import { db, bookingsTable, servicesTable, locationsTable, usersTable } from "@workspace/db";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { GetProviderScheduleQueryParams } from "@workspace/api-zod";

const router = Router();

async function enrichBooking(booking: typeof bookingsTable.$inferSelect) {
  const [service] = await db.select().from(servicesTable).where(eq(servicesTable.id, booking.serviceId)).limit(1);
  const [location] = await db.select().from(locationsTable).where(eq(locationsTable.id, booking.locationId)).limit(1);
  const [userRow] = await db.select().from(usersTable).where(eq(usersTable.id, booking.userId)).limit(1);
  const { passwordHash: _ph, ...safeUser } = userRow ?? {};
  return {
    ...booking,
    service: service ? { ...service, price: Number(service.price) } : null,
    location: location ?? null,
    user: userRow ? safeUser : null,
  };
}

router.get("/provider/schedule", async (req, res) => {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId)).limit(1);
  if (!user || user.role !== "provider") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const parsed = GetProviderScheduleQueryParams.safeParse({ date: req.query.date });
  const date = parsed.success && parsed.data.date ? parsed.data.date : new Date().toISOString().split("T")[0];

  let rows;
  if (user.locationId) {
    rows = await db.select().from(bookingsTable)
      .where(and(eq(bookingsTable.locationId, user.locationId), eq(bookingsTable.date, date)))
      .orderBy(bookingsTable.startTime);
  } else {
    rows = await db.select().from(bookingsTable)
      .where(eq(bookingsTable.date, date))
      .orderBy(bookingsTable.startTime);
  }

  const enriched = await Promise.all(rows.map(enrichBooking));
  res.json(enriched);
});

router.get("/provider/stats", async (req, res) => {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId)).limit(1);
  if (!user || user.role !== "provider") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const weekStr = startOfWeek.toISOString().split("T")[0];
  const monthStr = startOfMonth.toISOString().split("T")[0];

  const baseFilter = user.locationId
    ? eq(bookingsTable.locationId, user.locationId)
    : sql`true`;

  const allCompleted = await db.select().from(bookingsTable)
    .where(and(baseFilter, eq(bookingsTable.status, "completed")));

  const todayBookings = await db.select().from(bookingsTable)
    .where(and(baseFilter, eq(bookingsTable.date, today)));

  const weekBookings = await db.select().from(bookingsTable)
    .where(and(baseFilter, eq(bookingsTable.status, "completed"), gte(bookingsTable.date, weekStr)));

  const monthBookings = await db.select().from(bookingsTable)
    .where(and(baseFilter, eq(bookingsTable.status, "completed"), gte(bookingsTable.date, monthStr)));

  res.json({
    totalCompleted: allCompleted.length,
    totalToday: todayBookings.length,
    totalThisWeek: weekBookings.length,
    totalThisMonth: monthBookings.length,
  });
});

export default router;
