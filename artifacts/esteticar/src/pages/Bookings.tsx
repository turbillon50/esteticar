import { useState } from "react";
import {
  useListBookings,
  getListBookingsQueryKey,
  useUpdateBookingStatus,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useLocation } from "wouter";
import {
  BsCalendarX,
  BsCheckCircleFill,
  BsXCircle,
  BsClock,
  BsGeoAlt,
  BsCalendarPlus,
} from "react-icons/bs";

const STATUS = {
  confirmed: { label: "Confirmada", color: "#00B4D8", bg: "rgba(0,180,216,0.10)" },
  completed: { label: "Completada", color: "#16a34a", bg: "rgba(22,163,74,0.10)" },
  cancelled: { label: "Cancelada", color: "#ef4444", bg: "rgba(239,68,68,0.10)" },
};

function BookingCard({ booking, onCancel }: { booking: any; onCancel: (id: number) => void }) {
  const st = STATUS[booking.status as keyof typeof STATUS];
  const d = new Date(booking.date + "T00:00:00");
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl overflow-hidden bg-white"
      style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}
    >
      {/* Color top stripe */}
      <div className="h-1.5 w-full" style={{ background: st.color }} />

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-black text-base" style={{ color: "#0A1628" }}>
              {booking.service?.name ?? "Servicio"}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <BsGeoAlt className="text-xs" style={{ color: "#9ca3af" }} />
              <p className="text-xs font-medium" style={{ color: "#6b7280" }}>{booking.location?.name}</p>
            </div>
          </div>
          <div
            className="px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: st.bg, color: st.color }}
          >
            {st.label}
          </div>
        </div>

        <div
          className="flex items-center gap-4 p-3 rounded-2xl"
          style={{ background: "#f5f6f8" }}
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#9ca3af" }}>Fecha</p>
            <p className="text-sm font-black mt-0.5 capitalize" style={{ color: "#0A1628" }}>
              {d.toLocaleDateString("es-MX", { weekday: "short", month: "short", day: "numeric" })}
            </p>
          </div>
          <div className="w-px h-8" style={{ background: "#e5e7eb" }} />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#9ca3af" }}>Horario</p>
            <p className="text-sm font-black mt-0.5" style={{ color: "#0A1628" }}>
              {booking.startTime} – {booking.endTime}
            </p>
          </div>
          <div className="ml-auto">
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#9ca3af" }}>Total</p>
            <p className="text-sm font-black mt-0.5" style={{ color: "#00B4D8" }}>
              ${Number(booking.service?.price ?? 0).toLocaleString()}
            </p>
          </div>
        </div>

        {booking.status === "confirmed" && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onCancel(booking.id)}
            className="flex items-center gap-2 mt-3 text-sm font-bold"
            style={{ color: "#ef4444" }}
          >
            <BsCalendarX className="text-xs" />
            Cancelar cita
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default function Bookings() {
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");
  const [, navigate] = useLocation();
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

  return (
    <div className="min-h-screen" style={{ background: "#f5f6f8" }}>

      {/* Header */}
      <div
        className="relative overflow-hidden px-5 pt-14 pb-6"
        style={{ background: "linear-gradient(150deg, #0A1628 0%, #0d2240 70%)" }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #00B4D8, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="flex items-end justify-between relative z-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#00B4D8" }}>Mis reservas</p>
            <h1 className="text-3xl font-black text-white">Citas</h1>
          </div>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate("/book")}
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #00B4D8, #0094b3)" }}
          >
            <BsCalendarPlus className="text-white text-lg" />
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 -mt-0 pt-5">
        <div
          className="flex gap-1 p-1 rounded-2xl mb-5"
          style={{ background: "#ffffff", boxShadow: "0 2px 12px rgba(10,22,40,0.07)" }}
        >
          {[
            { key: "upcoming", label: `Próximas (${upcoming.length})` },
            { key: "history", label: `Historial (${history.length})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key as any)}
              className="flex-1 h-10 rounded-xl text-sm font-black transition-all"
              style={{
                background: tab === key ? "#0A1628" : "transparent",
                color: tab === key ? "#ffffff" : "#9ca3af",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-36 rounded-3xl bg-white animate-pulse" />)}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20">
            <div
              className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: "#ffffff", boxShadow: "0 2px 12px rgba(10,22,40,0.08)" }}
            >
              <BsClock className="text-2xl" style={{ color: "#9ca3af" }} />
            </div>
            <p className="font-black text-base mb-1" style={{ color: "#0A1628" }}>
              {tab === "upcoming" ? "Sin citas próximas" : "Sin historial"}
            </p>
            {tab === "upcoming" && (
              <>
                <p className="text-sm mb-5" style={{ color: "#9ca3af" }}>Agenda tu primer lavado</p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/book")}
                  className="h-12 px-8 rounded-2xl font-black text-white text-sm"
                  style={{ background: "linear-gradient(135deg, #0A1628, #0d2240)" }}
                >
                  Agendar ahora
                </motion.button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3 pb-6">
            {displayed.map(b => (
              <BookingCard key={b.id} booking={b} onCancel={(id) => updateStatus.mutate({ id, data: { status: "cancelled" } })} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
