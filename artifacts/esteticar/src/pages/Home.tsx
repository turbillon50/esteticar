import { useRef } from "react";
import { useLocation } from "wouter";
import {
  useListServices,
  useListLocations,
  useGetDashboardSummary,
  getGetDashboardSummaryQueryKey,
} from "@workspace/api-client-react";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { BsArrowRight, BsStarFill, BsClock, BsGeoAlt, BsCalendar3, BsBell } from "react-icons/bs";

/* ── Cinematic gradients — water / foam / splash ───────────── */
const SERVICE_GRADIENTS = [
  "linear-gradient(145deg, #03045e 0%, #0077b6 45%, #00b4d8 80%, #90e0ef 100%)",
  "linear-gradient(145deg, #005f73 0%, #0a9396 50%, #94d2bd 90%, #e9f5db 100%)",
  "linear-gradient(145deg, #1a1a2e 0%, #16213e 30%, #0f3460 65%, #00b4d8 100%)",
  "linear-gradient(145deg, #023e8a 0%, #0096c7 55%, #48cae4 85%, #ade8f4 100%)",
];

const HERO_GRADIENT =
  "linear-gradient(160deg, #03045e 0%, #023e8a 25%, #0077b6 55%, #00b4d8 80%, #48cae4 100%)";

const FEATURED_GRADIENT =
  "linear-gradient(135deg, #0a1628 0%, #005f73 40%, #0096c7 70%, #48cae4 100%)";

/* ── HERO CARD ─────────────────────────────────────────────── */
function HeroCard({ isAuthenticated, navigate, name }: any) {
  return (
    <div
      className="relative overflow-hidden flex flex-col justify-between"
      style={{
        background: HERO_GRADIENT,
        borderRadius: 28,
        minHeight: 320,
        padding: "28px 24px 24px",
      }}
    >
      {/* Foam / bubble overlays */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 40% at 85% 15%, rgba(144,224,239,0.25) 0%, transparent 60%)",
      }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 40% 50% at 10% 80%, rgba(0,180,216,0.20) 0%, transparent 55%)",
      }} />
      {/* Bubbles */}
      {[
        { size: 80, top: -20, right: -20, op: 0.12 },
        { size: 50, top: 60, right: 30, op: 0.10 },
        { size: 120, bottom: -30, right: 40, op: 0.08 },
        { size: 35, top: 120, left: 20, op: 0.15 },
      ].map((b, i) => (
        <div key={i} style={{
          position: "absolute",
          width: b.size, height: b.size,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.3)",
          background: `rgba(255,255,255,${b.op})`,
          top: b.top, bottom: (b as any).bottom,
          right: (b as any).right, left: (b as any).left,
          pointerEvents: "none",
          backdropFilter: "blur(2px)",
        }} />
      ))}

      {/* Top row */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          {isAuthenticated ? (
            <>
              <p style={{ color: "rgba(144,224,239,0.8)", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                {new Date().getHours() < 12 ? "Buenos días" : new Date().getHours() < 19 ? "Buenas tardes" : "Buenas noches"} 👋
              </p>
              <p style={{ color: "#fff", fontSize: 26, fontWeight: 900, lineHeight: 1.1 }}>
                {name?.split(" ")[0]}
              </p>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "linear-gradient(135deg, #48cae4, #0096c7)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 900, color: "#fff",
                }}>E</div>
                <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 800, letterSpacing: "0.12em", fontSize: 12 }}>ESTETICAR</span>
              </div>
              <p style={{ color: "#fff", fontSize: 30, fontWeight: 900, lineHeight: 1.1, marginBottom: 8 }}>
                Tu auto merece<br />lo mejor.
              </p>
              <p style={{ color: "rgba(144,224,239,0.8)", fontSize: 14, fontWeight: 500 }}>
                Sin filas. Sin esperas. Solo reserva.
              </p>
            </>
          )}
        </div>
        {isAuthenticated && (
          <button style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)",
          }}>
            <BsBell style={{ color: "#fff", fontSize: 16 }} />
          </button>
        )}
      </div>

      {/* CTA Button */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => navigate(isAuthenticated ? "/book" : "/login")}
        className="relative z-10"
        style={{
          width: "100%",
          height: 52,
          borderRadius: 16,
          background: "rgba(255,255,255,0.15)",
          border: "1.5px solid rgba(255,255,255,0.35)",
          backdropFilter: "blur(12px)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 18px",
          marginTop: 24,
        }}
      >
        <div style={{ textAlign: "left" }}>
          <p style={{ color: "#fff", fontWeight: 900, fontSize: 15 }}>Agendar lavado</p>
          <p style={{ color: "rgba(144,224,239,0.75)", fontSize: 11, fontWeight: 500, marginTop: 1 }}>
            Servicio · sucursal · horario
          </p>
        </div>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "linear-gradient(135deg, #00b4d8, #0077b6)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <BsArrowRight style={{ color: "#fff", fontSize: 14 }} />
        </div>
      </motion.button>
    </div>
  );
}

