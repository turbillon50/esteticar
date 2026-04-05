import React from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";
import {
  BsHouseDoorFill, BsHouseDoor,
  BsCalendarCheckFill, BsCalendarCheck,
  BsPersonFill, BsPerson,
  BsClockFill, BsClock,
  BsListUl,
  BsGridFill, BsGrid,
} from "react-icons/bs";
import { HiOutlineWrenchScrewdriver, HiWrenchScrewdriver } from "react-icons/hi2";

type NavLink = {
  href: string;
  label: string;
  ActiveIcon: React.ComponentType<any>;
  Icon: React.ComponentType<any>;
};

function getNavLinks(role?: string): NavLink[] {
  if (role === "customer") return [
    { href: "/", label: "Inicio", ActiveIcon: BsHouseDoorFill, Icon: BsHouseDoor },
    { href: "/bookings", label: "Citas", ActiveIcon: BsCalendarCheckFill, Icon: BsCalendarCheck },
    { href: "/profile", label: "Perfil", ActiveIcon: BsPersonFill, Icon: BsPerson },
  ];
  if (role === "provider") return [
    { href: "/", label: "Hoy", ActiveIcon: BsClockFill, Icon: BsClock },
    { href: "/schedule", label: "Agenda", ActiveIcon: BsCalendarCheckFill, Icon: BsCalendarCheck },
    { href: "/profile", label: "Perfil", ActiveIcon: BsPersonFill, Icon: BsPerson },
  ];
  if (role === "admin") return [
    { href: "/admin", label: "Inicio", ActiveIcon: BsGridFill, Icon: BsGrid },
    { href: "/admin/bookings", label: "Reservas", ActiveIcon: BsCalendarCheckFill, Icon: BsCalendarCheck },
    { href: "/admin/services", label: "Gestión", ActiveIcon: HiWrenchScrewdriver, Icon: HiOutlineWrenchScrewdriver },
    { href: "/profile", label: "Perfil", ActiveIcon: BsPersonFill, Icon: BsPerson },
  ];
  return [
    { href: "/", label: "Inicio", ActiveIcon: BsHouseDoorFill, Icon: BsHouseDoor },
    { href: "/services", label: "Servicios", ActiveIcon: BsListUl, Icon: BsListUl },
    { href: "/login", label: "Entrar", ActiveIcon: BsPersonFill, Icon: BsPerson },
  ];
}

const HIDE_NAV = ["/login", "/register", "/book"];

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();

  const showNav = !HIDE_NAV.some(r => location.startsWith(r));
  const links = getNavLinks(user?.role);

  return (
    /* Outer shell — dark navy bg so it looks like a phone on desktop */
    <div
      className="flex justify-center items-stretch"
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #050d1a 0%, #0a1628 100%)",
      }}
    >
      {/* Phone container — true flex column, height is exactly viewport */}
      <div
        className="flex flex-col w-full"
        style={{
          maxWidth: 430,
          height: "100dvh",
          background: "#f5f6f8",
          boxShadow: "0 0 80px rgba(0,0,0,0.6)",
          position: "relative",
        }}
      >
        {/* Scrollable content — flex-1 so it takes all space minus nav */}
        <div
          className="flex-1 overflow-y-auto overscroll-none"
          style={{ WebkitOverflowScrolling: "touch" } as any}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Nav — flex-shrink-0 so it's always visible */}
        {showNav && <BottomNav links={links} location={location} />}
      </div>
    </div>
  );
}

function BottomNav({ links, location }: { links: NavLink[]; location: string }) {
  return (
    <div
      className="flex-shrink-0 flex items-start justify-around px-2"
      style={{
        height: 76,
        paddingTop: 10,
        background: "rgba(255,255,255,0.98)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 -4px 24px rgba(10,22,40,0.09)",
      }}
    >
      {links.map(({ href, label, ActiveIcon, Icon }) => {
        const isActive = href === "/" ? location === "/" : location === href || location.startsWith(href + "/");
        const NavIcon = isActive ? ActiveIcon : Icon;

        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 flex-1 select-none"
          >
            <motion.div
              whileTap={{ scale: 0.82 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="flex flex-col items-center gap-1"
            >
              {/* Icon with active pill */}
              <div className="relative flex items-center justify-center" style={{ width: 44, height: 28 }}>
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "#0A1628" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <NavIcon
                  className="relative z-10"
                  style={{
                    fontSize: 19,
                    color: isActive ? "#00B4D8" : "#c4c9d4",
                  }}
                />
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: "0.03em",
                  color: isActive ? "#0A1628" : "#b0b8c8",
                  lineHeight: 1,
                }}
              >
                {label}
              </span>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
