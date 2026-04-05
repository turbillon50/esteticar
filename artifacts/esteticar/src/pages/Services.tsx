import { useListServices } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BsClock, BsArrowRight } from "react-icons/bs";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function Services() {
  const { data: services, isLoading } = useListServices();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-6 pt-14 pb-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-2">Catálogo</p>
          <h1 className="text-3xl font-bold text-foreground">Nuestros servicios</h1>
          <p className="text-muted-foreground text-sm mt-1">Calidad premium, sin filas.</p>
        </motion.div>
      </div>

      {/* Services list */}
      <div className="px-6 pb-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-52 rounded-3xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="visible" className="space-y-4">
            {services?.map((service) => (
              <motion.div
                key={service.id}
                variants={item}
                whileTap={{ scale: 0.98 }}
                className="rounded-3xl overflow-hidden bg-card border border-card-border shadow-sm"
              >
                {/* Image area */}
                <div className="h-40 bg-gradient-to-br from-primary/10 to-secondary/10 relative flex items-center justify-center overflow-hidden">
                  {service.imageUrl ? (
                    <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-4xl font-black text-primary/20">✦</div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <span className="text-sm font-bold text-primary">${Number(service.price).toLocaleString()}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground mb-1">{service.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                      <BsClock className="text-muted-foreground text-xs" />
                      <span className="text-xs font-semibold text-muted-foreground">{service.durationMinutes} minutos</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/book")}
                      className="h-10 px-5 rounded-full bg-primary text-white text-sm font-semibold flex items-center gap-2"
                    >
                      Reservar
                      <BsArrowRight />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
