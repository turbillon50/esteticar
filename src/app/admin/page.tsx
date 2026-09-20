"use client";

import Link from "next/link";
import { ArrowRight, DollarSign, MapPin, Sparkles } from "lucide-react";
import { useEsteticar } from "@/lib/store";

export default function AdminPage() {
  const services = useEsteticar((s) => s.services);
  const bookings = useEsteticar((s) => s.bookings);
  const locations = useEsteticar((s) => s.locations);

  return (
    <div className="min-h-full bg-[var(--bg)] pb-8">
      <header className="hero-light px-6 pb-8 pt-8 text-white">
        <div className="mx-auto max-w-[1120px]">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#b8ecf6]">
            Administración
          </p>
          <h1 className="display text-[40px]">Panel</h1>
          <p className="text-sm text-white/70">Sergio Zapata · Cuernavaca</p>
        </div>
      </header>

      <div className="page grid grid-cols-2 gap-3 pt-6 md:grid-cols-4">
        {[
          { label: "Citas", value: bookings.length },
          { label: "Sucursales", value: locations.length },
          { label: "Servicios", value: services.length },
          {
            label: "Pendientes",
            value: bookings.filter((b) => b.status === "pendiente").length,
          },
        ].map((c) => (
          <div key={c.label} className="card p-4">
            <p className="text-3xl font-extrabold text-[var(--fg)]">{c.value}</p>
            <p className="text-xs font-semibold text-[var(--fg-muted)]">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="page flex flex-col gap-3 pt-4 md:max-w-xl">
        <Link href="/admin/servicios" className="card press flex items-center justify-between px-4 py-4">
          <span className="flex items-center gap-3 font-extrabold text-[var(--fg)]">
            <DollarSign size={18} className="text-[var(--accent)]" /> Subir precios
          </span>
          <ArrowRight size={16} className="text-[var(--fg-muted)]" />
        </Link>
        <Link href="/servicios" className="card press flex items-center justify-between px-4 py-4">
          <span className="flex items-center gap-3 font-extrabold text-[var(--fg)]">
            <Sparkles size={18} className="text-[var(--accent)]" /> Ver catálogo
          </span>
          <ArrowRight size={16} className="text-[var(--fg-muted)]" />
        </Link>
        <Link href="/sucursales" className="card press flex items-center justify-between px-4 py-4">
          <span className="flex items-center gap-3 font-extrabold text-[var(--fg)]">
            <MapPin size={18} className="text-[var(--accent)]" /> Sucursales
          </span>
          <ArrowRight size={16} className="text-[var(--fg-muted)]" />
        </Link>
      </div>
    </div>
  );
}
