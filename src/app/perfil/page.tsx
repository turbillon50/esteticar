"use client";

import { Shield, Sparkles, User } from "lucide-react";
import { useEsteticar } from "@/lib/store";
import type { Role } from "@/lib/types";

const ROLES: { id: Role; label: string; hint: string; icon: typeof User }[] = [
  { id: "cliente", label: "Cliente", hint: "Agenda y paga tu lavado", icon: User },
  { id: "proveedor", label: "Lavador", hint: "Confirma citas del día", icon: Sparkles },
  { id: "admin", label: "Administración", hint: "Precios y sucursales", icon: Shield },
];

export default function PerfilPage() {
  const role = useEsteticar((s) => s.role);
  const setRole = useEsteticar((s) => s.setRole);
  const resetDemo = useEsteticar((s) => s.resetDemo);
  const name = useEsteticar((s) => s.customerName);

  return (
    <div className="min-h-full bg-[var(--bg)] pb-10">
      <header className="hero-light px-6 pb-8 pt-8 text-white">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-white/10 text-2xl font-extrabold ring-1 ring-white/15">
            SZ
          </div>
          <h1 className="display text-[40px]">{name}</h1>
          <p className="text-sm text-white/70">Cuernavaca, Morelos</p>
        </div>
      </header>

      <div className="page pt-6">
        <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--accent)]">
          Tipo de cuenta
        </p>
        <div className="grid gap-2.5 md:grid-cols-3">
          {ROLES.map(({ id, label, hint, icon: Icon }) => {
            const on = role === id;
            return (
              <button
                key={id}
                type="button"
                data-testid={`role-${id}`}
                onClick={() => setRole(id)}
                className="press card flex items-center gap-3 px-4 py-3.5 text-left"
                style={{
                  background: on ? "var(--navy)" : "#fff",
                  color: on ? "#fff" : "var(--fg)",
                }}
              >
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/10">
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
          className="mt-6 flex h-12 w-full items-center justify-center rounded-[16px] bg-white text-sm font-bold text-[var(--fg-muted)] ring-1 ring-[var(--border)] md:max-w-sm"
        >
          Restaurar datos de la app
        </button>
      </div>
    </div>
  );
}
