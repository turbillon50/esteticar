import { useLocation } from "wouter";
import {
  useListServices,
  useListLocations,
  useGetDashboardSummary,
  getGetDashboardSummaryQueryKey,
} from "@workspace/api-client-react";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import {
  BsArrowRight,
  BsGeoAlt,
  BsClock,
  BsCheckCircleFill,
  BsCalendar3,
  BsStarFill,
  BsBell,
} from "react-icons/bs";

/* ─── tiny helpers ─────────────────────────────────── */
function badge(text: string, color = "bg-secondary/20 text-secondary") {
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${color}`}>
      {text}
    </span>
  );
}

/* ─── SERVICE CHIP (horizontal scroll) ─────────────── */
function ServiceChip({ service, onClick }: { service: any; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex-shrink-0 flex flex-col rounded-3xl overflow-hidden bg-white shadow-sm"
      style={{ width: 160, boxShadow: "0 2px 16px rgba(10,22,40,0.08)" }}
    >
      <div
        className="flex items-center justify-center relative overflow-hidden"
        style={{ height: 108, background: "linear-gradient(135deg, #e8f4f8 0%, #d1ecf5 100%)" }}
      >
        {service.imageUrl ? (
          <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl" style={{ color: "#00B4D8", opacity: 0.35, fontWeight: 900 }}>✦</span>
        )}
        <div
          className="absolute top-2 right-2 font-bold text-xs px-2 py-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.9)", color: "#0A1628" }}
        >
          ${Number(service.price).toLocaleString()}
        </div>
      </div>
      <div className="px-3 py-2.5">
        <p className="font-bold text-xs leading-tight" style={{ color: "#0A1628" }}>{service.name}</p>
        <div className="flex items-center gap-1 mt-1">
          <BsClock className="text-[10px]" style={{ color: "#9ca3af" }} />
          <span className="text-[10px] font-medium" style={{ color: "#9ca3af" }}>{service.durationMinutes} min</span>
        </div>
      </div>
    </motion.button>
  );
}

/* ─── LOCATION ROW ──────────────────────────────────── */
function LocationRow({ location, onClick }: { location: any; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center gap-3 p-3.5 rounded-2xl bg-white w-full text-left"
      style={{ boxShadow: "0 2px 12px rgba(10,22,40,0.07)" }}
    >
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #00B4D8, #0094b3)" }}
      >
        <BsGeoAlt className="text-white text-sm" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm truncate" style={{ color: "#0A1628" }}>{location.name}</p>
        <p className="text-xs truncate" style={{ color: "#9ca3af" }}>{location.address}</p>
      </div>
      <div className="flex items-center gap-0.5">
        <BsStarFill className="text-yellow-400 text-xs" />
        <span className="text-xs font-semibold" style={{ color: "#0A1628" }}>4.9</span>
      </div>
    </motion.button>
  );
}

/* ─── MAIN ──────────────────────────────────────────── */
export default function Home() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { data: services } = useListServices();
  const { data: locations } = useListLocations();
  const { data: dashboard } = useGetDashboardSummary({
    query: {
      queryKey: getGetDashboardSummaryQueryKey(),
      enabled: isAuthenticated && user?.role === "customer",
    },
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";
  const next = dashboard?.nextBooking;

  return (
    <div className="min-h-screen" style={{ background: "#f5f6f8" }}>

      {/* ── TOP DARK HEADER ── */}
      <div
        className="relative overflow-hidden px-5 pt-14 pb-28"
        style={{
          background: "linear-gradient(150deg, #0A1628 0%, #0d2240 60%, #0f2d54 100%)",
        }}
      >
        {/* decorative circles */}
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #00B4D8 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #00B4D8 0%, transparent 70%)", transform: "translate(-30%, 40%)" }} />

        {/* top row */}
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div>
            {isAuthenticated ? (
              <>
                <p className="text-white/50 text-sm font-medium mb-0.5">{greeting} 👋</p>
                <h1 className="text-2xl font-extrabold text-white leading-tight">
                  {user?.name?.split(" ")[0]}
                </h1>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #00B4D8, #0094b3)" }}>
                    <span className="text-white font-black text-xs">E</span>
                  </div>
                  <span className="text-white font-bold tracking-widest text-xs uppercase">Esteticar</span>
                </div>
                <h1 className="text-3xl font-extrabold text-white leading-tight">
                  Tu auto<br />merece lo mejor.
                </h1>
              </>
            )}
          </div>
          {isAuthenticated && (
            <button className="w-10 h-10 rounded-full flex items-center justify-center relative"
              style={{ background: "rgba(255,255,255,0.08)" }}>
              <BsBell className="text-white text-lg" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: "#00B4D8", boxShadow: "0 0 0 2px #0A1628" }} />
            </button>
          )}
        </div>

        {/* Stats chips for customers */}
        {isAuthenticated && user?.role === "customer" && dashboard && (
          <div className="flex gap-3 relative z-10 mb-0">
            <div className="flex-1 rounded-2xl px-4 py-3"
              style={{ background: "rgba(255,255,255,0.08)" }}>
              <p className="text-2xl font-black text-white">{dashboard.upcomingCount}</p>
              <p className="text-white/50 text-[11px] font-medium mt-0.5">Próximas</p>
            </div>
            <div className="flex-1 rounded-2xl px-4 py-3"
              style={{ background: "rgba(255,255,255,0.08)" }}>
              <p className="text-2xl font-black text-white">{dashboard.completedCount}</p>
              <p className="text-white/50 text-[11px] font-medium mt-0.5">Completadas</p>
            </div>
            <div className="flex-1 rounded-2xl px-4 py-3"
              style={{ background: "rgba(0,180,216,0.2)", border: "1px solid rgba(0,180,216,0.3)" }}>
              <p className="text-2xl font-black" style={{ color: "#00B4D8" }}>★</p>
              <p className="text-white/50 text-[11px] font-medium mt-0.5">Top cliente</p>
            </div>
          </div>
        )}

        {/* Public tagline */}
        {!isAuthenticated && (
          <p className="text-white/50 text-sm relative z-10">Sin filas. Sin esperas. Solo reserva.</p>
        )}
      </div>

      {/* ── FLOATING ACTION CARD (negative margin to overlay) ── */}
      <div className="px-4 -mt-16 relative z-20 mb-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => isAuthenticated ? navigate("/book") : navigate("/login")}
          className="w-full flex items-center gap-4 rounded-3xl px-5 py-4"
          style={{
            background: "#ffffff",
            boxShadow: "0 8px 40px rgba(10,22,40,0.18)",
          }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #00B4D8 0%, #0094b3 100%)" }}
          >
            <BsCalendar3 className="text-white text-xl" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-black text-base" style={{ color: "#0A1628" }}>Agendar lavado</p>
            <p className="text-xs font-medium mt-0.5" style={{ color: "#9ca3af" }}>
              Elige servicio · sucursal · horario
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#0A1628" }}
          >
            <BsArrowRight className="text-white text-sm" />
          </div>
        </motion.button>
      </div>

      {/* ── NEXT BOOKING CARD ── */}
      {isAuthenticated && user?.role === "customer" && next && (
        <div className="px-4 mb-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-4 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0A1628 0%, #0d2240 100%)",
              boxShadow: "0 4px 20px rgba(10,22,40,0.15)",
            }}
          >
            <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #00B4D8, transparent 70%)", transform: "translate(20%, -20%)" }} />
            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BsCheckCircleFill className="text-xs" style={{ color: "#00B4D8" }} />
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#00B4D8" }}>
                    Próxima cita
                  </span>
                </div>
                <p className="font-extrabold text-white text-base">{next.service?.name}</p>
                <p className="text-white/50 text-sm mt-0.5">{next.location?.name}</p>
                <p className="text-white/80 text-sm font-semibold mt-2">
                  {new Date(next.date + "T00:00:00").toLocaleDateString("es-MX", {
                    weekday: "short", month: "short", day: "numeric",
                  })} · {next.startTime}
                </p>
              </div>
              <button
                onClick={() => navigate("/bookings")}
                className="flex-shrink-0 h-9 px-3 rounded-xl text-xs font-bold"
                style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}
              >
                Ver
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── SERVICES ── */}
      <section className="mb-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-base font-extrabold" style={{ color: "#0A1628" }}>Servicios</h2>
          <button onClick={() => navigate("/services")}
            className="text-xs font-bold flex items-center gap-1"
            style={{ color: "#00B4D8" }}>
            Ver todos <BsArrowRight className="text-[10px]" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 px-5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {!services ? (
            [1, 2, 3].map(i => (
              <div key={i} className="flex-shrink-0 rounded-3xl bg-white animate-pulse"
                style={{ width: 160, height: 148 }} />
            ))
          ) : (
            services.map(s => (
              <ServiceChip key={s.id} service={s} onClick={() => navigate("/book")} />
            ))
          )}
        </div>
      </section>

      {/* ── LOCATIONS ── */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base font-extrabold" style={{ color: "#0A1628" }}>Sucursales</h2>
          <button onClick={() => navigate("/locations")}
            className="text-xs font-bold flex items-center gap-1"
            style={{ color: "#00B4D8" }}>
            Ver mapa <BsArrowRight className="text-[10px]" />
          </button>
        </div>
        <div className="space-y-2.5">
          {!locations ? (
            [1, 2].map(i => <div key={i} className="h-16 rounded-2xl bg-white animate-pulse" />)
          ) : (
            locations.slice(0, 3).map(l => (
              <LocationRow key={l.id} location={l} onClick={() => navigate("/book")} />
            ))
          )}
        </div>
      </section>

      {/* ── PUBLIC CTA ── */}
      {!isAuthenticated && (
        <div className="px-4 pb-8">
          <div className="rounded-3xl p-5 text-center"
            style={{
              background: "linear-gradient(135deg, #0A1628 0%, #0d2240 100%)",
              boxShadow: "0 4px 24px rgba(10,22,40,0.15)",
            }}>
            <p className="font-extrabold text-white text-base mb-1">Reserva en 2 minutos</p>
            <p className="text-white/50 text-sm mb-4">Sin registrarte no puedes agendar.</p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/register")}
                className="flex-1 h-12 rounded-2xl font-bold text-sm"
                style={{ background: "linear-gradient(135deg, #00B4D8, #0094b3)", color: "#fff" }}
              >
                Crear cuenta
              </button>
              <button
                onClick={() => navigate("/login")}
                className="flex-1 h-12 rounded-2xl font-bold text-sm"
                style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
