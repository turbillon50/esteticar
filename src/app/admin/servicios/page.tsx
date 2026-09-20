"use client";

import { Minus, Plus } from "lucide-react";
import { OpsHead } from "@/components/ops/OpsHead";
import { mxn } from "@/lib/ops";
import { useEsteticar } from "@/lib/store";

export default function AdminServiciosPage() {
  const services = useEsteticar((s) => s.services);
  const bumpPrice = useEsteticar((s) => s.bumpPrice);
  const setPrice = useEsteticar((s) => s.setPrice);

  return (
    <div className="ops-page">
      <OpsHead
        kicker="Catálogo"
        title="Precios"
        hint="IVA incluido. El cambio se refleja al instante en la app del cliente."
      />
      <div className="page ops-pad grid gap-3 md:grid-cols-3">
        {services.map((s) => (
          <article key={s.id} className="ops-loc overflow-hidden p-0">
            <div className="relative h-32">
              <img src={s.image} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <p className="font-extrabold text-[var(--fg)]">{s.name}</p>
              <p className="text-[12px] text-[var(--fg-muted)]">{s.durationMinutes} min</p>
              <p
                className="mt-3 text-3xl font-extrabold text-[var(--accent)] num"
                data-testid={`admin-price-${s.id}`}
              >
                {mxn(s.price)}
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
