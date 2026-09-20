"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, LayoutGrid, MapPin, Plus, Wallet } from "lucide-react";

export function AdminTabBar() {
  const pathname = usePathname();
  const left = [
    { href: "/admin", label: "Hoy", icon: LayoutGrid, exact: true },
    { href: "/admin/citas", label: "Agenda", icon: CalendarCheck },
  ];
  const right = [
    { href: "/admin/caja", label: "Caja", icon: Wallet },
    { href: "/admin/sucursales", label: "Red", icon: MapPin },
  ];

  const Item = ({
    href,
    label,
    icon: Icon,
    exact,
  }: {
    href: string;
    label: string;
    icon: typeof LayoutGrid;
    exact?: boolean;
  }) => {
    const on = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
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
    <nav className="tabbar" aria-label="Administración">
      {left.map((l) => (
        <Item key={l.href} {...l} />
      ))}
      <Link href="/admin/sucursales?nueva=1" className="fab" aria-label="Dar de alta sucursal">
        <Plus size={22} strokeWidth={2.6} />
      </Link>
      {right.map((l) => (
        <Item key={l.href} {...l} />
      ))}
    </nav>
  );
}
