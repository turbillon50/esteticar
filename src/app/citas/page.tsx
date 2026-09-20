"use client";

import { Clock, MapPin } from "lucide-react";
import { useEsteticar } from "@/lib/store";

const TONE: Record<string, string> = {
  pendiente: "bg-amber-50 text-amber-700",
  confirmada: "bg-sky-50 text-sky-700",
  completada: "bg-emerald-50 text-emerald-700",
  cancelada: "bg-rose-50 text-rose-700",
};

export default function CitasPage() {
  const bookings = useEsteticar((s) => s.bookings);
  const services = useEsteticar((s) => s.services);
  const locations = useEsteticar((s) => s.locations);
  const role = useEsteticar((s) => s.role);

  return (
    <div className="min-h-full bg-[#f0f4f8] pb-8">
      <header className="px-5 pb-3 pt-14">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#0077b6]">
          {role === "proveedor" ? "Agenda del lavador" : "Historial"}
        </p>
        <h1 className="text-3xl font-extrabold text-[#03045e]">Mis citas</h1>
      </header>
      <div className="flex flex-col gap-3 px-4">
        {bookings.length === 0 ? (
          <p className="rounded-3xl bg-white p-8 text-center text-sm font-semibold text-[#90a0b7]">
            Aún no hay citas.
          </p>
        ) : (
          bookings.map((b) => {
            const service = services.find((s) => s.id === b.serviceId);
            const loc = locations.find((l) => l.id === b.locationId);
            return (
              <article
                key={b.id}
                className="rounded-[22px] bg-white p-4 shadow-[0_2px_12px_rgba(3,4,94,0.07)]"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#03045e]">{b.folio}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold capitalize ${TONE[b.status]}`}
                  >
                    {b.status}
                  </span>
                </div>
                <p className="font-bold">{service?.name}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#90a0b7]">
                  <Clock size={12} /> {b.date} · {b.time}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-[#90a0b7]">
                  <MapPin size={12} /> {loc?.name}
                </p>
                <p className="mt-1 text-xs font-semibold text-[#90a0b7]">{b.customerName}</p>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
