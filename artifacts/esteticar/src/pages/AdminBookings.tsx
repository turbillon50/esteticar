import { useState } from "react";
import { useListAllBookings, getListAllBookingsQueryKey, useUpdateBookingStatus, useListLocations } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BsFilterLeft, BsCheckCircleFill, BsXCircle, BsClock } from "react-icons/bs";

const statusColors = {
  confirmed: "text-secondary bg-secondary/10",
  completed: "text-green-600 bg-green-50",
  cancelled: "text-red-500 bg-red-50",
};
const statusLabels = { confirmed: "Confirmada", completed: "Completada", cancelled: "Cancelada" };

export default function AdminBookings() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: locations } = useListLocations();
  const params = statusFilter ? { status: statusFilter as any } : undefined;
  const { data: bookings, isLoading } = useListAllBookings(params, {
    query: { queryKey: getListAllBookingsQueryKey(params) },
  });

  const updateStatus = useUpdateBookingStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAllBookingsQueryKey() });
        toast.success("Estado actualizado");
      },
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-14 pb-4">
        <h1 className="text-3xl font-bold text-foreground mb-4">Reservas</h1>

        {/* Status filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { value: "", label: "Todas" },
            { value: "confirmed", label: "Confirmadas" },
            { value: "completed", label: "Completadas" },
            { value: "cancelled", label: "Canceladas" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                statusFilter === value ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-8">
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-28 rounded-3xl bg-muted animate-pulse" />)}</div>
        ) : bookings?.length === 0 ? (
          <div className="text-center py-16">
            <BsFilterLeft className="text-muted-foreground text-3xl mx-auto mb-3" />
            <p className="font-semibold text-foreground">No hay reservas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings?.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-3xl bg-card border border-card-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-foreground text-sm">{booking.user?.name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{booking.user?.email}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[booking.status as keyof typeof statusColors]}`}>
                    {statusLabels[booking.status as keyof typeof statusLabels]}
                  </span>
                </div>
                <div className="border-t border-border pt-2 flex flex-wrap gap-x-4 gap-y-1">
                  <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">{booking.service?.name}</span></p>
                  <p className="text-xs text-muted-foreground">{booking.location?.name}</p>
                  <p className="text-xs text-muted-foreground">{booking.date} · {booking.startTime}</p>
                  <p className="text-xs font-bold text-primary">${Number(booking.service?.price ?? 0).toLocaleString()}</p>
                </div>
                {booking.status === "confirmed" && (
                  <div className="flex gap-2 mt-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateStatus.mutate({ id: booking.id, data: { status: "completed" } })}
                      className="flex-1 h-9 rounded-xl bg-green-50 text-green-700 text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <BsCheckCircleFill /> Completar
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateStatus.mutate({ id: booking.id, data: { status: "cancelled" } })}
                      className="flex-1 h-9 rounded-xl bg-red-50 text-red-500 text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <BsXCircle /> Cancelar
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