/* ── APPLE-STYLE FEATURED CARD ─────────────────────────────── */
function FeaturedCard({ service, gradient, onClick }: any) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex-shrink-0"
      style={{
        width: "85vw",
        maxWidth: 360,
        borderRadius: 24,
        overflow: "hidden",
        background: gradient,
        position: "relative",
        boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        scrollSnapAlign: "center",
      }}
    >
      {/* Foam shimmer */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 50% at 80% 20%, rgba(255,255,255,0.18) 0%, transparent 60%)",
      }} />
      {/* Bubbles */}
      {[
        { w: 90, h: 90, top: -15, right: -15, op: 0.12 },
        { w: 55, h: 55, top: 50, right: 20, op: 0.09 },
        { w: 40, h: 40, bottom: 60, left: 15, op: 0.10 },
      ].map((b, i) => (
        <div key={i} style={{
          position: "absolute",
          width: b.w, height: b.h, borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.25)",
          background: `rgba(255,255,255,${b.op})`,
          top: (b as any).top, bottom: (b as any).bottom,
          right: (b as any).right, left: (b as any).left,
        }} />
      ))}

      {/* Image */}
      <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {service.imageUrl ? (
          <img src={service.imageUrl} alt={service.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ fontSize: 72, fontWeight: 900, color: "rgba(255,255,255,0.15)", letterSpacing: -4 }}>
            ✦✦
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "16px 20px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 800, color: "rgba(144,224,239,0.9)",
            textTransform: "uppercase", letterSpacing: "0.12em",
          }}>
            Servicio destacado
          </span>
        </div>
        <p style={{ color: "#fff", fontSize: 22, fontWeight: 900, lineHeight: 1.1, marginBottom: 8 }}>
          {service.name}
        </p>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.4, marginBottom: 14 }}>
          {service.description?.slice(0, 70)}…
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <BsClock style={{ color: "rgba(144,224,239,0.7)", fontSize: 11 }} />
            <span style={{ color: "rgba(144,224,239,0.8)", fontSize: 12, fontWeight: 600 }}>
              {service.durationMinutes} min
            </span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 20, padding: "5px 14px",
            backdropFilter: "blur(8px)",
          }}>
            <span style={{ color: "#fff", fontSize: 16, fontWeight: 900 }}>
              ${Number(service.price).toLocaleString()}
            </span>
            <BsArrowRight style={{ color: "rgba(144,224,239,0.9)", fontSize: 12 }} />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

/* ── LOCATION ROW ───────────────────────────────────────────── */
function LocationRow({ location, onClick }: any) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 16px",
        background: "#fff",
        borderRadius: 18,
        width: "100%",
        textAlign: "left",
        boxShadow: "0 2px 12px rgba(3,4,94,0.08)",
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 14, flexShrink: 0,
        background: "linear-gradient(135deg, #0077b6, #00b4d8)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <BsGeoAlt style={{ color: "#fff", fontSize: 18 }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: "#03045e", fontWeight: 800, fontSize: 14, marginBottom: 2 }}>{location.name}</p>
        <p style={{ color: "#90a0b0", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {location.address}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
        <BsStarFill style={{ color: "#fbbf24", fontSize: 11 }} />
        <span style={{ color: "#03045e", fontSize: 13, fontWeight: 700 }}>4.9</span>
      </div>
    </motion.button>
  );
}

