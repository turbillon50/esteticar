"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  Droplets,
  LayoutGrid,
  MapPin,
  Shield,
  User,
} from "lucide-react";
import { useEsteticar } from "@/lib/store";
import type { Role } from "@/lib/types";

const ROLES: { id: Role; label: string; hint: string }[] = [
  { id: "cliente", label: "Cliente", hint: "Agenda y paga tu lavado" },
  { id: "proveedor", label: "Lavador", hint: "Confirma citas del día" },
  { id: "admin", label: "Administración", hint: "Precios y sucursales" },
];

export function SideMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const role = useEsteticar((s) => s.role);
  const setRole = useEsteticar((s) => s.setRole);
  const name = useEsteticar((s) => s.customerName);
  const resetDemo = useEsteticar((s) => s.resetDemo);

  return (
    <>
      <button
        type="button"
        className={`scrim ${open ? "is-on" : ""}`}
        aria-label="Cerrar menú"
        onClick={onClose}
      />
      <aside className={`drawer ${open ? "is-on" : ""}`} aria-hidden={!open}>
        <div className="hero-light px-5 pb-5 pt-[calc(env(safe-area-inset-top)+20px)] text-white">
          <div className="mb-4 h-12 w-[168px] overflow-hidden rounded-xl ring-1 ring-white/15">
            <img src="/brand/logo.jpg" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-sm font-extrabold ring-1 ring-white/15">
              SZ
            </div>
            <div>
              <p className="text-[16px] font-extrabold leading-tight">{name}</p>
              <p className="text-[12px] font-medium text-[#b8ecf6]/80">Cuernavaca, Morelos</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <p className="mb-2 px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--fg-muted)]">
            Cuenta
          </p>
          <div className="card overflow-hidden">
            {ROLES.map((r, i) => {
              const on = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  data-testid={`role-${r.id}`}
                  onClick={() => setRole(r.id)}
                  className="flex w-full items-center justify-between px-3.5 py-3 text-left press"
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid var(--border)",
                    background: on ? "rgba(10,110,168,0.08)" : "transparent",
                  }}
                >
                  <span>
                    <span className="block text-[14px] font-bold text-[var(--fg)]">{r.label}</span>
                    <span className="text-[12px] text-[var(--fg-muted)]">{r.hint}</span>
                  </span>
                  <span
                    className="grid h-5 w-5 place-items-center rounded-full"
                    style={{
                      border: on ? "none" : "1.5px solid var(--line, #d5dee8)",
                      background: on ? "var(--accent)" : "transparent",
                    }}
                  >
                    {on ? (
                      <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mb-2 mt-5 px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--fg-muted)]">
            Navegación
          </p>
          <nav className="card overflow-hidden">
            {[
              { href: "/", label: "Inicio", Icon: LayoutGrid },
              { href: "/servicios", label: "Servicios", Icon: Droplets },
              { href: "/sucursales", label: "Sucursales", Icon: MapPin },
              { href: "/citas", label: "Mis citas", Icon: CalendarCheck },
              { href: "/perfil", label: "Perfil", Icon: User },
              ...(role === "proveedor" || role === "admin"
                ? [{ href: "/proveedor", label: "Panel lavador", Icon: CalendarCheck }]
                : []),
              ...(role === "admin"
                ? [{ href: "/admin", label: "Administración", Icon: Shield }]
                : []),
            ].map((item, i) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3.5 py-3 press"
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid var(--border)",
                    background: active ? "rgba(10,110,168,0.08)" : "transparent",
                    color: active ? "var(--accent)" : "var(--fg)",
                  }}
                >
                  <item.Icon size={18} strokeWidth={2.2} />
                  <span className="text-[14px] font-bold">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => {
              resetDemo();
              onClose();
            }}
            className="mt-5 w-full rounded-[14px] py-3 text-[13px] font-bold text-[var(--fg-muted)] press"
          >
            Restaurar datos de la app
          </button>
        </div>
      </aside>
    </>
  );
}
