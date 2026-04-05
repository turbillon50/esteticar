import { useState } from "react";
import { useLocation } from "wouter";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BsArrowLeft, BsEnvelopeFill, BsLockFill, BsArrowRight } from "react-icons/bs";

const BG = "linear-gradient(160deg, #020b1a 0%, #03045e 30%, #0077b6 70%, #00b4d8 100%)";

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
    <div style={{ minHeight: "100dvh", background: BG, display: "flex", flexDirection: "column" }}>

      {/* Bubble overlays */}
      {[
        { size: 200, top: -60, right: -60, op: 0.10 },
        { size: 120, top: 140, left: -30, op: 0.08 },
        { size: 80, bottom: 200, right: 30, op: 0.10 },
      ].map((b, i) => (
        <div key={i} style={{
          position: "absolute", width: b.size, height: b.size, borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.2)",
          background: `rgba(72,202,228,${b.op})`,
          top: (b as any).top, bottom: (b as any).bottom,
          right: (b as any).right, left: (b as any).left,
          pointerEvents: "none", backdropFilter: "blur(2px)",
        }} />
      ))}

      {/* Header */}
      <div style={{ padding: "52px 22px 0", position: "relative", zIndex: 1 }}>
        <button
          onClick={() => navigate("/")}
          style={{
            width: 42, height: 42, borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <BsArrowLeft style={{ color: "#fff", fontSize: 18 }} />
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 18, marginBottom: 20,
            background: "linear-gradient(135deg, #48cae4 0%, #0096c7 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 22 }}>E</span>
          </div>
          <p style={{ color: "#fff", fontSize: 32, fontWeight: 900, marginBottom: 6 }}>Bienvenido</p>
          <p style={{ color: "rgba(144,224,239,0.75)", fontSize: 14 }}>Inicia sesión para reservar tu lavado</p>
        </motion.div>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ flex: 1, padding: "28px 16px 20px", position: "relative", zIndex: 1 }}
      >
        <div style={{
          background: "rgba(255,255,255,0.97)",
          borderRadius: 28,
          padding: "24px 20px",
          boxShadow: "0 20px 60px rgba(3,4,94,0.35)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.8)",
        }}>
          <form
            onSubmit={e => { e.preventDefault(); login.mutate({ data: { email, password } }); }}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            {[
              { value: email, set: setEmail, placeholder: "Correo electrónico", type: "email", Icon: BsEnvelopeFill },
              { value: password, set: setPassword, placeholder: "Contraseña", type: "password", Icon: BsLockFill },
            ].map(({ value, set, placeholder, type, Icon }) => (
              <div key={placeholder} style={{ position: "relative" }}>
                <Icon style={{
                  position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                  color: "#90a0b7", fontSize: 14,
                }} />
                <input
                  type={type}
                  placeholder={placeholder}
                  value={value}
                  onChange={e => set(e.target.value)}
                  required
                  style={{
                    width: "100%", height: 52, paddingLeft: 42, paddingRight: 16,
                    borderRadius: 14, border: "none", outline: "none",
                    background: "#f0f4f8", color: "#03045e",
                    fontSize: 14, fontWeight: 600,
                    fontFamily: "inherit",
                  }}
                />
              </div>
            ))}

            <motion.button
              type="submit"
              disabled={login.isPending}
              whileTap={{ scale: 0.97 }}
              style={{
                width: "100%", height: 52, borderRadius: 14,
                background: "linear-gradient(135deg, #03045e 0%, #0077b6 60%, #00b4d8 100%)",
                color: "#fff", fontWeight: 900, fontSize: 15,
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 6px 24px rgba(3,4,94,0.35)",
                opacity: login.isPending ? 0.6 : 1,
                fontFamily: "inherit",
                marginTop: 4,
              }}
            >
              {login.isPending ? "Ingresando..." : (<>Iniciar sesión <BsArrowRight /></>)}
            </motion.button>
          </form>

          <p style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: "#90a0b7" }}>
            ¿No tienes cuenta?{" "}
            <button onClick={() => navigate("/register")}
              style={{ color: "#0077b6", fontWeight: 800, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              Regístrate
            </button>
          </p>
        </div>

        {/* Demo hint */}
        <div style={{
          marginTop: 14, borderRadius: 18, padding: "14px 18px",
          background: "rgba(72,202,228,0.12)",
          border: "1px solid rgba(72,202,228,0.25)",
        }}>
          <p style={{ color: "#48cae4", fontSize: 11, fontWeight: 800, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Demo
          </p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "monospace" }}>Admin: admin@esteticar.mx / admin123</p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "monospace" }}>Proveedor: juan@esteticar.mx / washer123</p>
        </div>
      </motion.div>
    </div>
  );
}
