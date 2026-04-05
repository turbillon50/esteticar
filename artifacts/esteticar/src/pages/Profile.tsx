import { useLocation } from "wouter";
import { useAuth } from "@/components/AuthProvider";
import { useLogout, useListBookings, getListBookingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BsPerson, BsEnvelope, BsPhone, BsBoxArrowRight, BsShieldCheck, BsCalendarCheck } from "react-icons/bs";

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
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-14 pb-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">Perfil</h1>
        </motion.div>
      </div>

      <div className="px-6 space-y-4">
        {/* Avatar card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-6 rounded-3xl bg-primary text-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="text-xl font-bold">{user?.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <BsShieldCheck className="text-white/60 text-xs" />
                <span className="text-white/60 text-sm capitalize">{user?.role === "customer" ? "Cliente" : user?.role}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="p-4 rounded-3xl bg-card border border-card-border text-center">
            <p className="text-3xl font-bold text-foreground">{completed}</p>
            <p className="text-xs text-muted-foreground mt-1">Lavados completados</p>
          </div>
          <div className="p-4 rounded-3xl bg-card border border-card-border text-center">
            <p className="text-3xl font-bold text-foreground">{confirmed}</p>
            <p className="text-xs text-muted-foreground mt-1">Citas próximas</p>
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-3xl bg-card border border-card-border overflow-hidden"
        >
          {[
            { icon: BsPerson, label: "Nombre", value: user?.name },
            { icon: BsEnvelope, label: "Correo", value: user?.email },
            { icon: BsPhone, label: "Teléfono", value: user?.phone ?? "No registrado" },
            { icon: BsCalendarCheck, label: "Miembro desde", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("es-MX", { month: "long", year: "numeric" }) : "—" },
          ].map(({ icon: Icon, label, value }, i, arr) => (
            <div key={label} className={`flex items-center gap-4 px-5 py-4 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <Icon className="text-muted-foreground text-sm" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => logout.mutate({})}
          disabled={logout.isPending}
          className="w-full h-14 rounded-3xl bg-red-50 border border-red-100 text-red-500 font-semibold flex items-center justify-center gap-2 mt-2"
        >
          <BsBoxArrowRight className="text-lg" />
          Cerrar sesión
        </motion.button>
      </div>
    </div>
  );
}
