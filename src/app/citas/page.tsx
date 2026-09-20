"use client";

import { Clock, MapPin } from "lucide-react";
import { useEsteticar } from "@/lib/store";

const TONE: Record<string, string> = {
  pendiente: "bg-amber-50 text-amber-800",
  confirmada: "bg-sky-50 text-sky-800",
  completada: "bg-emerald-50 text-emerald-800",
  cancelada: "bg-rose-50 text-rose-800",
};

export default function CitasPage() {
  const bookings = useEsteticar((s) => s.bookings);
  const services = useEsteticar((s) => s.services);
  const locations = useEsteticar((s) => s.locations);
  const role = useEsteticar((s) => s.role);

  return (
    <div className="min-h-full bg-[var(--bg)] pb-8">
      <header className="page pb-2 pt-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--accent)]">
          {role === "proveedor" ? "Agenda del lavador" : "Historial"}
        </p>
        <h1 className="display mt-1 text-[40px] text-[var(--fg)]">Mis citas</h1>
      </header>
      <div className="page grid gap-3 pt-2 md:grid-cols-2">
        {bookings.length === 0 ? (
          <p className="card p-8 text-center text-sm font-semibold text-[var(--fg-muted)]">
            Aún no hay citas.
          </p>
        ) : (
          bookings.map((b) => {
            const service = services.find((s) => s.id === b.serviceId);
            const loc = locations.find((l) => l.id === b.locationId);
            return (
              <article key={b.id} className="card p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[var(--fg)]">{b.folio}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold capitalize ${TONE[b.status]}`}
                  >
                    {b.status}
                  </span>
                </div>
                <p className="font-bold text-[var(--fg)]">{service?.name}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[var(--fg-muted)]">
                  <Clock size={12} /> {b.date} · {b.time}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--fg-muted)]">
                  <MapPin size={12} /> {loc?.name}
                </p>
                <p className="mt-1 text-xs font-semibold text-[var(--fg-muted)]">{b.customerName}</p>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
