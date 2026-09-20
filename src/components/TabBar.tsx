"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Droplets, Home, MapPin, Plus } from "lucide-react";
import { useEsteticar } from "@/lib/store";

export function TabBar() {
  const pathname = usePathname();
  const role = useEsteticar((s) => s.role);

  const left = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/citas", label: "Citas", icon: CalendarCheck },
  ];
  const right =
    role === "proveedor"
      ? [
          { href: "/sucursales", label: "Mapa", icon: MapPin },
          { href: "/proveedor", label: "Hoy", icon: CalendarCheck },
        ]
      : role === "admin"
        ? [
            { href: "/sucursales", label: "Mapa", icon: MapPin },
            { href: "/admin", label: "Admin", icon: CalendarCheck },
          ]
        : [
            { href: "/sucursales", label: "Mapa", icon: MapPin },
            { href: "/servicios", label: "Lavados", icon: Droplets },
          ];

  const Item = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: typeof Home;
  }) => {
    const on = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link href={href} className={`tab ${on ? "is-on" : ""}`}>
        <span className="tab-ico">
          <Icon size={20} strokeWidth={on ? 2.5 : 2} />
        </span>
        <span className="tab-lab">{label}</span>
      </Link>
    );
  };

  return (
    <nav className="tabbar" aria-label="Principal">
      {left.map((l) => (
        <Item key={l.href} {...l} />
      ))}
      <Link href="/agenda" className="fab" aria-label="Agendar lavado">
        <Plus size={22} strokeWidth={2.6} />
      </Link>
      {right.map((l) => (
        <Item key={l.href + l.label} {...l} />
      ))}
    </nav>
  );
}
