"use client";

import Link from "next/link";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { useEsteticar } from "@/lib/store";

export default function AdminServiciosPage() {
  const services = useEsteticar((s) => s.services);
  const bumpPrice = useEsteticar((s) => s.bumpPrice);

  return (
    <div className="min-h-full bg-[var(--bg)] pb-8">
      <header className="page flex items-center gap-3 pb-2 pt-6">
        <Link
          href="/admin"
          className="grid h-11 w-11 place-items-center rounded-[14px] bg-white ring-1 ring-[var(--border)]"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--accent)]">
            Administración
          </p>
          <h1 className="display text-[32px] leading-none text-[var(--fg)]">Precios</h1>
        </div>
      </header>
      <p className="page pb-3 pt-0 text-[13px] font-semibold text-[var(--fg-muted)]">
        Sube un precio y ábrelo en Servicios — se refleja al instante.
      </p>

      <div className="page grid gap-3 pt-0 md:grid-cols-3">
        {services.map((s) => (
          <article key={s.id} className="card p-4">
            <p className="font-extrabold text-[var(--fg)]">{s.name}</p>
            <p
              className="mt-3 text-3xl font-extrabold text-[var(--accent)]"
              data-testid={`admin-price-${s.id}`}
            >
              ${s.price.toLocaleString("es-MX")}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => bumpPrice(s.id, -10)}
                className="press flex h-11 flex-1 items-center justify-center gap-1 rounded-[14px] bg-[var(--bg)] text-sm font-extrabold text-[var(--fg)]"
              >
                <Minus size={14} /> $10
              </button>
              <button
                type="button"
                data-testid={`bump-${s.id}`}
                onClick={() => bumpPrice(s.id, 20)}
                className="press flex h-11 flex-1 items-center justify-center gap-1 rounded-[14px] bg-[var(--accent)] text-sm font-extrabold text-white"
              >
                <Plus size={14} /> Subir $20
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
