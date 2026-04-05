import { Router } from "express";
import { db, bookingsTable, timeslotsTable, servicesTable, locationsTable, usersTable } from "@workspace/db";
import { eq, and, gte, sql } from "drizzle-orm";
import {
  ListBookingsQueryParams,
  CreateBookingBody,
  GetBookingParams,
  UpdateBookingStatusParams,
  UpdateBookingStatusBody,
} from "@workspace/api-zod";

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

router.get("/bookings", async (req, res) => {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const parsed = ListBookingsQueryParams.safeParse({
    status: req.query.status,
    upcoming: req.query.upcoming === "true" ? true : req.query.upcoming === "false" ? false : undefined,
  });

  const today = new Date().toISOString().split("T")[0];
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId)).limit(1);
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  let query = db.select().from(bookingsTable).where(eq(bookingsTable.userId, req.session.userId));
  const rows = await query.orderBy(sql`${bookingsTable.date} DESC, ${bookingsTable.startTime} ASC`);

  let filtered = rows;
  if (parsed.success && parsed.data.status) {
    filtered = filtered.filter(b => b.status === parsed.data.status);
  }
  if (parsed.success && parsed.data.upcoming === true) {
    filtered = filtered.filter(b => b.date >= today && b.status === "confirmed");
  }

  const enriched = await Promise.all(filtered.map(enrichBooking));
  res.json(enriched);
});

router.post("/bookings", async (req, res) => {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", message: parsed.error.message });
    return;
  }

  const { serviceId, locationId, timeslotId, date, notes } = parsed.data;

  const [slot] = await db.select().from(timeslotsTable).where(eq(timeslotsTable.id, timeslotId)).limit(1);
  if (!slot) {
    res.status(400).json({ error: "Timeslot not found" });
    return;
  }
  if (!slot.isAvailable || slot.currentBookings >= slot.maxBookings) {
    res.status(400).json({ error: "Slot not available", message: "Este horario ya no está disponible" });
    return;
  }

  const [booking] = await db.insert(bookingsTable).values({
    userId: req.session.userId,
    serviceId,
    locationId,
    timeslotId,
    status: "confirmed",
    date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    notes: notes ?? null,
  }).returning();

  await db.update(timeslotsTable)
    .set({
      currentBookings: slot.currentBookings + 1,
      isAvailable: slot.currentBookings + 1 < slot.maxBookings,
    })
    .where(eq(timeslotsTable.id, timeslotId));

  const enriched = await enrichBooking(booking);
  res.status(201).json(enriched);
});

router.get("/bookings/:id", async (req, res) => {
  const params = GetBookingParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, params.data.id)).limit(1);
  if (!booking) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const enriched = await enrichBooking(booking);
  res.json(enriched);
});

router.patch("/bookings/:id", async (req, res) => {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const params = UpdateBookingStatusParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateBookingStatusBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Validation error" });
    return;
  }

  const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, params.data.id)).limit(1);
  if (!booking) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  if (body.data.status === "cancelled" && booking.status !== "cancelled") {
    const [slot] = await db.select().from(timeslotsTable).where(eq(timeslotsTable.id, booking.timeslotId)).limit(1);
    if (slot) {
      const newCount = Math.max(0, slot.currentBookings - 1);
      await db.update(timeslotsTable)
        .set({ currentBookings: newCount, isAvailable: true })
        .where(eq(timeslotsTable.id, slot.id));
    }
  }

  const [updated] = await db.update(bookingsTable)
    .set({ status: body.data.status })
    .where(eq(bookingsTable.id, params.data.id))
    .returning();

  const enriched = await enrichBooking(updated);
  res.json(enriched);
});

export default router;
