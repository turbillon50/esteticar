"use client";

import { Minus, Plus } from "lucide-react";
import { useEsteticar } from "@/lib/store";

export default function AdminServiciosPage() {
  const services = useEsteticar((s) => s.services);
  const bumpPrice = useEsteticar((s) => s.bumpPrice);
  const setPrice = useEsteticar((s) => s.setPrice);

  return (
    <div className="min-h-full bg-[var(--bg)] pb-10">
      <header className="page pb-2 pt-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--accent)]">
          Catálogo
        </p>
        <h1 className="display mt-1 text-[40px] text-[var(--fg)]">Precios</h1>
        <p className="mt-1 text-[14px] text-[var(--fg-muted)]">
          IVA incluido. El cambio se refleja al instante en /servicios.
        </p>
      </header>

      <div className="page grid gap-3 pt-2 md:grid-cols-3">
        {services.map((s) => (
          <article key={s.id} className="card overflow-hidden">
            <div className="relative h-32">
              <img src={s.image} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <p className="font-extrabold text-[var(--fg)]">{s.name}</p>
              <p className="text-[12px] text-[var(--fg-muted)]">{s.durationMinutes} min</p>
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
                  className="press flex h-11 flex-1 items-center justify-center gap-1 rounded-[14px] bg-[var(--bg)] text-sm font-extrabold"
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
              <label className="mt-3 grid gap-1 text-[11px] font-bold text-[var(--fg-muted)]">
                Precio exacto
                <input
                  type="number"
                  min={0}
                  className="field"
                  value={s.price}
                  onChange={(e) => setPrice(s.id, Number(e.target.value))}
                />
              </label>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
