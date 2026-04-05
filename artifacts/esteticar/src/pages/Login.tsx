import { useState } from "react";
import { useLocation } from "wouter";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BsEnvelope, BsLock, BsArrowLeft } from "react-icons/bs";

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
      onError: () => {
        toast.error("Correo o contraseña incorrectos");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ data: { email, password } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="pt-14 px-6 pb-8">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center mb-8"
        >
          <BsArrowLeft className="text-lg text-foreground" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-14 h-14 rounded-3xl bg-primary flex items-center justify-center mb-6">
            <span className="text-primary-foreground font-bold text-xl">E</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Bienvenido</h1>
          <p className="text-muted-foreground">Inicia sesión para reservar tu lavado</p>
        </motion.div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex-1 px-6"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <BsEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-14 pl-11 pr-4 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium border-0 outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="relative">
            <BsLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-14 pl-11 pr-4 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium border-0 outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <motion.button
            type="submit"
            disabled={login.isPending}
            whileTap={{ scale: 0.97 }}
            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base mt-2 disabled:opacity-60"
          >
            {login.isPending ? "Ingresando..." : "Iniciar sesión"}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-primary font-semibold"
            >
              Regístrate
            </button>
          </p>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-6 p-4 rounded-2xl bg-secondary/10 border border-secondary/20">
          <p className="text-xs font-semibold text-secondary mb-2">Acceso de demo</p>
          <p className="text-xs text-muted-foreground">Admin: admin@esteticar.mx / admin123</p>
          <p className="text-xs text-muted-foreground">Proveedor: juan@esteticar.mx / washer123</p>
        </div>
      </motion.div>
    </div>
  );
}
