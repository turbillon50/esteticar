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
  BsGeoAltFill, BsGeoAlt,
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
    { href: "/locations", label: "Sucursales", ActiveIcon: BsGeoAltFill, Icon: BsGeoAlt },
    { href: "/bookings", label: "Mis citas", ActiveIcon: BsCalendarCheckFill, Icon: BsCalendarCheck },
    { href: "/profile", label: "Perfil", ActiveIcon: BsPersonFill, Icon: BsPerson },
  ];
  if (role === "provider") return [
    { href: "/", label: "Hoy", ActiveIcon: BsClockFill, Icon: BsClock },
    { href: "/schedule", label: "Agenda", ActiveIcon: BsCalendarCheckFill, Icon: BsCalendarCheck },
    { href: "/profile", label: "Perfil", ActiveIcon: BsPersonFill, Icon: BsPerson },
  ];
  if (role === "admin") return [
    { href: "/admin", label: "Dashboard", ActiveIcon: BsGridFill, Icon: BsGrid },
    { href: "/admin/bookings", label: "Reservas", ActiveIcon: BsCalendarCheckFill, Icon: BsCalendarCheck },
    { href: "/admin/services", label: "Gestión", ActiveIcon: HiWrenchScrewdriver, Icon: HiOutlineWrenchScrewdriver },
    { href: "/profile", label: "Perfil", ActiveIcon: BsPersonFill, Icon: BsPerson },
  ];
  return [
    { href: "/", label: "Inicio", ActiveIcon: BsHouseDoorFill, Icon: BsHouseDoor },
    { href: "/locations", label: "Sucursales", ActiveIcon: BsGeoAltFill, Icon: BsGeoAlt },
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
    <>
      {/* ── DESKTOP (≥768px) ─────────────────────────────── */}
      <div className="hidden md:flex" style={{
        minHeight: "100dvh",
        background: "linear-gradient(145deg, #020b1a 0%, #03045e 40%, #0077b6 100%)",
      }}>
        {/* Sidebar */}
        {showNav && <DesktopSidebar links={links} location={location} user={user} />}

        {/* Content */}
        <main style={{
          flex: 1,
          overflowY: "auto",
          minHeight: "100dvh",
        }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ minHeight: "100%" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── MOBILE (<768px) ──────────────────────────────── */}
      <div className="flex md:hidden justify-center" style={{
        minHeight: "100dvh",
        background: "linear-gradient(160deg, #020b1a 0%, #03045e 50%, #0077b6 100%)",
      }}>
        <div className="flex flex-col w-full" style={{
          maxWidth: 430,
          height: "100dvh",
          background: "#f0f4f8",
          boxShadow: "0 0 80px rgba(0,119,182,0.35), 0 0 40px rgba(0,0,0,0.5)",
          position: "relative",
        }}>
          <div className="flex-1 overflow-y-auto overscroll-none"
            style={{ WebkitOverflowScrolling: "touch" } as any}>
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
    </>
  );
}

/* ── DESKTOP SIDEBAR ─────────────────────────────────────── */
function DesktopSidebar({ links, location, user }: { links: NavLink[]; location: string; user: any }) {
  return (
    <aside style={{
      width: 260,
      flexShrink: 0,
      height: "100dvh",
      position: "sticky",
      top: 0,
      display: "flex",
      flexDirection: "column",
      padding: "32px 20px",
      background: "rgba(3,4,94,0.55)",
      backdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(255,255,255,0.08)",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: "linear-gradient(135deg, #0077b6, #00b4d8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 900, color: "#fff",
          boxShadow: "0 4px 16px rgba(0,180,216,0.35)",
        }}>E</div>
        <div>
          <p style={{ color: "#fff", fontWeight: 900, fontSize: 16, letterSpacing: "0.05em" }}>ESTETICAR</p>
          <p style={{ color: "rgba(72,202,228,0.7)", fontSize: 11, fontWeight: 600 }}>Cuernavaca, Morelos</p>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        {links.map(({ href, label, ActiveIcon, Icon }) => {
          const isActive = href === "/" ? location === "/" : location === href || location.startsWith(href + "/");
          const NavIcon = isActive ? ActiveIcon : Icon;
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "12px 16px", borderRadius: 14,
                  background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                  border: isActive ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: isActive
                    ? "linear-gradient(135deg, #0077b6, #00b4d8)"
                    : "rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: isActive ? "0 4px 12px rgba(0,119,182,0.4)" : "none",
                }}>
                  <NavIcon style={{ fontSize: 16, color: isActive ? "#fff" : "rgba(255,255,255,0.45)" }} />
                </div>
                <span style={{
                  color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                  fontWeight: isActive ? 800 : 500,
                  fontSize: 14,
                }}>
                  {label}
                </span>
                {isActive && (
                  <div style={{
                    marginLeft: "auto", width: 6, height: 6, borderRadius: "50%",
                    background: "#48cae4",
                  }} />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User / login footer */}
      {user ? (
        <div style={{
          padding: "14px 16px", borderRadius: 16,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "linear-gradient(135deg, #0077b6, #48cae4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 900, color: "#fff", flexShrink: 0,
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.name}
              </p>
              <p style={{ color: "rgba(72,202,228,0.7)", fontSize: 11, textTransform: "capitalize" }}>{user.role}</p>
            </div>
          </div>
        </div>
      ) : (
        <Link href="/login">
          <motion.div whileTap={{ scale: 0.97 }} style={{
            padding: "13px 16px", borderRadius: 14, cursor: "pointer",
            background: "linear-gradient(135deg, #0077b6, #00b4d8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 20px rgba(0,119,182,0.4)",
          }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>Iniciar sesión</span>
          </motion.div>
        </Link>
      )}
    </aside>
  );
}

/* ── MOBILE BOTTOM NAV ───────────────────────────────────── */
function BottomNav({ links, location }: { links: NavLink[]; location: string }) {
  return (
    <div className="flex-shrink-0 flex items-start justify-around px-2" style={{
      height: 76, paddingTop: 10,
      background: "rgba(255,255,255,0.97)",
      backdropFilter: "blur(24px)",
      borderTop: "1px solid rgba(3,4,94,0.08)",
      boxShadow: "0 -6px 30px rgba(3,4,94,0.10)",
    }}>
      {links.map(({ href, label, ActiveIcon, Icon }) => {
        const isActive = href === "/" ? location === "/" : location === href || location.startsWith(href + "/");
        const NavIcon = isActive ? ActiveIcon : Icon;
        return (
          <Link key={href} href={href} className="flex flex-col items-center gap-1 flex-1 select-none">
            <motion.div whileTap={{ scale: 0.80 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="flex flex-col items-center gap-1">
              <div className="relative flex items-center justify-center" style={{ width: 48, height: 30 }}>
                {isActive && (
                  <motion.div layoutId="nav-active-pill" className="absolute inset-0 rounded-full"
                    style={{ background: "linear-gradient(135deg, #03045e, #0077b6)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <NavIcon className="relative z-10"
                  style={{ fontSize: 18, color: isActive ? "#48cae4" : "#b8c4d0" }} />
              </div>
              <span style={{
                fontSize: 10, fontWeight: isActive ? 800 : 500, letterSpacing: "0.03em",
                color: isActive ? "#03045e" : "#b8c4d0", lineHeight: 1,
              }}>{label}</span>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
