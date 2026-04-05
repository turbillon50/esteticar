import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useListServices } from "@workspace/api-client-react";
import { useAuth } from "@/components/AuthProvider";
import { motion, useInView } from "framer-motion";
import {
  BsArrowRight, BsGeoAlt, BsCalendarCheck, BsBellFill,
  BsPhone, BsCheckCircleFill, BsStarFill, BsDropletFill,
  BsShieldFill, BsPersonFill, BsChevronDown, BsApple,
  BsAndroid2,
} from "react-icons/bs";
import { HiShare } from "react-icons/hi2";

// ─── Scroll-fade wrapper ─────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, y = 24 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ─── PWA install helpers ──────────────────────────────────────────────────────
function usePWA() {
  const [platform, setPlatform] = useState<"ios" | "android" | "other" | null>(null);
  const [prompt, setPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone;
    if (isStandalone) { setIsInstalled(true); return; }
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua)) setPlatform("ios");
    else if (/Android/.test(ua)) setPlatform("android");
    else setPlatform("other");
    const handler = (e: Event) => { e.preventDefault(); setPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler as any);
    return () => window.removeEventListener("beforeinstallprompt", handler as any);
  }, []);

  return { platform, prompt, isInstalled };
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(0,119,182,0.3), transparent)" }} />
      <span style={{ fontSize: 10, fontWeight: 900, color: "#0077b6", textTransform: "uppercase", letterSpacing: "0.16em" }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(270deg, rgba(0,119,182,0.3), transparent)" }} />
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ navigate, name, isAuthenticated }: any) {
  return (
    <div style={{ position: "relative", minHeight: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(165deg,#010b1f 0%,#03045e 30%,#0077b6 65%,#00b4d8 85%,#48cae4 100%)" }} />
      {/* Photo overlay */}
      <img
        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.18 }}
      />
      {/* Gradient mask */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(3,4,94,0.2) 0%, rgba(3,4,94,0.1) 40%, rgba(3,4,94,0.7) 75%, rgba(2,11,31,0.98) 100%)" }} />

      {/* Animated orb */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.32, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "12%", right: "-15%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(72,202,228,0.45) 0%, transparent 70%)", pointerEvents: "none" }}
      />

      {/* Top nav */}
      <div style={{ position: "relative", zIndex: 2, padding: "52px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BsDropletFill style={{ color: "#48cae4", fontSize: 16 }} />
          </div>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: 15, letterSpacing: "0.12em" }}>ESTETICAR</span>
        </div>
        {isAuthenticated ? (
          <motion.button whileTap={{ scale: 0.94 }} onClick={() => navigate("/profile")}
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "6px 14px", cursor: "pointer" }}>
            <span style={{ color: "#48cae4", fontSize: 12, fontWeight: 700 }}>{name?.split(" ")[0]}</span>
          </motion.button>
        ) : (
          <motion.button whileTap={{ scale: 0.94 }} onClick={() => navigate("/login")}
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "6px 14px", cursor: "pointer" }}>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 700 }}>Entrar</span>
          </motion.button>
        )}
      </div>

      {/* Hero content */}
      <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 20px 40px" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
          {isAuthenticated && name && (
            <p style={{ color: "rgba(144,224,239,0.8)", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Bienvenido, {name.split(" ")[0]}</p>
          )}
          <h1 style={{ color: "#fff", fontSize: 42, fontWeight: 900, lineHeight: 1.0, marginBottom: 12 }}>
            El lavado<br />
            <span style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(90deg,#48cae4,#90e0ef)", backgroundClip: "text" }}>
              que merece
            </span><br />
            tu auto.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, fontWeight: 500, lineHeight: 1.55, marginBottom: 28, maxWidth: 300 }}>
            Agenda, rastrea y disfruta el mejor lavado de tu ciudad — desde tu celular.
          </p>

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => navigate("/book")}
            style={{
              width: "100%", height: 60, borderRadius: 20,
              background: "linear-gradient(135deg,#0077b6,#00b4d8)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 20px 0 24px",
              boxShadow: "0 8px 32px rgba(0,119,182,0.5), 0 0 0 1px rgba(72,202,228,0.3)",
              fontFamily: "inherit",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>Agendar mi lavado</p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, fontWeight: 600 }}>Elige servicio · fecha · sucursal</p>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 14, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BsArrowRight style={{ color: "#fff", fontSize: 16 }} />
            </div>
          </motion.button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ display: "flex", justifyContent: "center", marginTop: 28, opacity: 0.4 }}
        >
          <BsChevronDown style={{ color: "#fff", fontSize: 18 }} />
        </motion.div>
      </div>
    </div>
  );
}

