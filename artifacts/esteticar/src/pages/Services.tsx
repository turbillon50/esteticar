import { useListServices } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BsClock, BsArrowRight, BsCheckCircleFill } from "react-icons/bs";

const GRADIENTS = [
  "linear-gradient(145deg,#03045e 0%,#0077b6 45%,#00b4d8 80%,#90e0ef 100%)",
  "linear-gradient(145deg,#005f73 0%,#0a9396 50%,#48cae4 85%,#caf0f8 100%)",
  "linear-gradient(145deg,#10002b 0%,#3a0ca3 45%,#4cc9f0 100%)",
];

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
];

const FEATURES = [
  ["Espuma activa", "Enjuague a presión", "Secado manual"],
  ["Para SUVs y pickups", "Llantas y rines", "Aspirado incluido"],
  ["Pulido de carnauba", "Interior profundo", "Aromatizante premium"],
];

export default function Services() {
  const { data: services, isLoading } = useListServices();
  const [, navigate] = useLocation();

  return (
    <div style={{ minHeight: "100%", background: "#f0f4f8" }}>

      {/* Header con foto real */}
      <div style={{ position: "relative", height: 200, overflow: "hidden", borderRadius: "0 0 28px 28px" }}>
        <img
          src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=900&q=80"
          alt="Servicios"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg,rgba(3,4,94,0.6) 0%,rgba(0,119,182,0.5) 40%,rgba(3,4,94,0.88) 100%)",
        }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 22px 22px" }}>
          <p style={{ color: "rgba(72,202,228,0.85)", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>
            Catálogo
          </p>
          <p style={{ color: "#fff", fontSize: 30, fontWeight: 900, lineHeight: 1.05 }}>
            Nuestros servicios
          </p>
          <p style={{ color: "rgba(144,224,239,0.7)", fontSize: 13 }}>Calidad premium, sin filas.</p>
        </div>
      </div>

      <div style={{ padding: "16px 16px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
        {isLoading
          ? [1, 2, 3].map(i => (
            <div key={i} style={{ height: 320, borderRadius: 26, background: GRADIENTS[i % 3], opacity: 0.25 }} />
          ))
          : services?.map((service, i) => {
            const img = service.imageUrl?.startsWith("http") ? service.imageUrl : FALLBACK_IMGS[i % FALLBACK_IMGS.length];
            const features = FEATURES[i % FEATURES.length];
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{
                  borderRadius: 26, overflow: "hidden",
                  background: GRADIENTS[i % GRADIENTS.length],
                  boxShadow: "0 10px 40px rgba(3,4,94,0.25)",
                  position: "relative",
                }}
              >
                {/* Foam shimmer */}
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
                  background: "radial-gradient(ellipse 65% 40% at 85% 10%, rgba(255,255,255,0.2) 0%, transparent 55%)",
                }} />

                {/* Photo */}
                <div style={{ height: 200, position: "relative", overflow: "hidden" }}>
                  <img src={img} alt={service.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(180deg, transparent 30%, rgba(3,4,94,0.65) 100%)",
                  }} />
                  {/* Price */}
                  <div style={{
                    position: "absolute", top: 14, right: 14,
                    background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.25)", borderRadius: 12, padding: "7px 16px",
                  }}>
                    <span style={{ color: "#fff", fontWeight: 900, fontSize: 19 }}>
                      ${Number(service.price).toLocaleString()}
                    </span>
                  </div>
                  {/* Badge */}
                  <div style={{
                    position: "absolute", bottom: 12, left: 14,
                    background: "rgba(0,180,216,0.25)", backdropFilter: "blur(8px)",
                    border: "1px solid rgba(72,202,228,0.4)", borderRadius: 10, padding: "4px 10px",
                  }}>
                    <span style={{ color: "#48cae4", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      Disponible ahora
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: "18px 20px 22px", position: "relative", zIndex: 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <BsClock style={{ color: "#48cae4", fontSize: 12 }} />
                    <span style={{ color: "#48cae4", fontSize: 12, fontWeight: 700 }}>{service.durationMinutes} min</span>
                  </div>
                  <p style={{ color: "#fff", fontSize: 24, fontWeight: 900, lineHeight: 1.1, marginBottom: 8 }}>
                    {service.name}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>
                    {service.description}
                  </p>

                  {/* Feature chips */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                    {features.map(f => (
                      <div key={f} style={{
                        display: "flex", alignItems: "center", gap: 5,
                        background: "rgba(255,255,255,0.10)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: 20, padding: "4px 12px",
                      }}>
                        <BsCheckCircleFill style={{ color: "#48cae4", fontSize: 10 }} />
                        <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 600 }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate("/book")}
                    style={{
                      width: "100%", height: 50, borderRadius: 16,
                      background: "rgba(255,255,255,0.18)",
                      border: "1.5px solid rgba(255,255,255,0.35)",
                      backdropFilter: "blur(10px)",
                      color: "#fff", fontWeight: 900, fontSize: 15,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    Reservar este servicio <BsArrowRight />
                  </motion.button>
                </div>
              </motion.div>
            );
          })
        }
      </div>
    </div>
  );
}
