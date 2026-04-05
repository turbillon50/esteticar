import { Router } from "express";
import { db, usersTable, bookingsTable, locationsTable, servicesTable, timeslotsTable } from "@workspace/db";
import { eq, and, gte, sql } from "drizzle-orm";
import {
  CreateProviderBody,
  AssignProviderToLocationParams,
  AssignProviderToLocationBody,
  ListAllBookingsQueryParams,
} from "@workspace/api-zod";
import crypto from "crypto";

const router = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "esteticar_salt").digest("hex");
}

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

async function requireAdmin(req: any, res: any): Promise<boolean> {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId)).limit(1);
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return false;
  }
  return true;
}

router.get("/admin/providers", async (req, res) => {
  if (!await requireAdmin(req, res)) return;
  const providers = await db.select().from(usersTable).where(eq(usersTable.role, "provider"));
  res.json(providers.map(({ passwordHash: _ph, ...u }) => u));
});

router.post("/admin/providers", async (req, res) => {
  if (!await requireAdmin(req, res)) return;

  const parsed = CreateProviderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", message: parsed.error.message });
    return;
  }

  const { name, email, password, phone, locationId } = parsed.data;
  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length > 0) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }

  const [user] = await db.insert(usersTable).values({
    name,
    email,
    passwordHash: hashPassword(password),
    role: "provider",
    phone: phone ?? null,
    locationId: locationId ?? null,
  }).returning();

  const { passwordHash: _ph, ...safeUser } = user;
  res.status(201).json(safeUser);
});

router.post("/admin/providers/:id/assign", async (req, res) => {
  if (!await requireAdmin(req, res)) return;

  const params = AssignProviderToLocationParams.safeParse({ id: Number(req.params.id) });
  const body = AssignProviderToLocationBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Validation error" });
    return;
  }

  await db.update(usersTable)
    .set({ locationId: body.data.locationId })
    .where(eq(usersTable.id, params.data.id));

  res.json({ message: "Proveedor asignado a la sucursal" });
});

router.get("/admin/bookings", async (req, res) => {
  if (!await requireAdmin(req, res)) return;

  const parsed = ListAllBookingsQueryParams.safeParse({
    status: req.query.status,
    locationId: req.query.locationId ? Number(req.query.locationId) : undefined,
    date: req.query.date,
  });

  let rows = await db.select().from(bookingsTable)
    .orderBy(sql`${bookingsTable.date} DESC, ${bookingsTable.startTime} ASC`);

  if (parsed.success) {
    if (parsed.data.status) rows = rows.filter(b => b.status === parsed.data.status);
    if (parsed.data.locationId) rows = rows.filter(b => b.locationId === parsed.data.locationId);
    if (parsed.data.date) rows = rows.filter(b => b.date === parsed.data.date);
  }

  const enriched = await Promise.all(rows.map(enrichBooking));
  res.json(enriched);
});

router.get("/admin/dashboard", async (req, res) => {
  if (!await requireAdmin(req, res)) return;

  const today = new Date().toISOString().split("T")[0];

  const allBookings = await db.select().from(bookingsTable);
  const todayBookings = allBookings.filter(b => b.date === today);
  const completedBookings = allBookings.filter(b => b.status === "completed");
  const cancelledBookings = allBookings.filter(b => b.status === "cancelled");
  const confirmedBookings = allBookings.filter(b => b.status === "confirmed");

  const allServices = await db.select().from(servicesTable);
  const serviceMap = new Map(allServices.map(s => [s.id, Number(s.price)]));

  const totalRevenue = completedBookings.reduce((sum, b) => {
    return sum + (serviceMap.get(b.serviceId) ?? 0);
  }, 0);

  const allLocations = await db.select().from(locationsTable);
  const allProviders = await db.select().from(usersTable).where(eq(usersTable.role, "provider"));
  const allCustomers = await db.select().from(usersTable).where(eq(usersTable.role, "customer"));

  const recentRaw = allBookings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);
  const recentBookings = await Promise.all(recentRaw.map(enrichBooking));

  res.json({
    totalBookings: allBookings.length,
    todayBookings: todayBookings.length,
    completedBookings: completedBookings.length,
    cancelledBookings: cancelledBookings.length,
    confirmedBookings: confirmedBookings.length,
    totalRevenue,
    totalLocations: allLocations.length,
    totalProviders: allProviders.length,
    totalCustomers: allCustomers.length,
    recentBookings,
  });
});

export default router;
