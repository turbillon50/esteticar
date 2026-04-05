import { useListLocations } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { BsGeoAlt, BsClock, BsTelephone } from "react-icons/bs";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function Locations() {
  const { data: locations, isLoading } = useListLocations();

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-14 pb-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-2">Dónde estamos</p>
          <h1 className="text-3xl font-bold text-foreground">Sucursales</h1>
          <p className="text-muted-foreground text-sm mt-1">Encuentra tu Esteticar más cercano</p>
        </motion.div>
      </div>

      {/* Map placeholder */}
      <div className="mx-6 mb-6 rounded-3xl overflow-hidden h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-0 opacity-10">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="border border-primary/30" />
          ))}
        </div>
        {locations?.map((loc, i) => (
          <div
            key={loc.id}
            className="absolute"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + (i % 2) * 20}%`,
            }}
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <BsGeoAlt className="text-white text-sm" />
            </div>
          </div>
        ))}
        <p className="text-muted-foreground text-sm font-medium relative z-10">Vista de mapa</p>
      </div>

      {/* Locations list */}
      <div className="px-6 pb-8">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-3xl bg-muted animate-pulse" />)}
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="visible" className="space-y-3">
            {locations?.map((location) => (
              <motion.div
                key={location.id}
                variants={item}
                className="p-5 rounded-3xl bg-card border border-card-border shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <BsGeoAlt className="text-secondary text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{location.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{location.address}</p>
                    <p className="text-sm text-muted-foreground">{location.city}</p>

                    <div className="flex flex-wrap gap-3 mt-3">
                      <div className="flex items-center gap-1.5">
                        <BsClock className="text-secondary text-xs" />
                        <span className="text-xs font-medium text-foreground">{location.openTime} – {location.closeTime}</span>
                      </div>
                      {location.phone && (
                        <div className="flex items-center gap-1.5">
                          <BsTelephone className="text-secondary text-xs" />
                          <span className="text-xs font-medium text-foreground">{location.phone}</span>
                        </div>
                      )}
                    </div>
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
