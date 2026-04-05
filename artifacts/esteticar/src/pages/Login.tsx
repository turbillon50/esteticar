import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BsArrowLeft, BsEnvelopeFill, BsLockFill, BsArrowRight, BsLightningChargeFill } from "react-icons/bs";

const BG = "linear-gradient(160deg, #020b1a 0%, #03045e 30%, #0077b6 70%, #00b4d8 100%)";

export default function Login() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const redirectTo = new URLSearchParams(search).get("redirect") ?? "/";
  const { refetchUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useLogin({
    mutation: {
      onSuccess: async () => {
        await refetchUser();
        navigate(redirectTo);
      },
      onError: () => toast.error("Correo o contraseña incorrectos"),
    },
  });

  const quickLogin = (e: string, p: string) => {
    login.mutate({ data: { email: e, password: p } });
  };

  return (
    <div style={{ minHeight: "100dvh", background: BG, display: "flex", flexDirection: "column" }}>

      {/* Bubbles */}
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
          pointerEvents: "none",
        }} />
      ))}

      {/* Header */}
      <div style={{ padding: "52px 22px 0", position: "relative", zIndex: 1 }}>
        <button onClick={() => navigate("/")} style={{
          width: 42, height: 42, borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 28, cursor: "pointer",
        }}>
          <BsArrowLeft style={{ color: "#fff", fontSize: 18 }} />
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16, marginBottom: 16,
            background: "linear-gradient(135deg,#48cae4,#0096c7)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 20 }}>E</span>
          </div>
          <p style={{ color: "#fff", fontSize: 30, fontWeight: 900, marginBottom: 4 }}>Bienvenido</p>
          <p style={{ color: "rgba(144,224,239,0.7)", fontSize: 14 }}>Esteticar · Cuernavaca, Morelos</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ flex: 1, padding: "24px 16px 32px", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 12 }}
      >

        {/* ── BOTÓN PRINCIPAL: Entrar sin registro ── */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={login.isPending}
          onClick={() => quickLogin("demo@esteticar.mx", "demo123")}
          style={{
            width: "100%", height: 62, borderRadius: 20,
            background: "linear-gradient(135deg,#00b4d8 0%,#0096c7 50%,#0077b6 100%)",
            color: "#fff", fontWeight: 900, fontSize: 18,
            border: "none", cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            boxShadow: "0 8px 32px rgba(0,180,216,0.45), 0 0 0 1px rgba(255,255,255,0.15)",
            opacity: login.isPending ? 0.75 : 1,
          }}
        >
          <BsLightningChargeFill style={{ fontSize: 20 }} />
          {login.isPending ? "Entrando..." : "Entrar sin registro"}
        </motion.button>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600 }}>
          — o inicia sesión con tu cuenta —
        </p>

        {/* Login form */}
        <div style={{
          background: "rgba(255,255,255,0.97)",
          borderRadius: 24,
          padding: "20px 18px",
          boxShadow: "0 16px 48px rgba(3,4,94,0.3)",
        }}>
          <form
            onSubmit={e => { e.preventDefault(); login.mutate({ data: { email, password } }); }}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            {[
              { value: email, set: setEmail, placeholder: "Correo electrónico", type: "email", Icon: BsEnvelopeFill },
              { value: password, set: setPassword, placeholder: "Contraseña", type: "password", Icon: BsLockFill },
            ].map(({ value, set, placeholder, type, Icon }) => (
              <div key={placeholder} style={{ position: "relative" }}>
                <Icon style={{
                  position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)",
                  color: "#90a0b7", fontSize: 13,
                }} />
                <input
                  type={type}
                  placeholder={placeholder}
                  value={value}
                  onChange={e => set(e.target.value)}
                  required
                  style={{
                    width: "100%", height: 50, paddingLeft: 40, paddingRight: 14,
                    borderRadius: 13, border: "none", outline: "none",
                    background: "#f0f4f8", color: "#03045e",
                    fontSize: 14, fontWeight: 600, fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}

            <motion.button
              type="submit"
              disabled={login.isPending}
              whileTap={{ scale: 0.97 }}
              style={{
                width: "100%", height: 50, borderRadius: 13,
                background: "linear-gradient(135deg,#03045e,#0077b6)",
                color: "#fff", fontWeight: 900, fontSize: 15,
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                opacity: login.isPending ? 0.6 : 1,
                fontFamily: "inherit", marginTop: 2,
              }}
            >
              {login.isPending ? "Ingresando..." : (<>Iniciar sesión <BsArrowRight /></>)}
            </motion.button>
          </form>

          <p style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "#90a0b7" }}>
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => navigate(`/register${redirectTo !== "/" ? `?redirect=${redirectTo}` : ""}`)}
              style={{ color: "#0077b6", fontWeight: 800, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
            >
              Regístrate
            </button>
          </p>
        </div>

        {/* Acceso rápido admin */}
        <div style={{ display: "flex", gap: 8 }}>
          <motion.button whileTap={{ scale: 0.96 }}
            onClick={() => quickLogin("admin@esteticar.mx", "admin123")}
            style={{
              flex: 1, height: 38, borderRadius: 11,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.5)", fontWeight: 700, fontSize: 11,
              cursor: "pointer", fontFamily: "inherit",
            }}>
            Admin demo
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }}
            onClick={() => quickLogin("juan@esteticar.mx", "washer123")}
            style={{
              flex: 1, height: 38, borderRadius: 11,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.5)", fontWeight: 700, fontSize: 11,
              cursor: "pointer", fontFamily: "inherit",
            }}>
            Proveedor demo
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
