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
    <div
      className="flex justify-center items-stretch"
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(160deg, #020b1a 0%, #03045e 50%, #0077b6 100%)",
      }}
    >
      <div
        className="flex flex-col w-full"
        style={{
          maxWidth: 430,
          height: "100dvh",
          background: "#f0f4f8",
          boxShadow: "0 0 100px rgba(0,119,182,0.4), 0 0 40px rgba(0,0,0,0.6)",
          position: "relative",
        }}
      >
        <div
          className="flex-1 overflow-y-auto overscroll-none"
          style={{ WebkitOverflowScrolling: "touch" } as any}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

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
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(3,4,94,0.08)",
        boxShadow: "0 -6px 30px rgba(3,4,94,0.10)",
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
              whileTap={{ scale: 0.80 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="relative flex items-center justify-center" style={{ width: 48, height: 30 }}>
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #03045e, #0077b6)",
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <NavIcon
                  className="relative z-10"
                  style={{
                    fontSize: 18,
                    color: isActive ? "#48cae4" : "#b8c4d0",
                  }}
                />
              </div>

              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 800 : 500,
                  letterSpacing: "0.03em",
                  color: isActive ? "#03045e" : "#b8c4d0",
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
