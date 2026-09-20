"use client";

import { CheckCircle2, Clock, MapPin, X } from "lucide-react";
import { useEsteticar } from "@/lib/store";
import type { BookingStatus } from "@/lib/types";

const TONE: Record<string, string> = {
  pendiente: "bg-amber-50 text-amber-800",
  confirmada: "bg-sky-50 text-sky-800",
  completada: "bg-emerald-50 text-emerald-800",
  cancelada: "bg-rose-50 text-rose-800",
};

export default function AdminCitasPage() {
  const bookings = useEsteticar((s) => s.bookings);
  const services = useEsteticar((s) => s.services);
  const locations = useEsteticar((s) => s.locations);
  const setBookingStatus = useEsteticar((s) => s.setBookingStatus);

  const set = (id: string, status: BookingStatus) => setBookingStatus(id, status);

  return (
    <div className="min-h-full bg-[var(--bg)] pb-10">
      <header className="page pb-2 pt-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--accent)]">
          Operación
        </p>
        <h1 className="display mt-1 text-[40px] text-[var(--fg)]">Citas</h1>
        <p className="mt-1 text-[14px] text-[var(--fg-muted)]">
          Confirma, completa o cancela. Mismo store que el panel del lavador.
        </p>
      </header>

      <div className="page grid gap-3 pt-2 md:grid-cols-2">
        {bookings.length === 0 ? (
          <p className="card p-8 text-sm font-semibold text-[var(--fg-muted)]">Aún no hay citas.</p>
        ) : (
          bookings.map((b) => {
            const service = services.find((s) => s.id === b.serviceId);
            const loc = locations.find((l) => l.id === b.locationId);
            return (
              <article key={b.id} className="card p-4" data-testid={`ops-booking-${b.id}`}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[var(--fg)]">{b.folio}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold capitalize ${TONE[b.status]}`}>
                    {b.status}
                  </span>
                </div>
                <p className="font-bold text-[var(--fg)]">{service?.name}</p>
                <p className="text-[13px] font-semibold text-[var(--fg)]">{b.customerName}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[var(--fg-muted)]">
                  <Clock size={12} /> {b.date} · {b.time}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--fg-muted)]">
                  <MapPin size={12} /> {loc?.name}
                </p>
                {b.notes ? <p className="mt-2 text-[12px] text-[var(--fg-muted)]">{b.notes}</p> : null}
                <div className="mt-3 flex gap-2">
                  {b.status === "pendiente" ? (
                    <button
                      type="button"
                      onClick={() => set(b.id, "confirmada")}
                      className="cta flex-1 justify-center gap-1 text-[13px]"
                    >
                      <CheckCircle2 size={14} /> Confirmar
                    </button>
                  ) : null}
                  {b.status === "confirmada" ? (
                    <button
                      type="button"
                      onClick={() => set(b.id, "completada")}
                      className="cta flex-1 justify-center text-[13px]"
                    >
                      Completar
                    </button>
                  ) : null}
                  {b.status !== "cancelada" && b.status !== "completada" ? (
                    <button
                      type="button"
                      onClick={() => set(b.id, "cancelada")}
                      className="press flex h-11 items-center gap-1 rounded-[14px] bg-rose-50 px-3 text-[12px] font-extrabold text-rose-800"
                    >
                      <X size={14} /> Cancelar
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
