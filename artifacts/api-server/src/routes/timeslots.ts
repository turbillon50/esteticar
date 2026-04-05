import { Router } from "express";
import { db, timeslotsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  ListTimeslotsQueryParams,
  ConfigureTimeslotsBody,
} from "@workspace/api-zod";

const router = Router();

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const nh = Math.floor(total / 60);
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

router.get("/timeslots", async (req, res) => {
  const parsed = ListTimeslotsQueryParams.safeParse({
    locationId: Number(req.query.locationId),
    date: req.query.date,
    serviceId: req.query.serviceId ? Number(req.query.serviceId) : undefined,
  });
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", message: parsed.error.message });
    return;
  }

  const { locationId, date } = parsed.data;

  const slots = await db.select().from(timeslotsTable)
    .where(and(
      eq(timeslotsTable.locationId, locationId),
      eq(timeslotsTable.date, date),
    ))
    .orderBy(timeslotsTable.startTime);

  res.json(slots);
});

router.post("/timeslots/configure", async (req, res) => {
  const parsed = ConfigureTimeslotsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", message: parsed.error.message });
    return;
  }

  const { locationId, startDate, endDate, openTime, closeTime, slotDurationMinutes, maxBookingsPerSlot } = parsed.data;

  let currentDate = startDate;
  const endDateStr = endDate;

  while (currentDate <= endDateStr) {
    await db.delete(timeslotsTable).where(
      and(eq(timeslotsTable.locationId, locationId), eq(timeslotsTable.date, currentDate))
    );

    let slotStart = openTime;
    while (timeToMinutes(slotStart) + slotDurationMinutes <= timeToMinutes(closeTime)) {
      const slotEnd = addMinutes(slotStart, slotDurationMinutes);
      await db.insert(timeslotsTable).values({
        locationId,
        date: currentDate,
        startTime: slotStart,
        endTime: slotEnd,
        isAvailable: true,
        maxBookings: maxBookingsPerSlot,
        currentBookings: 0,
      });
      slotStart = slotEnd;
    }

    currentDate = addDays(currentDate, 1);
  }

  res.json({ message: "Horarios configurados correctamente" });
});

export default router;
