import { isoDay } from "./seed";
import type { Booking, Location, PaymentMethod, Service, Staff } from "./types";

export function mxn(n: number) {
  return n.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });
}

export function longDate(iso?: string) {
  const d = iso ? new Date(`${iso}T12:00:00`) : new Date();
  return d.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

export function amountOf(b: Booking, services: Service[]) {
  return services.find((s) => s.id === b.serviceId)?.price ?? 0;
}

export function liveBookings(bookings: Booking[]) {
  return bookings.filter((b) => b.status !== "cancelada");
}

export function ofDay(bookings: Booking[], day = 0) {
  const iso = isoDay(day);
  return bookings.filter((b) => b.date === iso);
}

export function occupancy(loc: Location, bookings: Booking[], day = 0) {
  const iso = isoDay(day);
  const taken = bookings.filter(
    (b) => b.locationId === loc.id && b.date === iso && b.status !== "cancelada",
  ).length;
  const cap = 8;
  return { taken, slots: cap, pct: Math.min(100, Math.round((taken / cap) * 100)) };
}

export function cajaSplit(bookings: Booking[], services: Service[]) {
  const init: Record<PaymentMethod, number> = { tarjeta: 0, transferencia: 0, oxxo: 0 };
  for (const b of bookings) {
    if (b.status === "cancelada") continue;
    init[b.payment] += amountOf(b, services);
  }
  return init;
}

export function weekSeries(bookings: Booking[], services: Service[]) {
  return Array.from({ length: 7 }, (_, i) => {
    const day = i - 6;
    const list = ofDay(bookings, day);
    const value = list
      .filter((b) => b.status !== "cancelada")
      .reduce((s, b) => s + amountOf(b, services), 0);
    return { day, iso: isoDay(day), label: isoDay(day).slice(8), value, count: list.length };
  });
}

export function staffLabel(role: Staff["role"]) {
  if (role === "supervisor") return "Supervisor";
  if (role === "caja") return "Caja";
  return "Lavador";
}

export function statusLabel(s: Booking["status"]) {
  if (s === "pendiente") return "Por confirmar";
  if (s === "confirmada") return "En patio";
  if (s === "completada") return "Cerrada";
  return "Cancelada";
}

export const PAY_LABEL: Record<PaymentMethod, string> = {
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
  oxxo: "OXXO",
};
