import { useRef, useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  useListServices,
  useListLocations,
  useGetDashboardSummary,
  getGetDashboardSummaryQueryKey,
} from "@workspace/api-client-react";
import { useAuth } from "@/components/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  BsArrowRight, BsStarFill, BsClock, BsGeoAlt,
  BsDropletFill, BsShieldFill, BsXLg,
} from "react-icons/bs";
import { HiShare } from "react-icons/hi2";

/* ─── Unsplash image pool (car wash / foam / premium auto) ─ */
const HERO_IMG = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85";

const SERVICE_IMGS = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
];

const LOCATION_IMGS = [
  "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&q=70",
  "https://images.unsplash.com/photo-1562247647-48c0f3d8e58d?w=400&q=70",
  "https://images.unsplash.com/photo-1622479986060-8b1d22baa6fb?w=400&q=70",
];

const GRADIENTS = [
  "linear-gradient(145deg,#03045e 0%,#0077b6 45%,#00b4d8 80%,#90e0ef 100%)",
  "linear-gradient(145deg,#005f73 0%,#0a9396 50%,#48cae4 85%,#caf0f8 100%)",
  "linear-gradient(145deg,#10002b 0%,#3a0ca3 45%,#4cc9f0 100%)",
];

/* ─── PWA Install Banner ──────────────────────────────────── */
function PWABanner() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-dismissed");
    if (dismissed) return;

    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      || (window.navigator as any).standalone;
    if (isStandalone) return;

    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua) && !(window as any).MSStream;
    const isAndroid = /Android/.test(ua);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPlatform("android");
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler as any);

    if (isIOS) {
      setPlatform("ios");
      setTimeout(() => setVisible(true), 1500);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler as any);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem("pwa-dismissed", "1");
  };

  const install = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") dismiss();
    }
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        style={{
          margin: "0 16px",
          borderRadius: 22,
          overflow: "hidden",
          background: "linear-gradient(135deg,#03045e 0%,#0077b6 60%,#00b4d8 100%)",
          boxShadow: "0 8px 32px rgba(3,4,94,0.3)",
          position: "relative",
        }}
      >
        {/* Foam overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 50% at 85% 20%, rgba(144,224,239,0.25) 0%, transparent 60%)",
        }} />
        <div style={{ padding: "18px 18px 20px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 900, color: "#fff",
              }}>E</div>
              <div>
                <p style={{ color: "#fff", fontWeight: 900, fontSize: 14 }}>Instalar Esteticar</p>
                <p style={{ color: "rgba(144,224,239,0.8)", fontSize: 11 }}>Acceso directo desde tu pantalla</p>
              </div>
            </div>
            <button onClick={dismiss} style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>
              <BsXLg style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }} />
            </button>
          </div>

          {platform === "ios" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { n: 1, text: <>Toca <HiShare style={{ display:"inline", verticalAlign:"middle" }} /> en Safari</> },
                { n: 2, text: "Selecciona \"Agregar a pantalla de inicio\"" },
                { n: 3, text: "Toca \"Agregar\" — listo" },
              ].map(({ n, text }) => (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: "rgba(255,255,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 11, fontWeight: 800,
                  }}>{n}</div>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>{text}</p>
                </div>
              ))}
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={install}
              style={{
                width: "100%", height: 44, borderRadius: 14,
                background: "rgba(255,255,255,0.18)",
                border: "1.5px solid rgba(255,255,255,0.35)",
                color: "#fff", fontWeight: 800, fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Agregar a pantalla de inicio <BsArrowRight />
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── HERO ────────────────────────────────────────────────── */
function Hero({ isAuthenticated, navigate, name }: any) {
  return (
    <div style={{ position: "relative", height: 360, overflow: "hidden", borderRadius: "0 0 32px 32px" }}>
      {/* Real car wash photo */}
      <img
        src={HERO_IMG}
        alt="Car wash"
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
      />
      {/* Cinematic gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(3,4,94,0.55) 0%, rgba(0,119,182,0.35) 40%, rgba(0,180,216,0.6) 80%, rgba(3,4,94,0.9) 100%)",
      }} />
      {/* Top: branding */}
      <div style={{ position: "absolute", top: 52, left: 20, right: 20, display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 900, color: "#fff",
          }}>E</div>
          <span style={{ color: "#fff", fontWeight: 900, letterSpacing: "0.1em", fontSize: 12 }}>ESTETICAR</span>
        </div>
        <div style={{
          background: "rgba(0,180,216,0.25)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(72,202,228,0.4)",
          borderRadius: 20, padding: "4px 12px",
        }}>
          <span style={{ color: "#48cae4", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Cuernavaca, Mor.
          </span>
        </div>
      </div>
      {/* Bottom: headline + CTA */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 20px 24px", zIndex: 2 }}>
        {isAuthenticated ? (
          <p style={{ color: "rgba(144,224,239,0.9)", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Bienvenido, {name?.split(" ")[0]}</p>
        ) : null}
        <p style={{ color: "#fff", fontSize: 34, fontWeight: 900, lineHeight: 1.05, marginBottom: 16 }}>
          Tu auto merece<br />lo mejor.
        </p>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/book")}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            width: "100%", height: 56, borderRadius: 18,
            background: "rgba(255,255,255,0.14)", backdropFilter: "blur(16px)",
            border: "1.5px solid rgba(255,255,255,0.35)",
            padding: "0 18px", cursor: "pointer",
          }}
        >
          <div>
            <p style={{ color: "#fff", fontWeight: 900, fontSize: 15, textAlign: "left" }}>Agendar lavado</p>
            <p style={{ color: "rgba(144,224,239,0.8)", fontSize: 11, textAlign: "left" }}>Elige servicio · sucursal · horario</p>
          </div>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "linear-gradient(135deg,#00b4d8,#0077b6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(0,180,216,0.5)",
          }}>
            <BsArrowRight style={{ color: "#fff", fontSize: 16 }} />
          </div>
        </motion.button>
      </div>
    </div>
  );
}

/* ─── STATS STRIP ─────────────────────────────────────────── */
function StatsStrip() {
  const stats = [
    { icon: <BsGeoAlt />, val: "9", label: "Autolavados" },
    { icon: <BsDropletFill />, val: "6", label: "Ciudades" },
    { icon: <BsShieldFill />, val: "100%", label: "Garantía" },
  ];
  return (
    <div style={{
      display: "flex", gap: 0,
      margin: "16px 16px 0",
      borderRadius: 20, overflow: "hidden",
      boxShadow: "0 4px 20px rgba(3,4,94,0.12)",
    }}>
      {stats.map(({ icon, val, label }, i) => (
        <div key={label} style={{
          flex: 1, padding: "14px 0", textAlign: "center",
          background: i === 1
            ? "linear-gradient(135deg,#0077b6,#00b4d8)"
            : "#fff",
          borderRight: i < 2 ? "1px solid rgba(3,4,94,0.06)" : undefined,
        }}>
          <div style={{ color: i === 1 ? "rgba(255,255,255,0.8)" : "#00b4d8", fontSize: 14, marginBottom: 3 }}>{icon}</div>
          <p style={{ fontWeight: 900, fontSize: 17, color: i === 1 ? "#fff" : "#03045e", lineHeight: 1 }}>{val}</p>
          <p style={{ fontSize: 10, color: i === 1 ? "rgba(255,255,255,0.7)" : "#90a0b7", fontWeight: 600, marginTop: 2 }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── FEATURED SERVICE CARD ───────────────────────────────── */
function ServiceCard({ service, gradient, imgFallback, onClick, index }: any) {
  const img = service.imageUrl?.startsWith("http") ? service.imageUrl : imgFallback;
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      style={{
        flexShrink: 0, width: "82vw", maxWidth: 340,
        borderRadius: 26, overflow: "hidden",
        background: gradient, position: "relative",
        boxShadow: "0 16px 48px rgba(3,4,94,0.28)",
        scrollSnapAlign: "start", cursor: "pointer",
      }}
    >
      {/* Photo */}
      <div style={{ height: 190, position: "relative", overflow: "hidden" }}>
        <img src={img} alt={service.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {/* gradient over photo */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, transparent 40%, rgba(3,4,94,0.7) 100%)",
        }} />
        {/* Price badge */}
        <div style={{
          position: "absolute", top: 14, right: 14,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 12, padding: "6px 14px",
        }}>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: 17 }}>
            ${Number(service.price).toLocaleString()}
          </span>
        </div>
        {/* Category chip */}
        <div style={{
          position: "absolute", top: 14, left: 14,
          background: "rgba(0,180,216,0.3)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(72,202,228,0.4)",
          borderRadius: 10, padding: "4px 10px",
        }}>
          <span style={{ color: "#48cae4", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Destacado
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "16px 20px 20px" }}>
        <p style={{ color: "#fff", fontSize: 22, fontWeight: 900, lineHeight: 1.1, marginBottom: 8 }}>
          {service.name}
        </p>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 1.5, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {service.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "rgba(255,255,255,0.12)", borderRadius: 20,
            padding: "5px 12px", border: "1px solid rgba(255,255,255,0.15)",
          }}>
            <BsClock style={{ color: "#48cae4", fontSize: 11 }} />
            <span style={{ color: "#48cae4", fontSize: 12, fontWeight: 700 }}>{service.durationMinutes} min</span>
          </div>
          <div style={{
            background: "linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0.08))",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 14, padding: "8px 16px",
            display: "flex", alignItems: "center", gap: 6,
            backdropFilter: "blur(8px)",
          }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 13 }}>Reservar</span>
            <BsArrowRight style={{ color: "#48cae4", fontSize: 11 }} />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

/* ─── LOCATION CARD ───────────────────────────────────────── */
function LocationCard({ location, img, onClick, index }: any) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      style={{
        display: "flex", alignItems: "center", gap: 0,
        borderRadius: 20, overflow: "hidden",
        background: "#fff",
        boxShadow: "0 4px 20px rgba(3,4,94,0.10)",
        width: "100%", cursor: "pointer",
        textAlign: "left",
      }}
    >
      {/* Photo thumbnail */}
      <div style={{ width: 88, height: 80, flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <img src={img} alt={location.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent 60%, rgba(255,255,255,0.7) 100%)",
        }} />
      </div>
      {/* Info */}
      <div style={{ flex: 1, padding: "0 14px" }}>
        <p style={{ color: "#03045e", fontWeight: 900, fontSize: 14, marginBottom: 3 }}>{location.name}</p>
        <p style={{ color: "#90a0b7", fontSize: 11, lineHeight: 1.3, marginBottom: 5 }}>{location.address}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <BsGeoAlt style={{ color: "#0077b6", fontSize: 10 }} />
          <span style={{ color: "#0077b6", fontSize: 10, fontWeight: 700 }}>Ver en mapa</span>
        </div>
      </div>
      {/* Arrow */}
      <div style={{ padding: "0 16px 0 0" }}>
        <BsArrowRight style={{ color: "#0077b6", fontSize: 14 }} />
      </div>
    </motion.button>
  );
}

/* ─── PAGE ────────────────────────────────────────────────── */
export default function Home() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const { data: services } = useListServices();
  const { data: locations } = useListLocations();
  useGetDashboardSummary({
    query: {
      queryKey: getGetDashboardSummaryQueryKey(),
      enabled: isAuthenticated && user?.role === "customer",
    },
  });

  return (
    <div className="desktop-content" style={{ minHeight: "100%", background: "#f0f4f8", paddingBottom: 20 }}>

      {/* ── HERO ── */}
      <div className="desktop-hero">
        <Hero isAuthenticated={isAuthenticated} navigate={navigate} name={user?.name} />
      </div>

      {/* ── STATS ── */}
      <div className="desktop-px">
        <StatsStrip />
      </div>

      {/* ── SERVICES TITLE ── */}
      <div className="desktop-px" style={{ padding: "28px 20px 14px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <p style={{ color: "#0077b6", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 3 }}>
            Nuestros servicios
          </p>
          <p style={{ color: "#03045e", fontSize: 24, fontWeight: 900, lineHeight: 1 }}>Destacados</p>
        </div>
        <button onClick={() => navigate("/services")}
          style={{ color: "#0077b6", fontSize: 13, fontWeight: 700, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}>
          Ver todos <BsArrowRight style={{ fontSize: 11 }} />
        </button>
      </div>

      {/* ── SERVICES SCROLL ── */}
      <div className="desktop-scroll-to-grid desktop-px" style={{
        display: "flex", gap: 14, overflowX: "auto",
        scrollSnapType: "x mandatory", padding: "4px 20px 8px",
        scrollBehavior: "smooth",
      }}>
        {!services
          ? GRADIENTS.map((g, i) => (
            <div key={i} style={{
              flexShrink: 0, width: "82vw", maxWidth: 340, height: 340,
              borderRadius: 26, background: g, opacity: 0.25,
              scrollSnapAlign: "start",
            }} />
          ))
          : services.map((s, i) => (
            <ServiceCard
              key={s.id} service={s}
              gradient={GRADIENTS[i % GRADIENTS.length]}
              imgFallback={SERVICE_IMGS[i % SERVICE_IMGS.length]}
              onClick={() => navigate("/book")}
              index={i}
            />
          ))
        }
      </div>

      {/* ── CITY BANNER ── */}
      <div className="desktop-px" style={{ padding: "20px 16px 0" }}>
        <div style={{
          borderRadius: 22, overflow: "hidden", position: "relative", height: 120,
        }}>
          <img
            src="https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&q=75"
            alt="Cuernavaca"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg,rgba(3,4,94,0.85) 0%,rgba(0,119,182,0.6) 60%,transparent 100%)",
          }} />
          <div style={{ position: "absolute", top: "50%", left: 20, transform: "translateY(-50%)" }}>
            <p style={{ color: "rgba(144,224,239,0.8)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>Operamos en</p>
            <p style={{ color: "#fff", fontSize: 22, fontWeight: 900, lineHeight: 1.1 }}>Cuernavaca,<br />Morelos</p>
          </div>
        </div>
      </div>

      {/* ── LOCATIONS TITLE ── */}
      <div className="desktop-px" style={{ padding: "24px 20px 14px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <p style={{ color: "#0077b6", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 3 }}>
            Dónde estamos
          </p>
          <p style={{ color: "#03045e", fontSize: 24, fontWeight: 900, lineHeight: 1 }}>Sucursales</p>
        </div>
        <button onClick={() => navigate("/locations")}
          style={{ color: "#0077b6", fontSize: 13, fontWeight: 700, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}>
          Ver mapa <BsArrowRight style={{ fontSize: 11 }} />
        </button>
      </div>

      {/* ── LOCATIONS ── */}
      <div className="desktop-px desktop-grid-2" style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {!locations
          ? [1, 2, 3].map(i => <div key={i} style={{ height: 80, borderRadius: 20, background: "#e0e8f0" }} />)
          : locations.map((l, i) => (
            <LocationCard
              key={l.id} location={l}
              img={LOCATION_IMGS[i % LOCATION_IMGS.length]}
              onClick={() => navigate("/book")}
              index={i}
            />
          ))
        }
      </div>

      {/* ── PWA INSTALL BANNER ── */}
      <div style={{ paddingTop: 20 }}>
        <PWABanner />
      </div>

      {/* ── PUBLIC CTA ── */}
      {!isAuthenticated && (
        <div className="desktop-px" style={{ padding: "20px 16px 0" }}>
          <div style={{ position: "relative", borderRadius: 26, overflow: "hidden" }}>
            {/* Photo bg */}
            <img
              src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=900&q=80"
              alt="Luxury car"
              style={{ width: "100%", height: 180, objectFit: "cover", objectPosition: "center 30%" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(180deg,rgba(3,4,94,0.4) 0%,rgba(3,4,94,0.92) 60%,#03045e 100%)",
            }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 20px 22px" }}>
              <p style={{ color: "#fff", fontSize: 20, fontWeight: 900, marginBottom: 4 }}>Reserva en 2 minutos</p>
              <p style={{ color: "rgba(144,224,239,0.75)", fontSize: 12, marginBottom: 16 }}>
                Crea tu cuenta y agenda tu primer lavado.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("/register")} style={{
                  flex: 1, height: 46, borderRadius: 14,
                  background: "linear-gradient(135deg,#00b4d8,#0077b6)",
                  color: "#fff", fontWeight: 900, fontSize: 14,
                  border: "none", cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 4px 16px rgba(0,119,182,0.4)",
                }}>Crear cuenta</motion.button>
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("/login")} style={{
                  flex: 1, height: 46, borderRadius: 14,
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.8)", fontWeight: 700, fontSize: 14,
                  cursor: "pointer", fontFamily: "inherit",
                }}>Iniciar sesión</motion.button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