/* ── MINI SERVICE CHIP ─────────────────────────────────────── */
function ServiceChip({ service, gradient, onClick }: any) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      style={{
        flexShrink: 0, width: 130,
        borderRadius: 20, overflow: "hidden",
        background: gradient,
        boxShadow: "0 4px 16px rgba(3,4,94,0.15)",
        position: "relative",
      }}
    >
      {/* shimmer */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 50% at 70% 0%, rgba(255,255,255,0.18) 0%, transparent 60%)",
      }} />
      <div style={{ height: 90, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {service.imageUrl
          ? <img src={service.imageUrl} alt={service.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span style={{ fontSize: 34, fontWeight: 900, color: "rgba(255,255,255,0.18)" }}>✦</span>
        }
        <div style={{
          position: "absolute", top: 8, right: 8,
          background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)",
          borderRadius: 10, padding: "3px 8px",
          border: "1px solid rgba(255,255,255,0.25)",
        }}>
          <span style={{ color: "#fff", fontSize: 11, fontWeight: 800 }}>
            ${Number(service.price).toLocaleString()}
          </span>
        </div>
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <p style={{ color: "#fff", fontWeight: 800, fontSize: 12, lineHeight: 1.2, marginBottom: 4 }}>{service.name}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <BsClock style={{ color: "rgba(144,224,239,0.8)", fontSize: 9 }} />
          <span style={{ color: "rgba(144,224,239,0.8)", fontSize: 10, fontWeight: 600 }}>{service.durationMinutes} min</span>
        </div>
      </div>
    </motion.button>
  );
}

