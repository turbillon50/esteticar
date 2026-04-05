import { db, usersTable, servicesTable, locationsTable, timeslotsTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import crypto from "crypto";
import { logger } from "./lib/logger";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "esteticar_salt").digest("hex");
}

export async function autoSeed() {
  try {
    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(usersTable);
    if (count > 0) {
      logger.info("Database already seeded — skipping");
      return;
    }

    logger.info("Seeding database...");

    // ── Users ──
    await db.insert(usersTable).values([
      {
        name: "Admin Esteticar",
        email: "admin@esteticar.mx",
        passwordHash: hashPassword("admin123"),
        role: "admin",
      },
      {
        name: "Demo Cliente",
        email: "demo@esteticar.mx",
        passwordHash: hashPassword("demo123"),
        role: "customer",
      },
      {
        name: "Juan García",
        email: "juan@esteticar.mx",
        passwordHash: hashPassword("washer123"),
        role: "provider",
      },
    ]);

    // ── Services ──
    await db.insert(servicesTable).values([
      {
        name: "Lavado Básico",
        description: "Lavado exterior con espuma activa de alta presión, enjuague multi-etapa y secado manual con microfibra premium.",
        price: "120.00",
        durationMinutes: 30,
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        isActive: true,
      },
      {
        name: "Lavado Camioneta",
        description: "Servicio especializado para SUVs y pickups. Espuma activa en techo, llantas y rines. Incluye aspirado de interiores.",
        price: "180.00",
        durationMinutes: 45,
        imageUrl: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80",
        isActive: true,
      },
      {
        name: "Lavado Completo con Interiores",
        description: "Lavado exterior completo + limpieza profunda de interiores, aspirado, pulido y aromatizante premium.",
        price: "800.00",
        durationMinutes: 90,
        imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
        isActive: true,
      },
    ]);

    // ── Locations ──
    const insertedLocations = await db.insert(locationsTable).values([
      { name: "Auto Spa Cuernavaca", address: "Av. Plan de Ayala 128, Col. Lomas de la Selva", city: "Cuernavaca", phone: "777-314-0001", openTime: "08:00", closeTime: "20:00", isActive: true, lat: 18.9242, lng: -99.2216 },
      { name: "Lavado Express Las Palmas", address: "Blvd. Las Palmas 45, Fracc. Las Palmas", city: "Cuernavaca", phone: "777-314-0002", openTime: "08:00", closeTime: "20:00", isActive: true, lat: 18.9180, lng: -99.2300 },
      { name: "Premium Wash Tres Marías", address: "Carr. México-Cuernavaca Km 23, Tres Marías", city: "Huitzilac", phone: "777-314-0003", openTime: "09:00", closeTime: "19:00", isActive: true, lat: 19.0100, lng: -99.2050 },
      { name: "Wash & Go Jiutepec", address: "Av. Benito Juárez 340", city: "Jiutepec", phone: "777-410-1001", openTime: "08:00", closeTime: "19:00", isActive: true, lat: 18.8861, lng: -99.1708 },
      { name: "Auto Spa Cuautla", address: "Calle Galeana 88", city: "Cuautla", phone: "735-352-2001", openTime: "08:00", closeTime: "19:00", isActive: true, lat: 18.8064, lng: -98.9456 },
      { name: "Clean Car Temixco", address: "Blvd. Forjadores 210", city: "Temixco", phone: "777-325-3001", openTime: "08:00", closeTime: "18:00", isActive: true, lat: 18.8511, lng: -99.2344 },
      { name: "Splash Yautepec", address: "Av. Hidalgo 45", city: "Yautepec", phone: "735-468-4001", openTime: "09:00", closeTime: "18:00", isActive: true, lat: 18.8928, lng: -99.0634 },
      { name: "Express Wash Jojutla", address: "Calle Morelos 12", city: "Jojutla", phone: "734-342-5001", openTime: "08:00", closeTime: "17:00", isActive: true, lat: 18.6180, lng: -99.1800 },
      { name: "Premium Auto Xochitepec", address: "Carretera Alpuyeca Km 3", city: "Xochitepec", phone: "777-398-6001", openTime: "08:00", closeTime: "19:00", isActive: true, lat: 18.8078, lng: -99.2428 },
    ]).returning();

    // ── Timeslots (for all locations, all days) ──
    const slots = [
      "08:00","08:30","09:00","09:30","10:00","10:30",
      "11:00","11:30","12:00","12:30","13:00","13:30",
      "14:00","14:30","15:00","15:30","16:00","16:30",
      "17:00","17:30","18:00","18:30","19:00","19:30",
    ];

    const next14Days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d.toISOString().split("T")[0];
    });

    const timeslotRows: Array<{ locationId: number; date: string; startTime: string; endTime: string; maxBookings: number; currentBookings: number; isAvailable: boolean }> = [];

    for (const loc of insertedLocations) {
      for (const date of next14Days) {
        for (let i = 0; i < slots.length; i++) {
          const start = slots[i];
          const [h, m] = start.split(":").map(Number);
          const endDate = new Date(2000, 0, 1, h, m + 30);
          const end = `${String(endDate.getHours()).padStart(2,"0")}:${String(endDate.getMinutes()).padStart(2,"0")}`;
          const closeH = Number(loc.closeTime.split(":")[0]);
          if (h < closeH && Number(loc.openTime.split(":")[0]) <= h) {
            timeslotRows.push({
              locationId: loc.id,
              date,
              startTime: start,
              endTime: end,
              maxBookings: 2,
              currentBookings: 0,
              isAvailable: true,
            });
          }
        }
      }
    }

    // Insert in batches of 500
    for (let i = 0; i < timeslotRows.length; i += 500) {
      await db.insert(timeslotsTable).values(timeslotRows.slice(i, i + 500));
    }

    logger.info({ users: 3, services: 3, locations: insertedLocations.length, timeslots: timeslotRows.length }, "Database seeded successfully");
  } catch (err) {
    logger.error({ err }, "Failed to seed database");
  }
}
