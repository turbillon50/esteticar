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
    <div className="min-h-full bg-[#f0f4f8] pb-8">
      <header
        className="relative overflow-hidden px-5 pb-8 pt-14 text-white"
        style={{ background: "linear-gradient(150deg,#020b1a,#03045e,#0077b6)" }}
      >
        <p className="text-sm text-white/60">Modo proveedor</p>
        <h1 className="text-2xl font-extrabold">Hola, Juan</h1>
        <p className="mt-1 text-sm text-white/70">Citas entrantes de Morelos</p>
      </header>

      <div className="grid grid-cols-2 gap-3 px-4 py-5">
        <div className="rounded-3xl bg-white p-4 text-center">
          <p className="text-3xl font-extrabold text-[#03045e]">{incoming.length}</p>
          <p className="text-xs text-[#90a0b7]">Entrantes</p>
        </div>
        <div className="rounded-3xl bg-white p-4 text-center">
          <p className="text-3xl font-extrabold text-[#03045e]">{confirmed.length}</p>
          <p className="text-xs text-[#90a0b7]">Confirmadas</p>
        </div>
      </div>

      <div className="px-4">
        <h2 className="mb-3 text-lg font-extrabold">Citas entrantes</h2>
        {incoming.length === 0 ? (
          <p className="rounded-3xl bg-white p-8 text-center text-sm font-semibold text-[#90a0b7]">
            No hay citas pendientes. Agenda una como cliente para verla aquí.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {incoming.map((b) => {
              const service = services.find((s) => s.id === b.serviceId);
              const loc = locations.find((l) => l.id === b.locationId);
              return (
                <article
                  key={b.id}
                  className="rounded-[22px] bg-white p-4 shadow-[0_2px_12px_rgba(3,4,94,0.07)]"
                  data-testid={`incoming-${b.id}`}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-[#0077b6]">{b.folio}</p>
                      <p className="font-extrabold text-[#03045e]">{service?.name}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#90a0b7]">
                        <Clock size={12} /> {b.date} · {b.time}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-[#90a0b7]">
                        <User size={12} /> {b.customerName}
                      </p>
                      <p className="mt-0.5 text-xs text-[#90a0b7]">{loc?.name}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    data-testid={`confirm-${b.id}`}
                    onClick={() => {
                      setBookingStatus(b.id, "confirmada");
                    }}
                    className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-2xl text-sm font-extrabold text-white"
                    style={{ background: "linear-gradient(135deg,#0077b6,#00b4d8)" }}
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
