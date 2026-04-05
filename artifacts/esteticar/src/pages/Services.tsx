import { useListServices } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BsClock, BsArrowRight } from "react-icons/bs";

const GRADIENTS = [
  "linear-gradient(145deg, #03045e 0%, #0077b6 45%, #00b4d8 80%, #90e0ef 100%)",
  "linear-gradient(145deg, #005f73 0%, #0a9396 50%, #94d2bd 90%, #e9f5db 100%)",
  "linear-gradient(145deg, #1a1a2e 0%, #16213e 30%, #0f3460 65%, #00b4d8 100%)",
];

export default function Services() {
  const { data: services, isLoading } = useListServices();
  const [, navigate] = useLocation();

  return (
    <div style={{ minHeight: "100%", background: "#f0f4f8" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(160deg, #020b1a 0%, #03045e 40%, #0077b6 80%, #48cae4 100%)",
        padding: "52px 22px 28px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Bubbles */}
        {[
          { s: 160, t: -40, r: -40, op: 0.10 },
          { s: 80, t: 80, l: -20, op: 0.08 },
        ].map((b, i) => (
          <div key={i} style={{
            position: "absolute", width: b.s, height: b.s, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.2)",
            background: `rgba(72,202,228,${b.op})`,
            top: (b as any).t, right: (b as any).r, left: (b as any).l,
            pointerEvents: "none",
          }} />
        ))}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ position: "relative", zIndex: 1 }}>
          <p style={{ color: "rgba(72,202,228,0.8)", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>
            Catálogo
          </p>
          <p style={{ color: "#fff", fontSize: 32, fontWeight: 900, lineHeight: 1.1, marginBottom: 4 }}>
            Nuestros servicios
          </p>
          <p style={{ color: "rgba(144,224,239,0.65)", fontSize: 14 }}>Calidad premium, sin filas.</p>
        </motion.div>
      </div>

      <div style={{ padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} style={{ height: 280, borderRadius: 24, background: "linear-gradient(135deg, #023e8a55, #0096c755)", opacity: 0.5 }} />
          ))
        ) : (
          services?.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                borderRadius: 24, overflow: "hidden",
                background: GRADIENTS[i % GRADIENTS.length],
                boxShadow: "0 8px 32px rgba(3,4,94,0.22)",
                position: "relative",
              }}
            >
              {/* Foam shimmer */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(ellipse 70% 40% at 80% 10%, rgba(255,255,255,0.18) 0%, transparent 55%)",
              }} />
              {/* Bubble deco */}
              {[
                { s: 100, t: -25, r: -25, op: 0.12 },
                { s: 55, t: 60, r: 20, op: 0.09 },
              ].map((b, bi) => (
                <div key={bi} style={{
                  position: "absolute", width: b.s, height: b.s, borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: `rgba(255,255,255,${b.op})`,
                  top: b.t, right: b.r, pointerEvents: "none",
                }} />
              ))}

              {/* Image */}
              <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                {service.imageUrl ? (
                  <img src={service.imageUrl} alt={service.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ fontSize: 80, fontWeight: 900, color: "rgba(255,255,255,0.12)", letterSpacing: -4 }}>✦✦</div>
                )}
                {/* Price badge */}
                <div style={{
                  position: "absolute", top: 14, right: 14,
                  background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 12, padding: "6px 14px",
                }}>
                  <span style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>
                    ${Number(service.price).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: "18px 20px 20px", position: "relative", zIndex: 1 }}>
                <p style={{ color: "#fff", fontSize: 22, fontWeight: 900, lineHeight: 1.1, marginBottom: 8 }}>
                  {service.name}
                </p>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
                  {service.description}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "rgba(255,255,255,0.12)", borderRadius: 20,
                    padding: "6px 14px", border: "1px solid rgba(255,255,255,0.2)",
                  }}>
                    <BsClock style={{ color: "rgba(144,224,239,0.8)", fontSize: 12 }} />
                    <span style={{ color: "rgba(144,224,239,0.9)", fontSize: 12, fontWeight: 700 }}>
                      {service.durationMinutes} minutos
                    </span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={() => navigate("/book")}
                    style={{
                      height: 42, paddingLeft: 20, paddingRight: 20,
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.18)",
                      border: "1.5px solid rgba(255,255,255,0.35)",
                      backdropFilter: "blur(8px)",
                      color: "#fff", fontWeight: 900, fontSize: 14,
                      display: "flex", alignItems: "center", gap: 8,
                      fontFamily: "inherit", cursor: "pointer",
                    }}
                  >
                    Reservar <BsArrowRight />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
