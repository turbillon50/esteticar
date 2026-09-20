"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { useEsteticar } from "@/lib/store";

const GRADS = [
  "linear-gradient(145deg,#03045e 0%,#0077b6 45%,#00b4d8 80%,#90e0ef 100%)",
  "linear-gradient(145deg,#005f73 0%,#0a9396 50%,#48cae4 85%,#caf0f8 100%)",
  "linear-gradient(145deg,#10002b 0%,#3a0ca3 45%,#4cc9f0 100%)",
];

export default function ServiciosPage() {
  const services = useEsteticar((s) => s.services);

  return (
    <div className="min-h-full bg-[#f0f4f8] pb-8">
      <div className="relative h-[200px] overflow-hidden rounded-b-[28px]">
        <img
          src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=900&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,rgba(3,4,94,0.55) 0%,rgba(3,4,94,0.88) 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 text-white">
          <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#48cae4]/85">
            Catálogo
          </p>
          <h1 className="text-[30px] font-extrabold leading-none">Nuestros servicios</h1>
          <p className="mt-1 text-[13px] text-[#90e0ef]/70">Precios con IVA. Calidad premium, sin filas.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 px-4">
        {services.map((service, i) => (
          <article
            key={service.id}
            className="relative overflow-hidden rounded-[26px] text-white shadow-[0_10px_40px_rgba(3,4,94,0.25)]"
            style={{ background: GRADS[i % GRADS.length] }}
            data-testid={`service-card-${service.id}`}
          >
            <div className="relative h-[200px] overflow-hidden">
              <img src={service.image} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#03045e]/80 to-transparent" />
              <div
                className="absolute right-3.5 top-3.5 rounded-xl border border-white/25 px-4 py-1.5"
                style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)" }}
              >
                <span className="text-[19px] font-extrabold" data-testid={`price-${service.id}`}>
                  ${service.price.toLocaleString("es-MX")}
                </span>
              </div>
            </div>
            <div className="px-5 pb-5 pt-4">
              <div className="mb-1.5 flex items-center gap-2 text-[#48cae4]">
                <Clock size={12} />
                <span className="text-xs font-bold">{service.durationMinutes} min</span>
              </div>
              <h2 className="mb-2 text-2xl font-extrabold leading-tight">{service.name}</h2>
              <p className="mb-3.5 text-[13px] leading-relaxed text-white/65">{service.description}</p>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {service.features.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold"
                  >
                    <CheckCircle2 size={10} className="text-[#48cae4]" />
                    {f}
                  </span>
                ))}
              </div>
              <Link
                href="/agenda"
                className="flex h-[50px] items-center justify-center gap-2 rounded-2xl border border-white/35 bg-white/18 text-[15px] font-extrabold"
              >
                Reservar <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
