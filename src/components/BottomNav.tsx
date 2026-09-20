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
  Wrench,
} from "lucide-react";
import { useEsteticar } from "@/lib/store";

export function BottomNav() {
  const pathname = usePathname();
  const role = useEsteticar((s) => s.role);

  const links =
    role === "proveedor"
      ? [
          { href: "/proveedor", label: "Hoy", icon: CalendarCheck },
          { href: "/citas", label: "Agenda", icon: LayoutGrid },
          { href: "/perfil", label: "Perfil", icon: User },
        ]
      : role === "admin"
        ? [
            { href: "/admin", label: "Admin", icon: Shield },
            { href: "/admin/servicios", label: "Precios", icon: Wrench },
            { href: "/servicios", label: "Catálogo", icon: Droplets },
            { href: "/perfil", label: "Perfil", icon: User },
          ]
        : [
            { href: "/", label: "Inicio", icon: Droplets },
            { href: "/sucursales", label: "Sucursales", icon: MapPin },
            { href: "/servicios", label: "Servicios", icon: LayoutGrid },
            { href: "/citas", label: "Citas", icon: CalendarCheck },
            { href: "/perfil", label: "Perfil", icon: User },
          ];

  return (
    <nav
      className="sticky bottom-0 z-30 grid border-t border-white/40 bg-white/92 px-1 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl"
      style={{ gridTemplateColumns: `repeat(${links.length}, 1fr)` }}
    >
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/"
            ? pathname === "/"
            : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 rounded-2xl py-1.5"
            style={{ color: active ? "#0077b6" : "#90a0b7" }}
          >
            <span
              className="grid h-8 w-8 place-items-center rounded-2xl"
              style={{
                background: active ? "rgba(0,180,216,0.14)" : "transparent",
              }}
            >
              <Icon size={18} strokeWidth={active ? 2.6 : 2} />
            </span>
            <span className="text-[10px] font-extrabold tracking-wide">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
