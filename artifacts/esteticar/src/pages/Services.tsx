import { useListServices } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BsClock, BsArrowRight } from "react-icons/bs";

export default function Services() {
  const { data: services, isLoading } = useListServices();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen" style={{ background: "#f5f6f8" }}>

      {/* Dark header */}
      <div
        className="relative overflow-hidden px-5 pt-14 pb-8"
        style={{ background: "linear-gradient(150deg, #0A1628 0%, #0d2240 70%)" }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #00B4D8, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#00B4D8" }}>Catálogo</p>
          <h1 className="text-3xl font-black text-white mb-1">Nuestros servicios</h1>
          <p className="text-white/50 text-sm">Calidad premium, sin filas.</p>
        </motion.div>
      </div>

      <div className="px-4 py-5 space-y-4">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-56 rounded-3xl bg-white animate-pulse" />
          ))
        ) : (
          services?.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-3xl overflow-hidden bg-white"
              style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.08)" }}
            >
              <div
                className="h-44 relative flex items-center justify-center overflow-hidden"
                style={{ background: "linear-gradient(135deg, #e8f4f8 0%, #d1ecf5 100%)" }}
              >
                {service.imageUrl ? (
                  <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-8xl font-black" style={{ color: "#00B4D8", opacity: 0.2 }}>✦</span>
                )}
                <div
                  className="absolute top-3 right-3 font-black text-sm px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(10,22,40,0.85)", color: "#ffffff" }}
                >
                  ${Number(service.price).toLocaleString()}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-base font-black mb-1" style={{ color: "#0A1628" }}>{service.name}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#6b7280" }}>{service.description}</p>
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                    style={{ background: "#f5f6f8" }}
                  >
                    <BsClock className="text-xs" style={{ color: "#9ca3af" }} />
                    <span className="text-xs font-bold" style={{ color: "#6b7280" }}>{service.durationMinutes} minutos</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/book")}
                    className="h-10 px-4 rounded-full font-black text-white text-sm flex items-center gap-2"
                    style={{ background: "linear-gradient(135deg, #0A1628, #0d2240)" }}
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
