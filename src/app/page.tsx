"use client";

import Link from "next/link";
import { ArrowRight, Clock, MapPin, Shield } from "lucide-react";
import { useEsteticar, useOpenLocations } from "@/lib/store";

const CITIES = ["Cuernavaca", "Jiutepec", "Cuautla", "Temixco", "Yautepec", "Jojutla"];

export default function HomePage() {
  const services = useEsteticar((s) => s.services);
  const locations = useOpenLocations();

  return (
    <div className="min-h-full bg-[var(--bg)] pb-10">
      <section className="home-hero">
        <img src="/brand/hero.jpg" alt="" className="home-hero-img" />
        <div className="home-hero-veil" />
        <div className="home-hero-copy stagger">
          <img src="/brand/logo.jpg" alt="Esteticar" className="home-logo-plate" />
          <p className="kicker">Autolavado a domicilio · Morelos</p>
          <h1 className="display">
            El lavado
            <br />
            <em>que merece</em>
            <br />
            tu auto.
          </h1>
          <p className="lede">
            {locations.length} sucursales en 6 ciudades. Pago adelantado con tarjeta,
            transferencia u OXXO.
          </p>
          <Link href="/agenda" className="cta mt-7">
            <span>
              <span className="block text-[15px]">Agendar mi lavado</span>
              <span className="text-[11px] font-semibold text-white/70">
                Servicio · fecha · sucursal · horario
              </span>
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </section>

      <div className="ticker">
        {CITIES.concat(CITIES).map((c, i) => (
          <span key={c + i}>{c}</span>
        ))}
      </div>

      <section className="page pt-6">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--accent)]">
              Precios con IVA
            </p>
            <h2 className="display mt-1 text-[32px] text-[var(--fg)]">Servicios</h2>
          </div>
          <Link href="/servicios" className="text-[13px] font-bold text-[var(--accent)]">
            Ver todos
          </Link>
        </div>
        <div className="grid-services">
          {services.map((s) => (
            <Link key={s.id} href="/agenda" className="card press overflow-hidden">
              <div className="relative h-44">
                <img src={s.image} alt="" className="h-full w-full object-cover" />
                <span className="absolute right-3 top-3 rounded-xl bg-[var(--navy)]/80 px-3 py-1 text-[16px] font-extrabold text-white">
                  ${s.price}
                </span>
              </div>
              <div className="px-4 py-4">
                <p className="text-[17px] font-extrabold leading-tight text-[var(--fg)]">{s.name}</p>
                <p className="mt-1 flex items-center gap-1 text-[12px] font-semibold text-[var(--fg-muted)]">
                  <Clock size={12} /> {s.durationMinutes} min · IVA incluido
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { icon: MapPin, label: `${locations.length} sucursales` },
            { icon: Shield, label: "Pago adelantado" },
            { icon: Clock, label: "Desde 30 min" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="card px-2 py-4 text-center">
              <Icon size={16} className="mx-auto mb-1 text-[var(--accent)]" />
              <p className="text-[12px] font-bold leading-tight text-[var(--fg)]">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
