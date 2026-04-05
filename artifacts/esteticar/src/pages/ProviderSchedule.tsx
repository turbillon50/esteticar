import { useState } from "react";
import { useGetProviderSchedule, getGetProviderScheduleQueryKey, useUpdateBookingStatus } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BsArrowLeft, BsArrowRight, BsCheckCircleFill, BsClock, BsPerson } from "react-icons/bs";

export default function ProviderSchedule() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const queryClient = useQueryClient();

  const { data: schedule, isLoading } = useGetProviderSchedule(
    { date },
    { query: { queryKey: getGetProviderScheduleQueryKey({ date }) } }
  );

  const updateStatus = useUpdateBookingStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProviderScheduleQueryKey({ date }) });
        toast.success("Servicio completado");
      },
    },
  });

  const changeDate = (delta: number) => {
    const d = new Date(date + "T00:00:00");
    d.setDate(d.getDate() + delta);
    setDate(d.toISOString().split("T")[0]);
  };

  const formatted = new Date(date + "T00:00:00").toLocaleDateString("es-MX", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-14 pb-4">
        <h1 className="text-3xl font-bold text-foreground mb-6">Agenda</h1>

        {/* Date selector */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-card-border mb-6">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => changeDate(-1)} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <BsArrowLeft />
          </motion.button>
          <p className="text-sm font-semibold text-foreground capitalize">{formatted}</p>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => changeDate(1)} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <BsArrowRight />
          </motion.button>
        </div>
      </div>

      <div className="px-6 pb-8">
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-24 rounded-3xl bg-muted animate-pulse" />)}</div>
        ) : schedule?.length === 0 ? (
          <div className="text-center py-16">
            <BsClock className="text-muted-foreground text-3xl mx-auto mb-3" />
            <p className="font-semibold text-foreground">Sin citas este día</p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedule?.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-3xl bg-card border border-card-border"
              >
                <div className="flex items-start justify-between">
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
                  {booking.status === "completed" ? (
                    <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full">
                      <BsCheckCircleFill className="text-green-600 text-xs" />
                      <span className="text-xs font-semibold text-green-700">Listo</span>
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
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
