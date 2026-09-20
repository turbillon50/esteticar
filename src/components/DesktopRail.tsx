"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  Droplets,
  LayoutGrid,
  MapPin,
  Plus,
  Shield,
  User,
} from "lucide-react";
import { useEsteticar } from "@/lib/store";

export function DesktopRail() {
  const pathname = usePathname();
  const role = useEsteticar((s) => s.role);

  const items = [
    { href: "/", label: "Inicio", Icon: LayoutGrid },
    { href: "/servicios", label: "Servicios", Icon: Droplets },
    { href: "/sucursales", label: "Sucursales", Icon: MapPin },
    { href: "/citas", label: "Citas", Icon: CalendarCheck },
    { href: "/perfil", label: "Perfil", Icon: User },
    ...(role === "proveedor" || role === "admin"
      ? [{ href: "/proveedor", label: "Lavador", Icon: CalendarCheck }]
      : []),
    ...(role === "admin" ? [{ href: "/admin", label: "Admin", Icon: Shield }] : []),
  ];

  return (
    <aside className="rail">
      <img
        src="/brand/logo.jpg"
        alt="Esteticar"
        className="mb-7 h-[72px] w-[72px] rounded-[18px] object-cover ring-1 ring-white/15"
      />
      <p className="mb-6 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8ecf6]/70">
        Morelos · a domicilio
      </p>
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const on =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-[14px] font-bold transition-[background,transform] duration-150"
              style={{
                background: on ? "rgba(46,196,224,0.14)" : "transparent",
                color: on ? "#b8ecf6" : "rgba(255,255,255,0.78)",
              }}
            >
              <item.Icon size={16} strokeWidth={2.2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Link href="/agenda" className="cta mt-4 w-full justify-center gap-2 text-[14px]">
        <Plus size={16} strokeWidth={2.6} /> Agendar
      </Link>
    </aside>
  );
}
