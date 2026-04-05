import { useState } from "react";
import { useListBookings, getListBookingsQueryKey, useUpdateBookingStatus } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BsCalendarX, BsCheckCircleFill, BsXCircle, BsClockHistory, BsClock } from "react-icons/bs";

const statusConfig = {
  confirmed: { label: "Confirmada", color: "text-secondary", bg: "bg-secondary/10", icon: BsClock },
  completed: { label: "Completada", color: "text-green-600", bg: "bg-green-50", icon: BsCheckCircleFill },
  cancelled: { label: "Cancelada", color: "text-red-500", bg: "bg-red-50", icon: BsXCircle },
};

function BookingCard({ booking, onCancel }: { booking: any; onCancel: (id: number) => void }) {
  const status = statusConfig[booking.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;
  const d = new Date(booking.date + "T00:00:00");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-3xl bg-card border border-card-border shadow-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-foreground">{booking.service?.name ?? "Servicio"}</p>
          <p className="text-sm text-muted-foreground">{booking.location?.name}</p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${status.bg}`}>
          <StatusIcon className={`text-xs ${status.color}`} />
          <span className={`text-xs font-semibold ${status.color}`}>{status.label}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 pb-3 border-b border-border">
        <div>
          <p className="text-xs text-muted-foreground">Fecha</p>
          <p className="text-sm font-semibold text-foreground capitalize">
            {d.toLocaleDateString("es-MX", { weekday: "short", month: "short", day: "numeric" })}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Horario</p>
          <p className="text-sm font-semibold text-foreground">{booking.startTime} – {booking.endTime}</p>
        </div>
        <div className="ml-auto">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-sm font-bold text-primary">${Number(booking.service?.price ?? 0).toLocaleString()}</p>
        </div>
      </div>

      {booking.status === "confirmed" && (
        <div className="pt-3 flex justify-end">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onCancel(booking.id)}
            className="text-sm font-semibold text-red-500 flex items-center gap-1.5"
          >
            <BsCalendarX className="text-xs" />
            Cancelar cita
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

export default function Bookings() {
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");
  const queryClient = useQueryClient();

  const { data: allBookings, isLoading } = useListBookings(undefined, {
    query: { queryKey: getListBookingsQueryKey() },
  });

  const updateStatus = useUpdateBookingStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
        toast.success("Cita cancelada");
      },
      onError: () => toast.error("Error al cancelar"),
    },
  });

  const today = new Date().toISOString().split("T")[0];
  const upcoming = allBookings?.filter(b => b.date >= today && b.status === "confirmed") ?? [];
  const history = allBookings?.filter(b => b.date < today || b.status !== "confirmed") ?? [];
  const displayed = tab === "upcoming" ? upcoming : history;

  const handleCancel = (id: number) => {
    updateStatus.mutate({ id, data: { status: "cancelled" } });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-14 pb-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-6">Mis citas</h1>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted p-1 rounded-2xl mb-6">
          {[
            { key: "upcoming", label: `Próximas (${upcoming.length})` },
            { key: "history", label: `Historial (${history.length})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key as any)}
              className={`flex-1 h-10 rounded-xl text-sm font-semibold transition-all ${
                tab === key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-8">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-3xl bg-muted animate-pulse" />)}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-4">
              <BsClockHistory className="text-muted-foreground text-2xl" />
            </div>
            <p className="font-semibold text-foreground">
              {tab === "upcoming" ? "No tienes citas próximas" : "Sin historial aún"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {tab === "upcoming" && "Agenda tu primer lavado"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map((booking) => (
              <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
