"use client";

import Link from "next/link";
import { ArrowRight, CalendarCheck, DollarSign, MapPin, Power } from "lucide-react";
import { isOpenLocation } from "@/lib/types";
import { useEsteticar } from "@/lib/store";

export default function AdminHome() {
  const services = useEsteticar((s) => s.services);
  const bookings = useEsteticar((s) => s.bookings);
  const locations = useEsteticar((s) => s.locations);
  const setLocationActive = useEsteticar((s) => s.setLocationActive);

  const open = locations.filter(isOpenLocation);
  const down = locations.filter((l) => !isOpenLocation(l));
  const pending = bookings.filter((b) => b.status === "pendiente");
  const revenue = bookings.reduce((sum, b) => {
    const s = services.find((x) => x.id === b.serviceId);
    return sum + (s?.price ?? 0);
  }, 0);

  return (
    <div className="min-h-full bg-[var(--bg)] pb-10">
      <header className="hero-light px-6 pb-8 pt-7 text-white">
        <div className="mx-auto max-w-[1120px]">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#2ec4e0]">
            Esteticar Ops
          </p>
          <h1 className="display mt-2 text-[42px]">Consola</h1>
          <p className="mt-1 text-sm text-white/65">
            Liga aparte para Sergio. Lo que bajes aquí desaparece de la app del cliente.
          </p>
        </div>
      </header>

      <div className="page grid grid-cols-2 gap-3 pt-6 md:grid-cols-4">
        {[
          { label: "Sucursales activas", value: open.length },
          { label: "De baja", value: down.length },
          { label: "Citas pendientes", value: pending.length },
          { label: "Ingreso demo", value: `$${revenue.toLocaleString("es-MX")}` },
        ].map((c) => (
          <div key={c.label} className="card p-4">
            <p className="text-[28px] font-extrabold leading-none text-[var(--fg)]">{c.value}</p>
            <p className="mt-2 text-[11px] font-semibold text-[var(--fg-muted)]">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="page grid gap-3 pt-2 md:grid-cols-3">
        <Link href="/admin/sucursales?nueva=1" className="cta justify-center gap-2 text-[14px]">
          Dar de alta sucursal <ArrowRight size={16} />
        </Link>
        <Link
          href="/admin/sucursales"
          className="flex h-14 items-center justify-center gap-2 rounded-[18px] bg-white text-[14px] font-extrabold text-[var(--fg)] ring-1 ring-[var(--border)]"
        >
          <MapPin size={16} /> Red de lavados
        </Link>
        <Link
          href="/admin/servicios"
          className="flex h-14 items-center justify-center gap-2 rounded-[18px] bg-white text-[14px] font-extrabold text-[var(--fg)] ring-1 ring-[var(--border)]"
        >
          <DollarSign size={16} /> Precios con IVA
        </Link>
      </div>

      <section className="page pt-6">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="display text-[28px] text-[var(--fg)]">Red en vivo</h2>
          <Link href="/admin/sucursales" className="text-[12px] font-bold text-[var(--accent)]">
            Gestionar
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {locations.map((loc) => {
            const on = isOpenLocation(loc);
            return (
              <div key={loc.id} className="card flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-extrabold text-[var(--fg)]">{loc.name}</p>
                  <p className="truncate text-[12px] text-[var(--fg-muted)]">
                    {loc.city} · {loc.openTime}–{loc.closeTime}
                  </p>
                </div>
                <span className={on ? "pill-on" : "pill-off"}>{on ? "Activa" : "De baja"}</span>
                <button
                  type="button"
                  onClick={() => setLocationActive(loc.id, !on)}
                  className="press grid h-10 w-10 place-items-center rounded-[12px] bg-[var(--bg)]"
                  aria-label={on ? "Dar de baja" : "Dar de alta"}
                >
                  <Power size={16} className={on ? "text-[var(--accent)]" : "text-rose-500"} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="page pt-4">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="display text-[28px] text-[var(--fg)]">Entrantes</h2>
          <Link href="/admin/citas" className="text-[12px] font-bold text-[var(--accent)]">
            Ver todas
          </Link>
        </div>
        {pending.length === 0 ? (
          <p className="card p-6 text-sm font-semibold text-[var(--fg-muted)]">
            No hay citas pendientes.
          </p>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {pending.slice(0, 4).map((b) => (
              <Link key={b.id} href="/admin/citas" className="card press p-4">
                <p className="text-[12px] font-extrabold text-[var(--accent)]">{b.folio}</p>
                <p className="font-extrabold text-[var(--fg)]">{b.customerName}</p>
                <p className="mt-1 flex items-center gap-1 text-[12px] text-[var(--fg-muted)]">
                  <CalendarCheck size={12} /> {b.date} · {b.time}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
