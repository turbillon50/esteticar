"use client";

import Link from "next/link";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { useEsteticar } from "@/lib/store";

export default function AdminServiciosPage() {
  const services = useEsteticar((s) => s.services);
  const bumpPrice = useEsteticar((s) => s.bumpPrice);

  return (
    <div className="min-h-full bg-[#f0f4f8] pb-8">
      <header className="flex items-center gap-3 px-4 pb-2 pt-14">
        <Link
          href="/admin"
          className="grid h-10 w-10 place-items-center rounded-full bg-white"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#0077b6]">
            Admin
          </p>
          <h1 className="text-2xl font-extrabold leading-none">Precios</h1>
        </div>
      </header>
      <p className="px-5 pb-3 text-[13px] font-semibold text-[#90a0b7]">
        Sube un precio y ábrelo en /servicios — se refleja al instante (misma demo).
      </p>

      <div className="flex flex-col gap-3 px-4">
        {services.map((s) => (
          <article
            key={s.id}
            className="rounded-[22px] bg-white p-4 shadow-[0_2px_12px_rgba(3,4,94,0.07)]"
          >
            <p className="font-extrabold text-[#03045e]">{s.name}</p>
            <p className="mt-3 text-3xl font-extrabold text-[#0077b6]" data-testid={`admin-price-${s.id}`}>
              ${s.price.toLocaleString("es-MX")}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => bumpPrice(s.id, -10)}
                className="flex h-11 flex-1 items-center justify-center gap-1 rounded-2xl bg-[#f0f4f8] text-sm font-extrabold"
              >
                <Minus size={14} /> $10
              </button>
              <button
                type="button"
                data-testid={`bump-${s.id}`}
                onClick={() => bumpPrice(s.id, 20)}
                className="flex h-11 flex-1 items-center justify-center gap-1 rounded-2xl text-sm font-extrabold text-white"
                style={{ background: "linear-gradient(135deg,#0077b6,#00b4d8)" }}
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
