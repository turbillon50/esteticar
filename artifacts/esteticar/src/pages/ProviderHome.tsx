import { useGetProviderSchedule, getGetProviderScheduleQueryKey, useGetProviderStats, getGetProviderStatsQueryKey, useUpdateBookingStatus, getListBookingsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/components/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BsCheckCircleFill, BsClock, BsPerson } from "react-icons/bs";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function ProviderHome() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: schedule, isLoading } = useGetProviderSchedule(
    { date: today },
    { query: { queryKey: getGetProviderScheduleQueryKey({ date: today }) } }
  );

  const { data: stats } = useGetProviderStats({
    query: { queryKey: getGetProviderStatsQueryKey() },
  });

  const updateStatus = useUpdateBookingStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProviderScheduleQueryKey({ date: today }) });
        queryClient.invalidateQueries({ queryKey: getGetProviderStatsQueryKey() });
        toast.success("Servicio marcado como completado");
      },
      onError: () => toast.error("Error al actualizar"),
    },
  });

  const todayFormatted = new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary px-6 pt-14 pb-8 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <p className="text-white/60 text-sm mb-1 capitalize">{todayFormatted}</p>
          <h1 className="text-2xl font-bold text-white">Hola, {user?.name?.split(" ")[0]}</h1>
        </motion.div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Stats */}
        {stats && (
          <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3">
            {[
              { label: "Hoy", value: stats.totalToday },
              { label: "Esta semana", value: stats.totalThisWeek },
              { label: "Este mes", value: stats.totalThisMonth },
              { label: "Total", value: stats.totalCompleted },
            ].map(({ label, value }) => (
              <motion.div key={label} variants={item} className="p-4 rounded-3xl bg-card border border-card-border text-center">
                <p className="text-3xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Today's schedule */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Agenda de hoy</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-24 rounded-3xl bg-muted animate-pulse" />)}
            </div>
          ) : schedule?.length === 0 ? (
            <div className="text-center py-10 rounded-3xl bg-card border border-card-border">
              <BsClock className="text-muted-foreground text-2xl mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">Sin citas para hoy</p>
            </div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="visible" className="space-y-3">
              {schedule?.map((booking) => (
                <motion.div key={booking.id} variants={item} className="p-4 rounded-3xl bg-card border border-card-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <BsClock className="text-secondary text-xs" />
                        <span className="text-sm font-bold text-foreground">{booking.startTime} – {booking.endTime}</span>
                      </div>
                      <p className="font-semibold text-foreground">{booking.service?.name}</p>
                      {booking.user && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <BsPerson className="text-muted-foreground text-xs" />
                          <span className="text-xs text-muted-foreground">{booking.user.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {booking.status === "completed" ? (
                        <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full">
                          <BsCheckCircleFill className="text-green-600 text-xs" />
                          <span className="text-xs font-semibold text-green-700">Completado</span>
                        </div>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateStatus.mutate({ id: booking.id, data: { status: "completed" } })}
                          className="h-9 px-4 rounded-full bg-primary text-white text-xs font-bold"
                        >
                          Completar
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