/* ── PAGE ───────────────────────────────────────────────────── */
export default function Home() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: services } = useListServices();
  const { data: locations } = useListLocations();
  const { data: dashboard } = useGetDashboardSummary({
    query: {
      queryKey: getGetDashboardSummaryQueryKey(),
      enabled: isAuthenticated && user?.role === "customer",
    },
  });

  const next = dashboard?.nextBooking;

  return (
    <div style={{ minHeight: "100%", background: "#f0f4f8" }}>

      {/* ── HERO ── */}
      <div style={{ padding: "52px 16px 0" }}>
        <HeroCard isAuthenticated={isAuthenticated} navigate={navigate} name={user?.name} />
      </div>

      {/* ── UPCOMING BOOKING (customer) ── */}
      {isAuthenticated && user?.role === "customer" && next && (
        <div style={{ padding: "16px 16px 0" }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "linear-gradient(135deg, #03045e 0%, #0077b6 60%, #00b4d8 100%)",
              borderRadius: 20, padding: "16px 18px",
              position: "relative", overflow: "hidden",
              boxShadow: "0 8px 30px rgba(3,4,94,0.25)",
            }}
          >
            <div style={{
              position: "absolute", top: -20, right: -20, width: 80, height: 80,
              borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.06)",
            }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "rgba(144,224,239,0.8)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>
                  Próxima cita
                </p>
                <p style={{ color: "#fff", fontWeight: 900, fontSize: 16, marginBottom: 2 }}>{next.service?.name}</p>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{next.location?.name}</p>
                <p style={{ color: "rgba(144,224,239,0.9)", fontSize: 13, fontWeight: 700, marginTop: 6 }}>
                  {new Date(next.date + "T00:00:00").toLocaleDateString("es-MX", { weekday: "short", month: "short", day: "numeric" })} · {next.startTime}
                </p>
              </div>
              <button
                onClick={() => navigate("/bookings")}
                style={{
                  background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 12, padding: "6px 14px",
                  color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 700,
                }}
              >Ver</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── STATS (customer) ── */}
      {isAuthenticated && user?.role === "customer" && dashboard && (
        <div style={{ padding: "14px 16px 0", display: "flex", gap: 10 }}>
          {[
            { val: dashboard.upcomingCount, label: "Próximas", grad: "linear-gradient(135deg,#023e8a,#0096c7)" },
            { val: dashboard.completedCount, label: "Completadas", grad: "linear-gradient(135deg,#005f73,#0a9396)" },
          ].map(({ val, label, grad }) => (
            <div key={label} style={{
              flex: 1, borderRadius: 18, padding: "14px 16px",
              background: grad, position: "relative", overflow: "hidden",
              boxShadow: "0 4px 16px rgba(3,4,94,0.18)",
            }}>
              <div style={{
                position: "absolute", top: -12, right: -12, width: 50, height: 50,
                borderRadius: "50%", background: "rgba(255,255,255,0.08)",
              }} />
              <p style={{ color: "#fff", fontSize: 28, fontWeight: 900 }}>{val}</p>
              <p style={{ color: "rgba(144,224,239,0.8)", fontSize: 11, fontWeight: 600 }}>{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── FEATURED CARDS (Apple-style) ── */}
      <div style={{ paddingTop: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px 14px" }}>
          <div>
            <p style={{ color: "#90a0b7", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Destacados
            </p>
            <p style={{ color: "#03045e", fontSize: 20, fontWeight: 900, lineHeight: 1.1 }}>Nuestros servicios</p>
          </div>
          <button onClick={() => navigate("/services")}
            style={{ color: "#0077b6", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
            Ver todos <BsArrowRight style={{ fontSize: 11 }} />
          </button>
        </div>

        {/* Horizontal snap scroll */}
        <div
          ref={scrollRef}
          style={{
            display: "flex", gap: 14,
            overflowX: "auto", scrollSnapType: "x mandatory",
            padding: "4px 20px 16px", scrollBehavior: "smooth",
          }}
        >
          {!services
            ? [1, 2].map(i => (
              <div key={i} style={{
                flexShrink: 0, width: "85vw", maxWidth: 360, height: 300,
                borderRadius: 24, background: "linear-gradient(135deg, #023e8a, #0096c7)",
                opacity: 0.3, scrollSnapAlign: "center",
              }} />
            ))
            : services.map((s, i) => (
              <FeaturedCard
                key={s.id}
                service={s}
                gradient={SERVICE_GRADIENTS[i % SERVICE_GRADIENTS.length]}
                onClick={() => navigate("/book")}
              />
            ))
          }
        </div>
      </div>

      {/* ── MINI SERVICES CHIP ROW ── */}
      {services && services.length > 0 && (
        <div style={{ paddingBottom: 4 }}>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 20px 4px" }}>
            {services.map((s, i) => (
              <ServiceChip
                key={s.id}
                service={s}
                gradient={SERVICE_GRADIENTS[(i + 1) % SERVICE_GRADIENTS.length]}
                onClick={() => navigate("/book")}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── LOCATIONS ── */}
      <div style={{ padding: "24px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <p style={{ color: "#90a0b7", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Dónde estamos
            </p>
            <p style={{ color: "#03045e", fontSize: 20, fontWeight: 900 }}>Sucursales</p>
          </div>
          <button onClick={() => navigate("/locations")}
            style={{ color: "#0077b6", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
            Ver mapa <BsArrowRight style={{ fontSize: 11 }} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {!locations
            ? [1, 2].map(i => <div key={i} style={{ height: 68, borderRadius: 18, background: "#e0e8f0" }} />)
            : locations.map(l => (
              <LocationRow key={l.id} location={l} onClick={() => navigate("/book")} />
            ))
          }
        </div>
      </div>

      {/* ── PUBLIC BOTTOM CTA ── */}
      {!isAuthenticated && (
        <div style={{ padding: "24px 16px 28px" }}>
          <div style={{
            borderRadius: 24, overflow: "hidden",
            background: "linear-gradient(145deg, #03045e 0%, #0077b6 50%, #00b4d8 100%)",
            padding: "22px 22px 22px",
            position: "relative",
            boxShadow: "0 8px 32px rgba(3,4,94,0.25)",
          }}>
            {/* foam */}
            <div style={{
              position: "absolute", top: -30, right: -30, width: 120, height: 120,
              borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.06)", pointerEvents: "none",
            }} />
            <p style={{ color: "#fff", fontSize: 20, fontWeight: 900, marginBottom: 4 }}>
              Reserva en 2 minutos
            </p>
            <p style={{ color: "rgba(144,224,239,0.75)", fontSize: 13, marginBottom: 18 }}>
              Crea tu cuenta y agenda tu primer lavado gratis.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("/register")} style={{
                flex: 1, height: 48, borderRadius: 14,
                background: "rgba(255,255,255,0.18)",
                border: "1.5px solid rgba(255,255,255,0.35)",
                color: "#fff", fontWeight: 800, fontSize: 14,
                backdropFilter: "blur(8px)",
              }}>Crear cuenta</motion.button>
              <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("/login")} style={{
                flex: 1, height: 48, borderRadius: 14,
                background: "rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: 14,
              }}>Iniciar sesión</motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
