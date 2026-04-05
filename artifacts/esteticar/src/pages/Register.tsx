import { useState } from "react";
import { useLocation } from "wouter";
import { useRegister } from "@workspace/api-client-react";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BsEnvelope, BsLock, BsPerson, BsPhone, BsArrowLeft } from "react-icons/bs";

export default function Register() {
  const [, navigate] = useLocation();
  const { refetchUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });

  const register = useRegister({
    mutation: {
      onSuccess: async () => {
        await refetchUser();
        toast.success("Cuenta creada exitosamente");
        navigate("/");
      },
      onError: (err: any) => {
        toast.error(err?.message ?? "Error al crear la cuenta");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate({ data: form });
  };

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="pt-14 px-6 pb-8">
        <button
          onClick={() => navigate("/login")}
          className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center mb-8"
        >
          <BsArrowLeft className="text-lg text-foreground" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-14 h-14 rounded-3xl bg-secondary flex items-center justify-center mb-6">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Crear cuenta</h1>
          <p className="text-muted-foreground">Únete a Esteticar y olvídate de esperar</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex-1 px-6 pb-8"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { field: "name", placeholder: "Nombre completo", icon: BsPerson, type: "text" },
            { field: "email", placeholder: "Correo electrónico", icon: BsEnvelope, type: "email" },
            { field: "phone", placeholder: "Teléfono (opcional)", icon: BsPhone, type: "tel" },
            { field: "password", placeholder: "Contraseña (mín. 6 caracteres)", icon: BsLock, type: "password" },
          ].map(({ field, placeholder, icon: Icon, type }) => (
            <div key={field} className="relative">
              <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={type}
                placeholder={placeholder}
                value={form[field as keyof typeof form]}
                onChange={(e) => updateField(field, e.target.value)}
                required={field !== "phone"}
                minLength={field === "password" ? 6 : undefined}
                className="w-full h-14 pl-11 pr-4 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium border-0 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          ))}

          <motion.button
            type="submit"
            disabled={register.isPending}
            whileTap={{ scale: 0.97 }}
            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base mt-2 disabled:opacity-60"
          >
            {register.isPending ? "Creando cuenta..." : "Crear cuenta"}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary font-semibold"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
