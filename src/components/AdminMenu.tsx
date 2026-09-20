"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { OPS_NAV, opsActive } from "@/components/ops/nav";
import { useEsteticar } from "@/lib/store";

export function AdminMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const name = useEsteticar((s) => s.customerName);

  return (
    <>
      <button
        type="button"
        className={`scrim ${open ? "is-on" : ""}`}
        aria-label="Cerrar menú"
        onClick={onClose}
      />
      <aside
        className={`drawer ${open ? "is-on" : ""}`}
        aria-hidden={!open}
        style={{ transform: open ? "translateX(0)" : "translateX(-104%)" }}
      >
        <div className="hero-light px-5 pb-5 pt-[calc(env(safe-area-inset-top)+20px)] text-white">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#2ec4e0]">
            Esteticar Ops
          </p>
          <p className="mt-2 text-[18px] font-extrabold">{name}</p>
          <p className="text-[12px] text-white/60">Operaciones · Morelos</p>
        </div>
        <nav className="flex-1 px-4 py-4">
          <div className="card overflow-hidden">
            {OPS_NAV.map((item, i) => {
              const on = opsActive(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3.5 py-3 press"
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid var(--border)",
                    background: on ? "rgba(10,110,168,0.08)" : "transparent",
                    color: on ? "var(--accent)" : "var(--fg)",
                  }}
                >
                  <item.Icon size={18} />
                  <span className="text-[14px] font-bold">{item.label}</span>
                </Link>
              );
            })}
          </div>
          <Link
            href="/"
            onClick={onClose}
            className="mt-4 flex items-center justify-center gap-2 rounded-[14px] py-3 text-[13px] font-bold text-[var(--fg-muted)]"
          >
            Ir a la app del cliente <ArrowUpRight size={14} />
          </Link>
        </nav>
      </aside>
    </>
  );
}
