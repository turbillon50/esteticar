"use client";

import { CheckCircle2, Clock, MapPin, X } from "lucide-react";
import { amountOf, mxn, PAY_LABEL, statusLabel } from "@/lib/ops";
import { useEsteticar } from "@/lib/store";
import type { Booking, BookingStatus } from "@/lib/types";

const TONE: Record<string, string> = {
  pendiente: "ops-chip warn",
  confirmada: "ops-chip info",
  completada: "ops-chip ok",
  cancelada: "ops-chip bad",
};

export function BookingCard({ booking: b }: { booking: Booking }) {
  const services = useEsteticar((s) => s.services);
  const locations = useEsteticar((s) => s.locations);
  const staff = useEsteticar((s) => s.staff);
  const setBookingStatus = useEsteticar((s) => s.setBookingStatus);
  const service = services.find((s) => s.id === b.serviceId);
  const loc = locations.find((l) => l.id === b.locationId);
  const person = staff.find((p) => p.id === b.staffId);
  const set = (status: BookingStatus) => setBookingStatus(b.id, status);

  return (
    <article className="ops-ticket" data-testid={`ops-booking-${b.id}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.12em] text-[var(--accent)]">
            {b.folio}
          </p>
          <p className="mt-0.5 text-[15px] font-extrabold text-[var(--fg)]">{b.customerName}</p>
        </div>
        <span className={TONE[b.status]}>{statusLabel(b.status)}</span>
      </div>
      <p className="mt-2 text-[13px] font-bold text-[var(--fg)]">{service?.name}</p>
      <p className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-[var(--fg-muted)]">
        <Clock size={12} /> {b.date} · {b.time}
      </p>
      <p className="mt-0.5 flex items-center gap-1.5 text-[12px] font-semibold text-[var(--fg-muted)]">
        <MapPin size={12} /> {loc?.name}
      </p>
      <p className="mt-2 text-[12px] font-semibold text-[var(--fg-muted)]">
        {PAY_LABEL[b.payment]} · {mxn(amountOf(b, services))}
        {person ? ` · ${person.name}` : ""}
      </p>
      {b.notes ? <p className="mt-2 text-[12px] leading-snug text-[var(--fg-muted)]">{b.notes}</p> : null}
      <div className="mt-3 flex gap-2">
        {b.status === "pendiente" ? (
          <button type="button" onClick={() => set("confirmada")} className="cta flex-1 justify-center gap-1 text-[13px]">
            <CheckCircle2 size={14} /> Confirmar
          </button>
        ) : null}
        {b.status === "confirmada" ? (
          <button type="button" onClick={() => set("completada")} className="cta flex-1 justify-center text-[13px]">
            Cerrar servicio
          </button>
        ) : null}
        {b.status !== "cancelada" && b.status !== "completada" ? (
          <button
            type="button"
            onClick={() => set("cancelada")}
            className="press flex h-11 items-center gap-1 rounded-[14px] bg-rose-50 px-3 text-[12px] font-extrabold text-rose-800"
          >
            <X size={14} /> Cancelar
          </button>
        ) : null}
      </div>
    </article>
  );
}
