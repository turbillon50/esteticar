import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const timeslotsTable = pgTable("timeslots", {
  id: serial("id").primaryKey(),
  locationId: integer("location_id").notNull(),
  date: text("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  maxBookings: integer("max_bookings").notNull().default(1),
  currentBookings: integer("current_bookings").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTimeslotSchema = createInsertSchema(timeslotsTable).omit({ id: true, createdAt: true });
export type InsertTimeslot = z.infer<typeof insertTimeslotSchema>;
export type Timeslot = typeof timeslotsTable.$inferSelect;
