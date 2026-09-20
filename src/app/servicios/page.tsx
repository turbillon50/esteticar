"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { useEsteticar } from "@/lib/store";

export default function ServiciosPage() {
  const services = useEsteticar((s) => s.services);

  return (
    <div className="min-h-full bg-[var(--bg)] pb-8">
      <header className="page pb-2 pt-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--accent)]">
          Catálogo
        </p>
        <h1 className="display mt-1 text-[40px] text-[var(--fg)]">Servicios</h1>
        <p className="mt-1 text-[14px] font-medium text-[var(--fg-muted)]">
          Precios con IVA. Calidad premium, sin filas.
        </p>
      </header>

      <div className="page grid-services pt-2">
        {services.map((service) => (
          <article
            key={service.id}
            className="card overflow-hidden"
            data-testid={`service-card-${service.id}`}
          >
            <div className="relative h-[200px] overflow-hidden">
              <img src={service.image} alt="" className="h-full w-full object-cover" />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg,transparent 40%,rgba(7,20,40,0.72) 100%)",
                }}
              />
              <div className="absolute right-3.5 top-3.5 rounded-xl bg-[var(--navy)]/80 px-4 py-1.5 text-white">
                <span className="text-[19px] font-extrabold" data-testid={`price-${service.id}`}>
                  ${service.price.toLocaleString("es-MX")}
                </span>
              </div>
              <div className="absolute bottom-3 left-4 text-white">
                <div className="mb-1 flex items-center gap-2 text-[#b8ecf6]">
                  <Clock size={12} />
                  <span className="text-xs font-bold">{service.durationMinutes} min</span>
                </div>
                <h2 className="text-[22px] font-extrabold leading-tight">{service.name}</h2>
              </div>
            </div>
            <div className="px-4 py-4">
              <p className="mb-3 text-[13px] leading-relaxed text-[var(--fg-muted)]">
                {service.description}
              </p>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {service.features.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-[11px] font-semibold text-[var(--fg)]"
                  >
                    <CheckCircle2 size={10} className="text-[var(--accent)]" />
                    {f}
                  </span>
                ))}
              </div>
              <Link href="/agenda" className="cta w-full justify-center gap-2 text-[15px]">
                Reservar <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
