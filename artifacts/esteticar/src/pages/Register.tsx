import { useState } from "react";
import { useLocation } from "wouter";
import { useRegister } from "@workspace/api-client-react";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BsArrowLeft, BsEnvelopeFill, BsLockFill, BsPersonFill, BsTelephoneFill, BsArrowRight } from "react-icons/bs";

export default function Register() {
  const [, navigate] = useLocation();
  const { refetchUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });

  const register = useRegister({
    mutation: {
      onSuccess: async () => {
        await refetchUser();
        toast.success("Cuenta creada");
        navigate("/");
      },
      onError: (err: any) => toast.error(err?.message ?? "Error al crear la cuenta"),
    },
  });

  const fields = [
    { key: "name", placeholder: "Nombre completo", Icon: BsPersonFill, type: "text" },
    { key: "email", placeholder: "Correo electrónico", Icon: BsEnvelopeFill, type: "email" },
    { key: "phone", placeholder: "Teléfono (opcional)", Icon: BsTelephoneFill, type: "tel" },
    { key: "password", placeholder: "Contraseña (mín. 6 caracteres)", Icon: BsLockFill, type: "password" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f5f6f8" }}>

      <div
        className="relative overflow-hidden px-5 pt-14 pb-20"
        style={{ background: "linear-gradient(150deg, #0A1628 0%, #0d2240 70%, #0f2d54 100%)" }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #00B4D8, transparent 70%)", transform: "translate(30%, -30%)" }} />

        <button
          onClick={() => navigate("/login")}
          className="w-10 h-10 rounded-full flex items-center justify-center mb-8 relative z-10"
          style={{ background: "rgba(255,255,255,0.10)" }}
        >
          <BsArrowLeft className="text-white text-lg" />
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <div
            className="w-14 h-14 rounded-3xl flex items-center justify-center mb-5"
            style={{ background: "linear-gradient(135deg, #00B4D8, #0094b3)" }}
          >
            <span className="text-white font-black text-xl">E</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">Crear cuenta</h1>
          <p className="text-white/50 text-sm">Únete y olvídate de las filas</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="flex-1 px-4 -mt-10 relative z-10 pb-8"
      >
        <div
          className="rounded-3xl p-5 mb-4"
          style={{ background: "#ffffff", boxShadow: "0 8px 40px rgba(10,22,40,0.10)" }}
        >
          <form
            onSubmit={(e) => { e.preventDefault(); register.mutate({ data: form }); }}
            className="space-y-3"
          >
            {fields.map(({ key, placeholder, Icon, type }) => (
              <div key={key} className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#9ca3af" }} />
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                  required={key !== "phone"}
                  minLength={key === "password" ? 6 : undefined}
                  className="w-full pl-11 pr-4 rounded-2xl text-sm font-medium outline-none"
                  style={{ background: "#f5f6f8", color: "#0A1628", height: 52 }}
                />
              </div>
            ))}

            <motion.button
              type="submit"
              disabled={register.isPending}
              whileTap={{ scale: 0.97 }}
              className="w-full font-black text-white rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #00B4D8 0%, #0094b3 100%)",
                height: 52,
                fontSize: 15,
              }}
            >
              {register.isPending ? "Creando..." : (<>Crear cuenta <BsArrowRight /></>)}
            </motion.button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              ¿Ya tienes cuenta?{" "}
              <button onClick={() => navigate("/login")}
                className="font-black" style={{ color: "#0A1628" }}>
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
