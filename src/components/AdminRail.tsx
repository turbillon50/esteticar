"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  CalendarCheck,
  DollarSign,
  LayoutGrid,
  MapPin,
  RotateCcw,
} from "lucide-react";
import { useEsteticar } from "@/lib/store";

const ITEMS = [
  { href: "/admin", label: "Panel", Icon: LayoutGrid, exact: true },
  { href: "/admin/sucursales", label: "Sucursales", Icon: MapPin },
  { href: "/admin/servicios", label: "Precios", Icon: DollarSign },
  { href: "/admin/citas", label: "Citas", Icon: CalendarCheck },
];

export function AdminRail() {
  const pathname = usePathname();
  const resetDemo = useEsteticar((s) => s.resetDemo);

  return (
    <aside className="rail ops-rail">
      <img
        src="/brand/logo.jpg"
        alt="Esteticar"
        className="mb-4 h-[64px] w-[64px] rounded-[16px] object-cover ring-1 ring-white/15"
      />
      <p className="px-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#2ec4e0]">
        Esteticar Ops
      </p>
      <p className="mb-6 px-1 text-[11px] font-medium text-white/50">Consola de Sergio Zapata</p>
      <nav className="flex flex-1 flex-col gap-1">
        {ITEMS.map((item) => {
          const on = item.exact
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-[14px] font-bold"
              style={{
                background: on ? "rgba(46,196,224,0.16)" : "transparent",
                color: on ? "#b8ecf6" : "rgba(255,255,255,0.78)",
              }}
            >
              <item.Icon size={16} strokeWidth={2.2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Link
        href="/"
        className="mb-2 flex items-center justify-center gap-2 rounded-[14px] px-3 py-2.5 text-[13px] font-bold text-white/70 ring-1 ring-white/10"
      >
        Ver app cliente <ArrowUpRight size={14} />
      </Link>
      <button
        type="button"
        onClick={resetDemo}
        className="flex items-center justify-center gap-2 rounded-[14px] px-3 py-2.5 text-[12px] font-bold text-white/45"
      >
        <RotateCcw size={13} /> Restaurar demo
      </button>
    </aside>
  );
}
