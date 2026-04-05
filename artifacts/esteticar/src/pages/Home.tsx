import { useLocation } from "wouter";
import { useListServices, useListLocations, useGetDashboardSummary, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { BsArrowRight, BsGeoAlt, BsClock, BsCheckCircleFill, BsCalendarCheck } from "react-icons/bs";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

function ServiceCard({ service, onClick }: { service: any; onClick: () => void }) {
  return (
    <motion.div
      variants={item}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex-shrink-0 w-44 rounded-3xl overflow-hidden bg-card shadow-sm border border-card-border cursor-pointer"
    >
      <div className="h-28 bg-primary/10 flex items-center justify-center relative overflow-hidden">
        {service.imageUrl ? (
          <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary text-xl font-bold">✦</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5">
          <span className="text-xs font-bold text-primary">${Number(service.price).toLocaleString()}</span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-foreground leading-tight">{service.name}</p>
        <div className="flex items-center gap-1 mt-1">
          <BsClock className="text-muted-foreground text-xs" />
          <span className="text-xs text-muted-foreground">{service.durationMinutes} min</span>
        </div>
      </div>
    </motion.div>
  );
}

function LocationCard({ location, onClick }: { location: any; onClick: () => void }) {
  return (
    <motion.div
      variants={item}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-card-border shadow-sm cursor-pointer"
    >
      <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
        <BsGeoAlt className="text-secondary text-lg" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm truncate">{location.name}</p>
        <p className="text-xs text-muted-foreground truncate">{location.address}, {location.city}</p>
        <p className="text-xs text-secondary mt-0.5">{location.openTime} – {location.closeTime}</p>
      </div>
      <BsArrowRight className="text-muted-foreground flex-shrink-0" />
    </motion.div>
  );
}

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

  const nextBooking = dashboard?.nextBooking;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="bg-primary px-6 pt-14 pb-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-secondary/20" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {isAuthenticated ? (
            <>
              <p className="text-white/60 text-sm font-medium mb-1">Hola, {user?.name?.split(" ")[0]}</p>
              <h1 className="text-3xl font-bold text-white leading-tight">
                ¿Listo para tu<br />próximo lavado?
              </h1>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-white font-semibold tracking-wide">ESTETICAR</span>
              </div>
              <h1 className="text-3xl font-bold text-white leading-tight mb-2">
                Tu auto merece<br />lo mejor.
              </h1>
              <p className="text-white/70 text-sm">Sin esperas. Sin filas. Solo reserva.</p>
            </>
          )}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => isAuthenticated ? navigate("/book") : navigate("/login")}
          className="mt-6 w-full h-14 rounded-2xl bg-secondary text-white font-bold text-base flex items-center justify-center gap-2 relative z-10"
        >
          Agenda tu lavado
          <BsArrowRight className="text-lg" />
        </motion.button>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Next booking banner for customers */}
        {isAuthenticated && user?.role === "customer" && nextBooking && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-4 rounded-3xl bg-secondary/10 border border-secondary/20"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BsCalendarCheck className="text-secondary text-sm" />
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wide">Próxima cita</span>
                </div>
                <p className="font-bold text-foreground">{nextBooking.service?.name}</p>
                <p className="text-sm text-muted-foreground">{nextBooking.location?.name}</p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {new Date(nextBooking.date + "T00:00:00").toLocaleDateString("es-MX", { weekday: "long", month: "short", day: "numeric" })} · {nextBooking.startTime}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                <BsCheckCircleFill className="text-green-600 text-xs" />
                <span className="text-xs font-semibold text-green-700">Confirmada</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats for logged in customers */}
        {isAuthenticated && user?.role === "customer" && dashboard && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3"
          >
            <motion.div variants={item} className="p-4 rounded-3xl bg-primary text-white">
              <p className="text-3xl font-bold">{dashboard.upcomingCount}</p>
              <p className="text-white/70 text-xs font-medium mt-1">Citas próximas</p>
            </motion.div>
            <motion.div variants={item} className="p-4 rounded-3xl bg-card border border-card-border">
              <p className="text-3xl font-bold text-foreground">{dashboard.completedCount}</p>
              <p className="text-muted-foreground text-xs font-medium mt-1">Completadas</p>
            </motion.div>
          </motion.div>
        )}

        {/* Services Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Servicios</h2>
            <button onClick={() => navigate("/services")} className="text-sm font-semibold text-secondary">Ver todos</button>
          </div>
          <motion.div variants={container} initial="hidden" animate="visible" className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {services?.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => navigate("/book")}
              />
            ))}
          </motion.div>
        </div>

        {/* Locations Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Sucursales</h2>
            <button onClick={() => navigate("/locations")} className="text-sm font-semibold text-secondary">Ver mapa</button>
          </div>
          <motion.div variants={container} initial="hidden" animate="visible" className="space-y-3">
            {locations?.slice(0, 2).map((location) => (
              <LocationCard key={location.id} location={location} onClick={() => navigate("/book")} />
            ))}
          </motion.div>
        </div>

        {/* Public CTA */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="py-6 text-center"
          >
            <p className="text-muted-foreground text-sm mb-4">
              Reserva en minutos, ahorra horas de espera.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/register")}
                className="flex-1 h-12 rounded-2xl bg-primary text-white font-semibold text-sm"
              >
                Crear cuenta
              </button>
              <button
                onClick={() => navigate("/login")}
                className="flex-1 h-12 rounded-2xl bg-muted text-foreground font-semibold text-sm"
              >
                Iniciar sesión
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
