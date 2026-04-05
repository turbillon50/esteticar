import { useState } from "react";
import { useLocation } from "wouter";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BsArrowLeft, BsEnvelopeFill, BsLockFill, BsArrowRight } from "react-icons/bs";

export default function Login() {
  const [, navigate] = useLocation();
  const { refetchUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useLogin({
    mutation: {
      onSuccess: async () => {
        await refetchUser();
        toast.success("Bienvenido de vuelta");
        navigate("/");
      },
      onError: () => toast.error("Correo o contraseña incorrectos"),
    },
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f5f6f8" }}>

      {/* Dark top section */}
      <div
        className="relative overflow-hidden px-5 pt-14 pb-20"
        style={{ background: "linear-gradient(150deg, #0A1628 0%, #0d2240 70%, #0f2d54 100%)" }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #00B4D8, transparent 70%)", transform: "translate(30%, -30%)" }} />

        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-full flex items-center justify-center mb-8 relative z-10"
          style={{ background: "rgba(255,255,255,0.10)" }}
        >
          <BsArrowLeft className="text-white text-lg" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative z-10"
        >
          <div
            className="w-14 h-14 rounded-3xl flex items-center justify-center mb-5"
            style={{ background: "linear-gradient(135deg, #00B4D8, #0094b3)" }}
          >
            <span className="text-white font-black text-xl">E</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">Bienvenido</h1>
          <p className="text-white/50 text-sm">Inicia sesión para reservar tu lavado</p>
        </motion.div>
      </div>

      {/* White card overlapping */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="flex-1 px-4 -mt-10 relative z-10"
      >
        <div
          className="rounded-3xl p-5 mb-4"
          style={{ background: "#ffffff", boxShadow: "0 8px 40px rgba(10,22,40,0.10)" }}
        >
          <form onSubmit={(e) => { e.preventDefault(); login.mutate({ data: { email, password } }); }}
            className="space-y-3">
            <div className="relative">
              <BsEnvelopeFill
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
                style={{ color: "#9ca3af" }}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-13 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none"
                style={{ background: "#f5f6f8", color: "#0A1628", height: 52 }}
              />
            </div>
            <div className="relative">
              <BsLockFill
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
                style={{ color: "#9ca3af" }}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 rounded-2xl text-sm font-medium outline-none"
                style={{ background: "#f5f6f8", color: "#0A1628", height: 52 }}
              />
            </div>

            <motion.button
              type="submit"
              disabled={login.isPending}
              whileTap={{ scale: 0.97 }}
              className="w-full font-black text-white rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #0A1628 0%, #0d2240 100%)",
                height: 52,
                fontSize: 15,
              }}
            >
              {login.isPending ? "Ingresando..." : (<>Iniciar sesión <BsArrowRight /></>)}
            </motion.button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              ¿No tienes cuenta?{" "}
              <button onClick={() => navigate("/register")}
                className="font-black" style={{ color: "#00B4D8" }}>
                Regístrate
              </button>
            </p>
          </div>
        </div>

        {/* Demo hint */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "rgba(0,180,216,0.08)", border: "1px solid rgba(0,180,216,0.2)" }}
        >
          <p className="text-xs font-black mb-1.5" style={{ color: "#00B4D8" }}>Cuentas de demo</p>
          <p className="text-xs font-medium" style={{ color: "#6b7280" }}>Admin: admin@esteticar.mx / admin123</p>
          <p className="text-xs font-medium" style={{ color: "#6b7280" }}>Proveedor: juan@esteticar.mx / washer123</p>
        </div>
      </motion.div>
    </div>
  );
}
