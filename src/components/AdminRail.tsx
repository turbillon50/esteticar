"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { OPS_NAV, opsActive } from "@/components/ops/nav";
import { useEsteticar } from "@/lib/store";

export function AdminRail() {
  const pathname = usePathname();
  const resetDemo = useEsteticar((s) => s.resetDemo);
  const groups = ["Operar", "Red", "Catálogo", "Inteligencia"];

  return (
    <aside className="rail ops-rail">
      <div className="mb-6 flex items-center gap-3 px-1">
        <img
          src="/brand/logo.jpg"
          alt="Esteticar"
          className="h-11 w-11 rounded-[12px] object-cover ring-1 ring-white/15"
        />
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#2ec4e0]">
            Esteticar
          </p>
          <p className="text-[13px] font-extrabold text-white">Operaciones</p>
        </div>
      </div>
      <p className="mb-4 px-1 text-[11px] text-white/45">Sergio Zapata · Morelos</p>
      <nav className="flex flex-1 flex-col gap-4">
        {groups.map((g) => (
          <div key={g}>
            <p className="mb-1 px-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/35">
              {g}
            </p>
            {OPS_NAV.filter((i) => i.group === g).map((item) => {
              const on = opsActive(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-[12px] px-3 py-2 text-[13px] font-bold"
                  style={{
                    background: on ? "rgba(46,196,224,0.14)" : "transparent",
                    color: on ? "#d7f6ff" : "rgba(255,255,255,0.72)",
                  }}
                >
                  <item.Icon size={15} strokeWidth={2.2} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <Link
        href="/"
        className="mb-1 flex items-center justify-center gap-2 rounded-[12px] px-3 py-2.5 text-[12px] font-bold text-white/70 ring-1 ring-white/10"
      >
        App del cliente <ArrowUpRight size={13} />
      </Link>
      <button
        type="button"
        onClick={resetDemo}
        className="flex items-center justify-center gap-2 rounded-[12px] px-3 py-2 text-[11px] font-bold text-white/40"
      >
        <RotateCcw size={12} /> Restaurar demo
      </button>
    </aside>
  );
}
