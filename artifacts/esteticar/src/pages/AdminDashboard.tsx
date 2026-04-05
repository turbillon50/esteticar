import { useGetAdminDashboard, getGetAdminDashboardQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BsGraphUp, BsGeoAlt, BsPerson, BsCalendarCheck, BsCheckCircle, BsXCircle, BsCurrencyDollar } from "react-icons/bs";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const statusColors = {
  confirmed: "text-secondary bg-secondary/10",
  completed: "text-green-600 bg-green-50",
  cancelled: "text-red-500 bg-red-50",
};
const statusLabels = { confirmed: "Confirmada", completed: "Completada", cancelled: "Cancelada" };

function StatCard({ label, value, icon: Icon, accent = false }: { label: string; value: number | string; icon: any; accent?: boolean }) {
  return (
    <motion.div
      variants={item}
      className={`p-4 rounded-3xl ${accent ? "bg-primary text-white" : "bg-card border border-card-border"}`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${accent ? "bg-white/20" : "bg-muted"}`}>
        <Icon className={`text-sm ${accent ? "text-white" : "text-muted-foreground"}`} />
      </div>
      <p className={`text-2xl font-bold ${accent ? "text-white" : "text-foreground"}`}>{value}</p>
      <p className={`text-xs mt-1 ${accent ? "text-white/60" : "text-muted-foreground"}`}>{label}</p>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { data, isLoading } = useGetAdminDashboard({
    query: { queryKey: getGetAdminDashboardQueryKey() },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary px-6 pt-14 pb-8 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <p className="text-white/60 text-sm mb-1">Panel de control</p>
          <h1 className="text-2xl font-bold text-white">Esteticar Admin</h1>
        </motion.div>
      </div>

      <div className="px-6 py-6">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-28 rounded-3xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
            {/* Key stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Reservas hoy" value={data?.todayBookings ?? 0} icon={BsCalendarCheck} accent />
              <StatCard label="Total reservas" value={data?.totalBookings ?? 0} icon={BsGraphUp} />
              <StatCard label="Completadas" value={data?.completedBookings ?? 0} icon={BsCheckCircle} />
              <StatCard label="Canceladas" value={data?.cancelledBookings ?? 0} icon={BsXCircle} />
              <StatCard label="Ingresos totales" value={`$${(data?.totalRevenue ?? 0).toLocaleString()}`} icon={BsCurrencyDollar} accent />
              <StatCard label="Sucursales" value={data?.totalLocations ?? 0} icon={BsGeoAlt} />
              <StatCard label="Proveedores" value={data?.totalProviders ?? 0} icon={BsPerson} />
              <StatCard label="Clientes" value={data?.totalCustomers ?? 0} icon={BsPerson} />
            </div>

            {/* Quick links */}
            <div>
              <h2 className="text-base font-bold text-foreground mb-3">Gestión</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Reservas", href: "/admin/bookings", icon: BsCalendarCheck },
                  { label: "Sucursales", href: "/admin/locations", icon: BsGeoAlt },
                  { label: "Servicios", href: "/admin/services", icon: BsGraphUp },
                  { label: "Proveedores", href: "/admin/providers", icon: BsPerson },
                ].map(({ label, href, icon: Icon }) => (
                  <motion.button
                    key={href}
                    variants={item}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate(href)}
                    className="p-4 rounded-3xl bg-card border border-card-border text-left"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center mb-3">
                      <Icon className="text-secondary text-lg" />
                    </div>
                    <p className="font-semibold text-foreground text-sm">{label}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Recent bookings */}
            {data?.recentBookings && data.recentBookings.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-foreground">Reservas recientes</h2>
                  <button onClick={() => navigate("/admin/bookings")} className="text-sm font-semibold text-secondary">Ver todas</button>
                </div>
                <div className="space-y-2">
                  {data.recentBookings.map((booking) => (
                    <motion.div key={booking.id} variants={item} className="flex items-center justify-between p-4 rounded-2xl bg-card border border-card-border">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{booking.user?.name ?? "Cliente"}</p>
                        <p className="text-xs text-muted-foreground">{booking.service?.name} · {booking.date}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[booking.status as keyof typeof statusColors]}`}>
                        {statusLabels[booking.status as keyof typeof statusLabels]}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
