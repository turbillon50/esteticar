"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LOCATIONS, SEED_BOOKINGS, SERVICES, makeFolio } from "./seed";
import type {
  Booking,
  BookingStatus,
  Location,
  PaymentMethod,
  Role,
  Service,
} from "./types";

type State = {
  role: Role;
  services: Service[];
  locations: Location[];
  bookings: Booking[];
  customerName: string;
  setRole: (role: Role) => void;
  bumpPrice: (serviceId: string, delta: number) => void;
  setPrice: (serviceId: string, price: number) => void;
  addBooking: (input: {
    serviceId: string;
    locationId: string;
    date: string;
    time: string;
    payment: PaymentMethod;
    notes?: string;
  }) => Booking;
  setBookingStatus: (id: string, status: BookingStatus) => void;
  resetDemo: () => void;
};

export const useEsteticar = create<State>()(
  persist(
    (set, get) => ({
      role: "cliente",
      services: SERVICES,
      locations: LOCATIONS,
      bookings: SEED_BOOKINGS,
      customerName: "Sergio Zapata",
      setRole: (role) => set({ role }),
      bumpPrice: (serviceId, delta) =>
        set({
          services: get().services.map((s) =>
            s.id === serviceId
              ? { ...s, price: Math.max(0, s.price + delta) }
              : s,
          ),
        }),
      setPrice: (serviceId, price) =>
        set({
          services: get().services.map((s) =>
            s.id === serviceId ? { ...s, price: Math.max(0, Math.round(price)) } : s,
          ),
        }),
      addBooking: (input) => {
        const booking: Booking = {
          id: `bk-${Date.now()}`,
          folio: makeFolio(),
          serviceId: input.serviceId,
          locationId: input.locationId,
          date: input.date,
          time: input.time,
          payment: input.payment,
          status: "pendiente",
          customerName: get().customerName,
          createdAt: new Date().toISOString(),
          notes: input.notes,
        };
        set({ bookings: [booking, ...get().bookings] });
        return booking;
      },
      setBookingStatus: (id, status) =>
        set({
          bookings: get().bookings.map((b) =>
            b.id === id ? { ...b, status } : b,
          ),
        }),
      resetDemo: () =>
        set({
          role: "cliente",
          services: SERVICES,
          locations: LOCATIONS,
          bookings: SEED_BOOKINGS,
        }),
    }),
    { name: "esteticar-demo-v1" },
  ),
);
