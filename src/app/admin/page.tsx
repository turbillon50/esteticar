"use client";

import Link from "next/link";
import { ArrowRight, DollarSign, MapPin, Sparkles } from "lucide-react";
import { useEsteticar } from "@/lib/store";

export default function AdminPage() {
  const services = useEsteticar((s) => s.services);
  const bookings = useEsteticar((s) => s.bookings);
  const locations = useEsteticar((s) => s.locations);

  return (
    <div className="min-h-full bg-[#f0f4f8] pb-8">
      <header
        className="px-5 pb-8 pt-14 text-white"
        style={{ background: "linear-gradient(150deg,#020b1a,#03045e,#0077b6)" }}
      >
        <p className="text-sm text-white/60">Modo admin</p>
        <h1 className="text-3xl font-extrabold">Esteticar</h1>
        <p className="text-sm text-white/70">Panel de Sergio Zapata · Cuernavaca</p>
      </header>

      <div className="grid grid-cols-2 gap-3 px-4 py-5">
        {[
          { label: "Citas", value: bookings.length },
          { label: "Sucursales", value: locations.length },
          { label: "Servicios", value: services.length },
          {
            label: "Pendientes",
            value: bookings.filter((b) => b.status === "pendiente").length,
          },
        ].map((c) => (
          <div key={c.label} className="rounded-3xl bg-white p-4">
            <p className="text-3xl font-extrabold text-[#03045e]">{c.value}</p>
            <p className="text-xs font-semibold text-[#90a0b7]">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 px-4">
        <Link
          href="/admin/servicios"
          className="flex items-center justify-between rounded-[22px] bg-white px-4 py-4"
        >
          <span className="flex items-center gap-3 font-extrabold">
            <DollarSign size={18} className="text-[#0077b6]" /> Subir precios
          </span>
          <ArrowRight size={16} className="text-[#90a0b7]" />
        </Link>
        <Link
          href="/servicios"
          className="flex items-center justify-between rounded-[22px] bg-white px-4 py-4"
        >
          <span className="flex items-center gap-3 font-extrabold">
            <Sparkles size={18} className="text-[#0077b6]" /> Ver catálogo
          </span>
          <ArrowRight size={16} className="text-[#90a0b7]" />
        </Link>
        <Link
          href="/sucursales"
          className="flex items-center justify-between rounded-[22px] bg-white px-4 py-4"
        >
          <span className="flex items-center gap-3 font-extrabold">
            <MapPin size={18} className="text-[#0077b6]" /> Sucursales
          </span>
          <ArrowRight size={16} className="text-[#90a0b7]" />
        </Link>
      </div>
    </div>
  );
}
