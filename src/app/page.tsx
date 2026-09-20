"use client";

import Link from "next/link";
import { ArrowRight, Droplets, MapPin, Shield, Sparkles } from "lucide-react";
import { useEsteticar } from "@/lib/store";

export default function HomePage() {
  const services = useEsteticar((s) => s.services);
  const locations = useEsteticar((s) => s.locations);

  return (
    <div className="min-h-full bg-[#f0f4f8]">
      <section className="relative overflow-hidden px-5 pb-10 pt-12 text-white">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(165deg,#010b1f 0%,#03045e 30%,#0077b6 65%,#00b4d8 100%)",
          }}
        />
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,rgba(3,4,94,0.25) 0%,rgba(2,11,31,0.92) 100%)",
          }}
        />
        <div className="relative z-10">
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/25 bg-white/10">
                <Droplets size={16} className="text-[#48cae4]" />
              </span>
              <span className="text-sm font-extrabold tracking-[0.18em]">ESTETICAR</span>
            </div>
            <Link
              href="/perfil"
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-[#48cae4]"
            >
              Demo
            </Link>
          </div>
          <p className="mb-2 text-sm font-semibold text-[#90e0ef]/80">
            Autolavado a domicilio · Morelos
          </p>
          <h1 className="mb-3 text-[42px] font-extrabold leading-[0.95]">
            El lavado
            <br />
            <span
              style={{
                backgroundImage: "linear-gradient(90deg,#48cae4,#90e0ef)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              que merece
            </span>
            <br />
            tu auto.
          </h1>
          <p className="mb-7 max-w-[300px] text-[15px] font-medium leading-relaxed text-white/65">
            9 sucursales en 6 ciudades. Pago por adelantado con tarjeta, transferencia u OXXO.
          </p>
          <Link
            href="/agenda"
            className="flex h-[60px] items-center justify-between rounded-[20px] px-5"
            style={{
              background: "linear-gradient(135deg,#0077b6,#00b4d8)",
              boxShadow: "0 8px 32px rgba(0,119,182,0.5)",
            }}
          >
            <span>
              <span className="block text-base font-extrabold">Agendar mi lavado</span>
              <span className="text-[11px] font-semibold text-white/70">
                Servicio · fecha · sucursal · horario · pago
              </span>
            </span>
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/20">
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </section>

      <section className="px-4 pb-8">
        <div className="-mt-4 mb-5 flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-[#0077b6]/30 to-transparent" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0077b6]">
            Precios con IVA
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-[#0077b6]/30 to-transparent" />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {services.map((s) => (
            <Link
              key={s.id}
              href="/agenda"
              className="w-[78%] shrink-0 overflow-hidden rounded-[26px] text-white shadow-[0_10px_40px_rgba(3,4,94,0.22)]"
              style={{
                background:
                  "linear-gradient(145deg,#03045e 0%,#0077b6 45%,#00b4d8 100%)",
              }}
            >
              <div className="relative h-36">
                <img src={s.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03045e] to-transparent" />
                <span className="absolute right-3 top-3 rounded-xl bg-black/45 px-3 py-1 text-lg font-extrabold backdrop-blur">
                  ${s.price}
                </span>
              </div>
              <div className="px-4 pb-4 pt-2">
                <p className="text-lg font-extrabold leading-tight">{s.name}</p>
                <p className="mt-1 text-xs text-white/70">{s.durationMinutes} min</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {[
            { icon: MapPin, label: `${locations.length} sucursales` },
            { icon: Sparkles, label: "Pago adelantado" },
            { icon: Shield, label: "Demo Morelos" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="rounded-2xl bg-white px-2 py-3 text-center shadow-[0_2px_10px_rgba(3,4,94,0.06)]"
            >
              <Icon size={16} className="mx-auto mb-1 text-[#0077b6]" />
              <p className="text-[11px] font-bold leading-tight text-[#03045e]">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
