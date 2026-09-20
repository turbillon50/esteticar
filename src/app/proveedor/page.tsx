"use client";

import { CheckCircle2, Clock, User } from "lucide-react";
import { useEsteticar } from "@/lib/store";

export default function ProveedorPage() {
  const bookings = useEsteticar((s) => s.bookings);
  const services = useEsteticar((s) => s.services);
  const locations = useEsteticar((s) => s.locations);
  const setBookingStatus = useEsteticar((s) => s.setBookingStatus);

  const incoming = bookings.filter((b) => b.status === "pendiente");
  const confirmed = bookings.filter((b) => b.status === "confirmada");

  return (
    <div className="min-h-full bg-[var(--bg)] pb-8">
      <header className="hero-light px-6 pb-8 pt-8 text-white">
        <div className="mx-auto max-w-[1120px]">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#b8ecf6]">
            Panel lavador
          </p>
          <h1 className="display text-[40px]">Hola, Juan</h1>
          <p className="mt-1 text-sm text-white/70">Citas entrantes de Morelos</p>
        </div>
      </header>

      <div className="page grid grid-cols-2 gap-3 pt-6 md:max-w-lg">
        <div className="card p-4 text-center">
          <p className="text-3xl font-extrabold text-[var(--fg)]">{incoming.length}</p>
          <p className="text-xs font-semibold text-[var(--fg-muted)]">Entrantes</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-extrabold text-[var(--fg)]">{confirmed.length}</p>
          <p className="text-xs font-semibold text-[var(--fg-muted)]">Confirmadas</p>
        </div>
      </div>

      <div className="page pt-4">
        <h2 className="mb-3 text-lg font-extrabold text-[var(--fg)]">Citas entrantes</h2>
        {incoming.length === 0 ? (
          <p className="card p-8 text-center text-sm font-semibold text-[var(--fg-muted)]">
            No hay citas pendientes. Agenda una como cliente para verla aquí.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {incoming.map((b) => {
              const service = services.find((s) => s.id === b.serviceId);
              const loc = locations.find((l) => l.id === b.locationId);
              return (
                <article key={b.id} className="card p-4" data-testid={`incoming-${b.id}`}>
                  <p className="text-xs font-extrabold text-[var(--accent)]">{b.folio}</p>
                  <p className="font-extrabold text-[var(--fg)]">{service?.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[var(--fg-muted)]">
                    <Clock size={12} /> {b.date} · {b.time}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--fg-muted)]">
                    <User size={12} /> {b.customerName}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--fg-muted)]">{loc?.name}</p>
                  <button
                    type="button"
                    data-testid={`confirm-${b.id}`}
                    onClick={() => setBookingStatus(b.id, "confirmada")}
                    className="cta mt-3 w-full justify-center gap-2 text-sm"
                  >
                    <CheckCircle2 size={16} /> Confirmar cita
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
