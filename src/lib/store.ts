"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CITY_COORDS, LOCATIONS, SEED_BOOKINGS, SERVICES, STAFF, makeFolio } from "./seed";
import type {
  Booking,
  BookingStatus,
  Location,
  PaymentMethod,
  Role,
  Service,
  Staff,
  StaffStatus,
} from "./types";
import { isOpenLocation } from "./types";

export type LocationDraft = {
  name: string;
  address: string;
  city: string;
  phone: string;
  openTime: string;
  closeTime: string;
};

type State = {
  role: Role;
  services: Service[];
  locations: Location[];
  bookings: Booking[];
  staff: Staff[];
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
  addLocation: (draft: LocationDraft) => Location;
  updateLocation: (id: string, patch: Partial<Location>) => void;
  setLocationActive: (id: string, active: boolean) => void;
  removeLocation: (id: string) => void;
  setStaffStatus: (id: string, status: StaffStatus) => void;
  resetDemo: () => void;
};

function jitter(city: string) {
  const base = CITY_COORDS[city] ?? CITY_COORDS.Cuernavaca;
  return {
    lat: base.lat + (Math.random() - 0.5) * 0.018,
    lng: base.lng + (Math.random() - 0.5) * 0.018,
  };
}

function normalizeLocations(list: Location[]): Location[] {
  return list.map((l) => ({ ...l, active: l.active !== false }));
}

export const useEsteticar = create<State>()(
  persist(
    (set, get) => ({
      role: "cliente",
      services: SERVICES,
      locations: LOCATIONS,
      bookings: SEED_BOOKINGS,
      staff: STAFF,
      customerName: "Sergio Zapata",
      setRole: (role) => set({ role }),
      bumpPrice: (serviceId, delta) =>
        set({
          services: get().services.map((s) =>
            s.id === serviceId ? { ...s, price: Math.max(0, s.price + delta) } : s,
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
          bookings: get().bookings.map((b) => (b.id === id ? { ...b, status } : b)),
        }),
      addLocation: (draft) => {
        const pin = jitter(draft.city);
        const loc: Location = {
          id: `loc-${Date.now()}`,
          name: draft.name.trim(),
          address: draft.address.trim(),
          city: draft.city,
          phone: draft.phone.trim(),
          openTime: draft.openTime,
          closeTime: draft.closeTime,
          lat: pin.lat,
          lng: pin.lng,
          rating: 5,
          active: true,
        };
        set({ locations: [...get().locations, loc] });
        return loc;
      },
      updateLocation: (id, patch) =>
        set({
          locations: get().locations.map((l) => (l.id === id ? { ...l, ...patch, id: l.id } : l)),
        }),
      setLocationActive: (id, active) =>
        set({
          locations: get().locations.map((l) => (l.id === id ? { ...l, active } : l)),
        }),
      removeLocation: (id) =>
        set({
          locations: get().locations.filter((l) => l.id !== id),
        }),
      setStaffStatus: (id, status) =>
        set({
          staff: get().staff.map((p) => (p.id === id ? { ...p, status } : p)),
        }),
      resetDemo: () =>
        set({
          services: SERVICES,
          locations: LOCATIONS,
          bookings: SEED_BOOKINGS,
          staff: STAFF,
        }),
    }),
    {
      name: "esteticar-demo-v2",
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<State>;
        return {
          ...current,
          ...p,
          locations: normalizeLocations(p.locations ?? current.locations),
          services: p.services ?? current.services,
          bookings: p.bookings ?? current.bookings,
          staff: p.staff ?? current.staff,
        };
      },
    },
  ),
);

export function useOpenLocations() {
  const locations = useEsteticar((s) => s.locations);
  return useMemo(() => locations.filter(isOpenLocation), [locations]);
}
