import {
  BarChart3,
  CalendarCheck,
  DollarSign,
  LayoutGrid,
  MapPin,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type OpsNavItem = {
  href: string;
  label: string;
  group: string;
  Icon: LucideIcon;
  exact?: boolean;
};

export const OPS_NAV: OpsNavItem[] = [
  { href: "/admin", label: "Hoy", group: "Operar", Icon: LayoutGrid, exact: true },
  { href: "/admin/citas", label: "Agenda", group: "Operar", Icon: CalendarCheck },
  { href: "/admin/caja", label: "Caja", group: "Operar", Icon: Wallet },
  { href: "/admin/sucursales", label: "Red", group: "Red", Icon: MapPin },
  { href: "/admin/equipo", label: "Equipo", group: "Red", Icon: Users },
  { href: "/admin/servicios", label: "Precios", group: "Catálogo", Icon: DollarSign },
  { href: "/admin/reportes", label: "Reportes", group: "Inteligencia", Icon: BarChart3 },
];

export function opsActive(pathname: string, item: OpsNavItem) {
  if (item.exact) return pathname === "/admin";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
