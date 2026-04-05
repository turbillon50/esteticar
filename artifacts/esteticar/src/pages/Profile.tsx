import { useLocation } from "wouter";
import { useAuth } from "@/components/AuthProvider";
import { useLogout, useListBookings, getListBookingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BsEnvelopeFill, BsTelephoneFill, BsBoxArrowRight, BsCalendarCheckFill, BsCheckCircleFill } from "react-icons/bs";

export default function Profile() {
  const { user, refetchUser } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const { data: bookings } = useListBookings(undefined, {
    query: { queryKey: getListBookingsQueryKey() },
  });

  const logout = useLogout({
    mutation: {
      onSuccess: async () => {
        await refetchUser();
        queryClient.clear();
        toast.success("Sesión cerrada");
        navigate("/");
      },
    },
  });

  const completed = bookings?.filter(b => b.status === "completed").length ?? 0;
  const confirmed = bookings?.filter(b => b.status === "confirmed").length ?? 0;

  return (
    <div className="min-h-screen" style={{ background: "#f5f6f8" }}>

      {/* Dark header with avatar */}
      <div
        className="relative overflow-hidden px-5 pt-14 pb-24"
        style={{ background: "linear-gradient(150deg, #0A1628 0%, #0d2240 60%, #0f2d54 100%)" }}
      >
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #00B4D8, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: "#00B4D8" }}>Mi cuenta</p>
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #00B4D8 0%, #0094b3 100%)" }}
            >
              <span className="text-2xl font-black text-white">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="font-black text-xl text-white">{user?.name}</p>
              <div
                className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                <span className="text-xs font-bold capitalize" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {user?.role === "customer" ? "Cliente" : user?.role === "provider" ? "Proveedor" : "Administrador"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats — negative margin overlay */}
      <div className="px-4 -mt-14 relative z-10 mb-4">
        <div
          className="flex gap-3 rounded-3xl p-4"
          style={{ background: "#ffffff", boxShadow: "0 8px 40px rgba(10,22,40,0.12)" }}
        >
          <div className="flex-1 text-center">
            <p className="text-3xl font-black" style={{ color: "#0A1628" }}>{completed}</p>
            <p className="text-[11px] font-semibold mt-0.5" style={{ color: "#9ca3af" }}>Completados</p>
          </div>
          <div className="w-px" style={{ background: "#f0f0f0" }} />
          <div className="flex-1 text-center">
            <p className="text-3xl font-black" style={{ color: "#0A1628" }}>{confirmed}</p>
            <p className="text-[11px] font-semibold mt-0.5" style={{ color: "#9ca3af" }}>Próximas</p>
          </div>
          <div className="w-px" style={{ background: "#f0f0f0" }} />
          <div className="flex-1 text-center">
            <p className="text-3xl font-black" style={{ color: "#00B4D8" }}>★</p>
            <p className="text-[11px] font-semibold mt-0.5" style={{ color: "#9ca3af" }}>Calidad</p>
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="px-4 space-y-3">
        <div
          className="rounded-3xl overflow-hidden"
          style={{ background: "#ffffff", boxShadow: "0 2px 12px rgba(10,22,40,0.06)" }}
        >
          {[
            { Icon: BsEnvelopeFill, label: "Correo", value: user?.email },
            { Icon: BsTelephoneFill, label: "Teléfono", value: user?.phone ?? "No registrado" },
            { Icon: BsCalendarCheckFill, label: "Miembro desde", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("es-MX", { month: "long", year: "numeric" }) : "—" },
          ].map(({ Icon, label, value }, i, arr) => (
            <div
              key={label}
              className="flex items-center gap-4 px-5 py-4"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid #f0f0f0" : undefined }}
            >
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#f5f6f8" }}
              >
                <Icon className="text-sm" style={{ color: "#9ca3af" }} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#9ca3af" }}>{label}</p>
                <p className="text-sm font-black mt-0.5" style={{ color: "#0A1628" }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Logout */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => logout.mutate({})}
          disabled={logout.isPending}
          className="w-full h-14 rounded-3xl font-black flex items-center justify-center gap-2"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1.5px solid rgba(239,68,68,0.15)",
            color: "#ef4444",
          }}
        >
          <BsBoxArrowRight className="text-lg" />
          Cerrar sesión
        </motion.button>
      </div>
    </div>
  );
}
