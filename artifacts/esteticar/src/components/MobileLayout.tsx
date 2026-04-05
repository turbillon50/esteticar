import React from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";
import { BsHouseDoorFill, BsHouseDoor, BsCalendarCheckFill, BsCalendarCheck, BsPersonFill, BsPerson, BsClockFill, BsClock, BsListUl } from "react-icons/bs";
import { HiOutlineWrenchScrewdriver, HiWrenchScrewdriver } from "react-icons/hi2";

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();
  
  // Exclude bottom nav on auth screens or booking flow screens
  const showBottomNav = !location.startsWith('/login') && 
                        !location.startsWith('/register') &&
                        !location.startsWith('/book');

  return (
    <div className="min-h-[100dvh] w-full bg-gray-100 flex justify-center overflow-hidden">
      {/* Mobile App Container */}
      <div className="w-full max-w-[430px] bg-background min-h-[100dvh] shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto w-full pb-[80px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        {showBottomNav && <BottomNav role={user?.role} location={location} />}
      </div>
    </div>
  );
}

function BottomNav({ role, location }: { role?: string; location: string }) {
  let links = [];

  if (role === "customer") {
    links = [
      { href: "/", label: "Inicio", icon: location === "/" ? BsHouseDoorFill : BsHouseDoor },
      { href: "/bookings", label: "Citas", icon: location.startsWith("/bookings") ? BsCalendarCheckFill : BsCalendarCheck },
      { href: "/profile", label: "Perfil", icon: location === "/profile" ? BsPersonFill : BsPerson },
    ];
  } else if (role === "provider") {
    links = [
      { href: "/", label: "Hoy", icon: location === "/" ? BsClockFill : BsClock },
      { href: "/schedule", label: "Agenda", icon: location === "/schedule" ? BsCalendarCheckFill : BsCalendarCheck },
      { href: "/history", label: "Historial", icon: location === "/history" ? BsListUl : BsListUl },
    ];
  } else if (role === "admin") {
    links = [
      { href: "/admin", label: "Dashboard", icon: location === "/admin" ? BsHouseDoorFill : BsHouseDoor },
      { href: "/admin/bookings", label: "Reservas", icon: location === "/admin/bookings" ? BsCalendarCheckFill : BsCalendarCheck },
      { href: "/admin/services", label: "Ajustes", icon: location.startsWith("/admin/services") ? HiWrenchScrewdriver : HiOutlineWrenchScrewdriver },
    ];
  } else {
    // Public
    links = [
      { href: "/", label: "Inicio", icon: location === "/" ? BsHouseDoorFill : BsHouseDoor },
      { href: "/services", label: "Servicios", icon: location === "/services" ? BsListUl : BsListUl },
      { href: "/login", label: "Ingresar", icon: location === "/login" ? BsPersonFill : BsPerson },
    ];
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border z-50 px-6 py-2 pb-safe flex justify-between items-center h-[80px]">
      {links.map((link) => {
        const isActive = link.href === "/" ? location === "/" : location.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link key={link.href} href={link.href} className="flex-1 flex flex-col items-center justify-center gap-1 tap-highlight-transparent">
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center justify-center w-16 h-12 rounded-2xl ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Icon className="text-[24px]" />
              <span className="text-[10px] font-medium mt-1">{link.label}</span>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
