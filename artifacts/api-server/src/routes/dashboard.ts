import { Router } from "express";
import { db, bookingsTable, servicesTable, locationsTable, usersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

async function enrichBooking(booking: typeof bookingsTable.$inferSelect) {
  const [service] = await db.select().from(servicesTable).where(eq(servicesTable.id, booking.serviceId)).limit(1);
  const [location] = await db.select().from(locationsTable).where(eq(locationsTable.id, booking.locationId)).limit(1);
  return {
    ...booking,
    service: service ? { ...service, price: Number(service.price) } : null,
    location: location ?? null,
    user: null,
  };
}

router.get("/dashboard/summary", async (req, res) => {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  const allBookings = await db.select().from(bookingsTable)
    .where(eq(bookingsTable.userId, req.session.userId))
    .orderBy(sql`${bookingsTable.date} ASC, ${bookingsTable.startTime} ASC`);

  const upcomingBookings = allBookings.filter(b => b.date >= today && b.status === "confirmed");
  const completedBookings = allBookings.filter(b => b.status === "completed");
  const recentRaw = allBookings.slice(-3).reverse();

  const nextBooking = upcomingBookings.length > 0 ? await enrichBooking(upcomingBookings[0]) : null;
  const recentBookings = await Promise.all(recentRaw.map(enrichBooking));

  res.json({
    upcomingCount: upcomingBookings.length,
    completedCount: completedBookings.length,
    nextBooking,
    recentBookings,
  });
});

export default router;
