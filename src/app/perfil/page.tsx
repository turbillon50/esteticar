"use client";

import { Shield, Sparkles, User, Wrench } from "lucide-react";
import { useEsteticar } from "@/lib/store";
import type { Role } from "@/lib/types";

const ROLES: { id: Role; label: string; hint: string; icon: typeof User }[] = [
  { id: "cliente", label: "Cliente", hint: "Agenda y paga", icon: User },
  { id: "proveedor", label: "Proveedor", hint: "Confirma citas entrantes", icon: Sparkles },
  { id: "admin", label: "Admin", hint: "Sube precios del catálogo", icon: Shield },
];

export default function PerfilPage() {
  const role = useEsteticar((s) => s.role);
  const setRole = useEsteticar((s) => s.setRole);
  const resetDemo = useEsteticar((s) => s.resetDemo);
  const name = useEsteticar((s) => s.customerName);

  return (
    <div className="min-h-full bg-[#f0f4f8] pb-10">
      <header
        className="px-5 pb-8 pt-14 text-white"
        style={{ background: "linear-gradient(150deg,#020b1a,#03045e,#0077b6)" }}
      >
        <div className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-white/15 text-2xl font-extrabold">
          SZ
        </div>
        <h1 className="text-2xl font-extrabold">{name}</h1>
        <p className="text-sm text-white/70">Demo Cuernavaca · sin login real</p>
      </header>

      <div className="px-4 pt-5">
        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#0077b6]">
          Modo de demo
        </p>
        <div className="flex flex-col gap-2.5">
          {ROLES.map(({ id, label, hint, icon: Icon }) => {
            const on = role === id;
            return (
              <button
                key={id}
                type="button"
                data-testid={`role-${id}`}
                onClick={() => setRole(id)}
                className="flex items-center gap-3 rounded-[20px] px-4 py-3.5 text-left"
                style={{
                  background: on ? "linear-gradient(135deg,#03045e,#0077b6)" : "#fff",
                  color: on ? "#fff" : "#03045e",
                }}
              >
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15">
                  <Icon size={18} />
                </span>
                <span>
                  <span className="block font-extrabold">{label}</span>
                  <span className="text-xs opacity-70">{hint}</span>
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={resetDemo}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-bold text-[#90a0b7]"
        >
          <Wrench size={14} /> Reiniciar demo
        </button>
      </div>
    </div>
  );
}