// ─── STATS STRIP ──────────────────────────────────────────────────────────────
function StatsStrip() {
  const stats = [
    { val: "9+", label: "Autolavados" },
    { val: "6", label: "Ciudades" },
    { val: "4.9", label: "Estrellas", star: true },
    { val: "100%", label: "Garantía" },
  ];
  return (
    <div style={{ display: "flex", background: "#fff", margin: "0 16px", borderRadius: 20, boxShadow: "0 4px 20px rgba(3,4,94,0.10)", overflow: "hidden" }}>
      {stats.map(({ val, label, star }, i) => (
        <div key={label} style={{
          flex: 1, padding: "16px 0", textAlign: "center",
          background: i === 1 ? "linear-gradient(135deg,#0077b6,#00b4d8)" : "#fff",
          borderRight: i < 3 ? "1px solid #f0f4f8" : "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, marginBottom: 2 }}>
            {star && <BsStarFill style={{ color: "#f59e0b", fontSize: 10 }} />}
            <p style={{ fontWeight: 900, fontSize: 19, color: i === 1 ? "#fff" : "#03045e", lineHeight: 1 }}>{val}</p>
          </div>
          <p style={{ fontSize: 9, fontWeight: 800, color: i === 1 ? "rgba(255,255,255,0.7)" : "#90a0b7", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── FEATURES ─────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: BsGeoAlt,
    color: "#0077b6",
    bg: "linear-gradient(135deg,#03045e,#0077b6)",
    title: "Te ubicamos al instante",
    desc: "Activa tu GPS y Esteticar detecta dónde estás. El mapa muestra todos los autolavados del más cercano al más lejano — en segundos.",
    tag: "GPS inteligente",
  },
  {
    icon: BsCalendarCheck,
    color: "#00b4d8",
    bg: "linear-gradient(135deg,#005f73,#0077b6,#00b4d8)",
    title: "Calendario de citas",
    desc: "Elige el día exacto en el calendario mensual y ve los horarios disponibles en tiempo real. Tu cita siempre en el momento que quieres.",
    tag: "Horario exacto",
  },
  {
    icon: BsBellFill,
    color: "#48cae4",
    bg: "linear-gradient(135deg,#0077b6,#00b4d8,#48cae4)",
    title: "Notificación de confirmación",
    desc: "Al agendar, recibes una notificación push en tu celular confirmando tu cita. Sin spam, solo lo que importa — cuando importa.",
    tag: "Push notifications",
  },
  {
    icon: BsPhone,
    color: "#90e0ef",
    bg: "linear-gradient(135deg,#03045e,#0096c7)",
    title: "App sin descargar",
    desc: "Esteticar es una PWA — se instala directo desde el navegador en iOS o Android. Funciona sin internet y carga al instante.",
    tag: "PWA nativa",
  },
];

function FeaturesSection() {
  return (
    <div style={{ padding: "0 16px" }}>
      <FadeIn>
        <SectionLabel text="Tecnología" />
        <h2 style={{ color: "#03045e", fontSize: 28, fontWeight: 900, marginBottom: 4, lineHeight: 1.1 }}>
          Todo en un solo lugar
        </h2>
        <p style={{ color: "#90a0b7", fontSize: 14, fontWeight: 500, marginBottom: 22, lineHeight: 1.5 }}>
          Diseñado para darte la mejor experiencia desde tu celular.
        </p>
      </FadeIn>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {FEATURES.map((f, i) => (
          <FadeIn key={f.tag} delay={i * 0.08}>
            <div style={{
              borderRadius: 22, overflow: "hidden",
              boxShadow: "0 4px 20px rgba(3,4,94,0.10)",
              display: "flex", alignItems: "stretch",
            }}>
              {/* Color strip with icon */}
              <div style={{
                width: 72, flexShrink: 0,
                background: f.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <f.icon style={{ color: "#fff", fontSize: 24 }} />
              </div>
              {/* Content */}
              <div style={{ flex: 1, background: "#fff", padding: "16px 18px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", marginBottom: 6, padding: "2px 10px", borderRadius: 20, background: "rgba(0,119,182,0.08)", border: "1px solid rgba(0,119,182,0.15)" }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: "#0077b6", textTransform: "uppercase", letterSpacing: "0.08em" }}>{f.tag}</span>
                </div>
                <p style={{ fontWeight: 900, fontSize: 15, color: "#03045e", marginBottom: 4 }}>{f.title}</p>
                <p style={{ color: "#6b7a8d", fontSize: 12, lineHeight: 1.55 }}>{f.desc}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
const STEPS = [
  { n: "01", title: "Elige tu servicio", desc: "Básico, Camioneta o Detailing completo con interiores." },
  { n: "02", title: "Selecciona fecha y hora", desc: "Calendario mensual + horarios disponibles en tiempo real." },
  { n: "03", title: "El mapa te guía", desc: "Ve todos los autolavados cercanos ordenados por tu distancia GPS." },
  { n: "04", title: "Listo — notificación enviada", desc: "Confirmas y recibes tu cita al instante en tu celular." },
];

function HowItWorks({ navigate }: { navigate: (p: string) => void }) {
  return (
    <div style={{ padding: "0 16px" }}>
      <FadeIn>
        <SectionLabel text="El proceso" />
        <h2 style={{ color: "#03045e", fontSize: 28, fontWeight: 900, marginBottom: 4, lineHeight: 1.1 }}>
          Agenda en 2 minutos
        </h2>
        <p style={{ color: "#90a0b7", fontSize: 14, fontWeight: 500, marginBottom: 22, lineHeight: 1.5 }}>
          Sin complicaciones. Sin llamadas. Sin esperas.
        </p>
      </FadeIn>

      {/* Steps */}
      <div style={{ position: "relative" }}>
        {/* Vertical line */}
        <div style={{ position: "absolute", left: 27, top: 18, bottom: 18, width: 2, background: "linear-gradient(180deg,#0077b6,#00b4d8,rgba(0,180,216,0))" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {STEPS.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.1}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 18, paddingBottom: 20 }}>
                {/* Step number circle */}
                <div style={{
                  width: 54, height: 54, borderRadius: "50%", flexShrink: 0,
                  background: i === 3
                    ? "linear-gradient(135deg,#0077b6,#00b4d8)"
                    : "#fff",
                  border: `2px solid ${i === 3 ? "#0077b6" : "#e0e8f0"}`,
                  boxShadow: i === 3 ? "0 4px 16px rgba(0,119,182,0.35)" : "0 2px 8px rgba(3,4,94,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  zIndex: 1, position: "relative",
                }}>
                  {i === 3
                    ? <BsCheckCircleFill style={{ color: "#fff", fontSize: 20 }} />
                    : <span style={{ fontWeight: 900, fontSize: 13, color: "#0077b6" }}>{s.n}</span>}
                </div>
                {/* Content */}
                <div style={{ paddingTop: 14 }}>
                  <p style={{ fontWeight: 900, fontSize: 15, color: "#03045e", marginBottom: 3 }}>{s.title}</p>
                  <p style={{ color: "#90a0b7", fontSize: 13, lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      <FadeIn>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/book")}
          style={{
            width: "100%", height: 54, borderRadius: 18,
            background: "linear-gradient(135deg,#0077b6,#00b4d8)",
            border: "none", cursor: "pointer", fontFamily: "inherit",
            color: "#fff", fontWeight: 900, fontSize: 16,
            boxShadow: "0 6px 24px rgba(0,119,182,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}
        >
          Probar ahora <BsArrowRight style={{ fontSize: 15 }} />
        </motion.button>
      </FadeIn>
    </div>
  );
}

// ─── DIFFERENTIATORS ─────────────────────────────────────────────────────────
function Differentiators() {
  const items = [
    { icon: BsGeoAlt, title: "Red de autolavados", desc: "Múltiples sucursales en Cuernavaca y Morelos. Siempre hay uno cerca de ti." },
    { icon: BsShieldFill, title: "Garantía de calidad", desc: "Si no quedas satisfecho, repetimos el lavado sin costo. Sin preguntas." },
    { icon: BsCalendarCheck, title: "Sin filas ni esperas", desc: "Tu cita está reservada. Llegas, te atienden. Así de simple." },
    { icon: BsPersonFill, title: "Lavadores verificados", desc: "Cada proveedor es evaluado y certificado por Esteticar antes de operar." },
  ];

  return (
    <div style={{ padding: "0 16px" }}>
      <FadeIn>
        <SectionLabel text="Nuestros diferenciadores" />
        <h2 style={{ color: "#03045e", fontSize: 28, fontWeight: 900, marginBottom: 20, lineHeight: 1.1 }}>
          Por qué Esteticar<br />y no otro
        </h2>
      </FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {items.map((item, i) => (
          <FadeIn key={item.title} delay={i * 0.07}>
            <div style={{ background: "#fff", borderRadius: 20, padding: "18px 16px", boxShadow: "0 2px 12px rgba(3,4,94,0.07)" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 13, marginBottom: 12,
                background: "linear-gradient(135deg,#03045e,#0077b6)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <item.icon style={{ color: "#48cae4", fontSize: 16 }} />
              </div>
              <p style={{ fontWeight: 900, fontSize: 13, color: "#03045e", marginBottom: 5, lineHeight: 1.2 }}>{item.title}</p>
              <p style={{ color: "#90a0b7", fontSize: 11, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

// ─── QUIÉNES SOMOS ────────────────────────────────────────────────────────────
function QuienesSomos() {
  return (
    <FadeIn>
      <div style={{ margin: "0 16px", borderRadius: 26, overflow: "hidden", position: "relative" }}>
        <img
          src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=900&q=80"
          alt="Esteticar team"
          style={{ width: "100%", height: 220, objectFit: "cover", objectPosition: "center 30%", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(3,4,94,0.2) 0%, rgba(3,4,94,0.95) 65%, #03045e 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, padding: "0 22px 24px" }}>
          <p style={{ color: "rgba(144,224,239,0.8)", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 6 }}>Quiénes somos</p>
          <p style={{ color: "#fff", fontSize: 18, fontWeight: 900, lineHeight: 1.35, marginBottom: 10 }}>
            Somos el marketplace de autolavados más completo de Morelos.
          </p>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.6 }}>
            Conectamos a los mejores lavadores de la región con clientes que valoran su tiempo. Tecnología premium, precio justo, servicio garantizado.
          </p>
        </div>
      </div>
    </FadeIn>
  );
}

// ─── SERVICES PREVIEW ─────────────────────────────────────────────────────────
function ServicesPreview({ navigate }: { navigate: (p: string) => void }) {
  const { data: services } = useListServices();
  const imgs = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75",
    "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&q=75",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=75",
  ];

  return (
    <div style={{ padding: "0 16px" }}>
      <FadeIn>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <SectionLabel text="Servicios" />
            <h2 style={{ color: "#03045e", fontSize: 24, fontWeight: 900 }}>Nuestros lavados</h2>
          </div>
          <button onClick={() => navigate("/services")} style={{ background: "none", border: "none", cursor: "pointer", color: "#0077b6", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}>
            Ver todos <BsArrowRight style={{ fontSize: 11 }} />
          </button>
        </div>
      </FadeIn>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {(services ?? [{}, {}, {}] as any[]).map((s: any, i: number) => (
          <FadeIn key={i} delay={i * 0.07}>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate("/book")}
              style={{ display: "flex", alignItems: "center", borderRadius: 20, overflow: "hidden", background: "#fff", boxShadow: "0 2px 12px rgba(3,4,94,0.08)", width: "100%", cursor: "pointer", textAlign: "left", border: "none" }}>
              <div style={{ width: 80, height: 72, flexShrink: 0, overflow: "hidden", position: "relative" }}>
                {s.name
                  ? <img src={s.imageUrl?.startsWith("http") ? s.imageUrl : imgs[i % imgs.length]} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg,rgba(3,4,94,${0.8 - i * 0.1}),#0077b6)`, opacity: 0.3 }} />}
              </div>
              <div style={{ flex: 1, padding: "0 16px" }}>
                <p style={{ fontWeight: 900, fontSize: 14, color: "#03045e", marginBottom: 3 }}>{s.name ?? "..."}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {s.durationMinutes && <span style={{ fontSize: 11, color: "#90a0b7", fontWeight: 600 }}>{s.durationMinutes} min</span>}
                  {s.price && <span style={{ fontWeight: 900, fontSize: 15, color: "#0077b6" }}>${Number(s.price).toLocaleString()}</span>}
                </div>
              </div>
              <BsArrowRight style={{ color: "#0077b6", fontSize: 14, marginRight: 16, flexShrink: 0 }} />
            </motion.button>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

// ─── PWA INSTALL ──────────────────────────────────────────────────────────────
function PWAInstallSection() {
  const { platform, prompt, isInstalled } = usePWA();
  const [expanded, setExpanded] = useState<"ios" | "android" | null>(null);

  const install = async () => {
    if (prompt) {
      prompt.prompt();
      await prompt.userChoice;
    }
  };

  if (isInstalled) return null;

  return (
    <FadeIn>
      <div style={{ margin: "0 16px" }}>
        {/* Header card */}
        <div style={{ borderRadius: "22px 22px 0 0", background: "linear-gradient(135deg,#03045e,#0077b6,#00b4d8)", padding: "24px 22px 20px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(72,202,228,0.1)" }} />
          <SectionLabel text="PWA · App gratis" />
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 900, marginBottom: 6, lineHeight: 1.15 }}>
            Instala Esteticar<br />sin App Store
          </h2>
          <p style={{ color: "rgba(144,224,239,0.8)", fontSize: 13, fontWeight: 500, lineHeight: 1.55, marginBottom: 18 }}>
            Es una PWA — Progressive Web App. Se instala directo desde tu navegador, ocupa casi nada y funciona como app nativa.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { icon: BsCheckCircleFill, text: "Sin descargar nada" },
              { icon: BsCheckCircleFill, text: "Actualizaciones automáticas" },
              { icon: BsCheckCircleFill, text: "Funciona sin internet" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ flex: 1, textAlign: "center" }}>
                <Icon style={{ color: "#48cae4", fontSize: 16, marginBottom: 4 }} />
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: 700, lineHeight: 1.3 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#fff", borderRadius: "0 0 22px 22px", boxShadow: "0 8px 24px rgba(3,4,94,0.12)" }}>

          {/* iOS */}
          <div style={{ padding: "18px 16px", borderRight: "1px solid #f0f4f8" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BsApple style={{ color: "#fff", fontSize: 16 }} />
              </div>
              <p style={{ fontWeight: 900, fontSize: 13, color: "#03045e" }}>iPhone / iPad</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { n: 1, text: <>Abre en <strong>Safari</strong></> },
                { n: 2, text: <><HiShare style={{ display: "inline", verticalAlign: "middle", fontSize: 14 }} /> Compartir</> },
                { n: 3, text: <>"Añadir a pantalla"</> },
                { n: 4, text: <><strong>"Añadir"</strong> — listo</> },
              ].map(({ n, text }) => (
                <div key={n} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#03045e,#0077b6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#fff", fontSize: 9, fontWeight: 900 }}>{n}</span>
                  </div>
                  <p style={{ color: "#6b7a8d", fontSize: 11, lineHeight: 1.4 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Android */}
          <div style={{ padding: "18px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "#3ddc84", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BsAndroid2 style={{ color: "#fff", fontSize: 16 }} />
              </div>
              <p style={{ fontWeight: 900, fontSize: 13, color: "#03045e" }}>Android</p>
            </div>
            {platform === "android" && prompt ? (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={install}
                style={{ width: "100%", height: 44, borderRadius: 14, background: "linear-gradient(135deg,#3ddc84,#0077b6)", border: "none", cursor: "pointer", color: "#fff", fontWeight: 800, fontSize: 13, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                <BsAndroid2 style={{ fontSize: 14 }} />
                Instalar ahora
              </motion.button>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { n: 1, text: <>Abre en <strong>Chrome</strong></> },
                  { n: 2, text: <>Menú ⋮ arriba</> },
                  { n: 3, text: <>"Añadir a pantalla"</> },
                  { n: 4, text: <><strong>"Añadir"</strong> — listo</> },
                ].map(({ n, text }) => (
                  <div key={n} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#3ddc84,#0096c7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: "#fff", fontSize: 9, fontWeight: 900 }}>{n}</span>
                    </div>
                    <p style={{ color: "#6b7a8d", fontSize: 11, lineHeight: 1.4 }}>{text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// ─── FINAL CTA ─────────────────────────────────────────────────────────────────
function FinalCTA({ navigate }: { navigate: (p: string) => void }) {
  return (
    <FadeIn>
      <div style={{ margin: "0 16px", borderRadius: 26, overflow: "hidden", position: "relative" }}>
        <div style={{ background: "linear-gradient(145deg,#020b1a 0%,#03045e 40%,#0077b6 75%,#00b4d8 100%)", padding: "32px 22px 34px", position: "relative", overflow: "hidden" }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(72,202,228,0.5) 0%, transparent 70%)" }}
          />
          <p style={{ color: "rgba(144,224,239,0.8)", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 10, position: "relative", zIndex: 1 }}>Empieza ahora</p>
          <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 900, lineHeight: 1.1, marginBottom: 10, position: "relative", zIndex: 1 }}>
            Tu auto te lo<br />va a agradecer.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.55, marginBottom: 24, position: "relative", zIndex: 1 }}>
            Agenda en 2 minutos. Sin llamadas. Sin cuentas complicadas.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/book")}
            style={{
              width: "100%", height: 56, borderRadius: 18,
              background: "#fff", color: "#03045e",
              fontWeight: 900, fontSize: 16, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              fontFamily: "inherit",
              boxShadow: "0 8px 28px rgba(255,255,255,0.2)",
              position: "relative", zIndex: 1,
            }}
          >
            Agendar mi lavado <BsArrowRight style={{ color: "#0077b6", fontSize: 16 }} />
          </motion.button>
        </div>
      </div>
    </FadeIn>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: "100%", background: "#f0f4f8", overflowX: "hidden" }}>

      {/* ── HERO (full screen) ── */}
      <Hero navigate={navigate} isAuthenticated={isAuthenticated} name={user?.name} />

      {/* ── STATS (overlapping footer of hero) ── */}
      <div style={{ marginTop: -20, paddingBottom: 36 }}>
        <FadeIn>
          <StatsStrip />
        </FadeIn>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ paddingBottom: 40 }}>
        <FeaturesSection />
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ paddingBottom: 40 }}>
        <HowItWorks navigate={navigate} />
      </div>

      {/* ── WHO WE ARE ── */}
      <div style={{ paddingBottom: 40 }}>
        <QuienesSomos />
      </div>

      {/* ── DIFFERENTIATORS ── */}
      <div style={{ paddingBottom: 40 }}>
        <Differentiators />
      </div>

      {/* ── SERVICES ── */}
      <div style={{ paddingBottom: 40 }}>
        <ServicesPreview navigate={navigate} />
      </div>

      {/* ── PWA INSTALL ── */}
      <div style={{ paddingBottom: 40 }}>
        <PWAInstallSection />
      </div>

      {/* ── FINAL CTA ── */}
      <div style={{ paddingBottom: 100 }}>
        <FinalCTA navigate={navigate} />
      </div>
    </div>
  );
}
