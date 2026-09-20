"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { MapPin, Plus, Power, Trash2 } from "lucide-react";
import { CITIES } from "@/lib/seed";
import { isOpenLocation } from "@/lib/types";
import { useEsteticar, type LocationDraft } from "@/lib/store";

const EMPTY: LocationDraft = {
  name: "",
  address: "",
  city: "Cuernavaca",
  phone: "777-",
  openTime: "08:00",
  closeTime: "20:00",
};

function Inner() {
  const params = useSearchParams();
  const locations = useEsteticar((s) => s.locations);
  const addLocation = useEsteticar((s) => s.addLocation);
  const setLocationActive = useEsteticar((s) => s.setLocationActive);
  const removeLocation = useEsteticar((s) => s.removeLocation);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"todas" | "activas" | "baja">("todas");
  const [draft, setDraft] = useState<LocationDraft>(EMPTY);
  const [openForm, setOpenForm] = useState(params.get("nueva") === "1");
  const [flash, setFlash] = useState<string | null>(null);

  const list = useMemo(() => {
    return locations.filter((l) => {
      const hay = `${l.name} ${l.city} ${l.address}`.toLowerCase().includes(q.toLowerCase());
      if (!hay) return false;
      if (filter === "activas") return isOpenLocation(l);
      if (filter === "baja") return !isOpenLocation(l);
      return true;
    });
  }, [locations, q, filter]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim() || !draft.address.trim()) return;
    const loc = addLocation(draft);
    setDraft(EMPTY);
    setOpenForm(false);
    setFlash(`${loc.name} quedó de alta en ${loc.city}. Ya aparece en la app del cliente.`);
  };

  return (
    <div className="min-h-full bg-[var(--bg)] pb-10">
      <header className="page pb-2 pt-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--accent)]">
          Red Morelos
        </p>
        <h1 className="display mt-1 text-[40px] text-[var(--fg)]">Sucursales</h1>
        <p className="mt-1 text-[14px] text-[var(--fg-muted)]">
          Alta y baja en caliente. Lo inactivo se oculta del mapa y de la agenda.
        </p>
      </header>

      <div className="page flex flex-col gap-3 pt-2">
        {flash ? (
          <p className="rounded-[16px] bg-emerald-50 px-4 py-3 text-[13px] font-bold text-emerald-800">
            {flash}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {(["todas", "activas", "baja"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className="rounded-full px-3 py-1.5 text-[12px] font-extrabold"
              style={{
                background: filter === f ? "var(--navy)" : "#fff",
                color: filter === f ? "#fff" : "var(--fg)",
                border: "1px solid var(--border)",
              }}
            >
              {f === "todas" ? "Todas" : f === "activas" ? "Activas" : "De baja"}
            </button>
          ))}
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o ciudad"
          className="field"
        />

        <button
          type="button"
          data-testid="alta-sucursal"
          onClick={() => setOpenForm((v) => !v)}
          className="cta justify-center gap-2 text-[14px]"
        >
          <Plus size={16} /> Dar de alta sucursal
        </button>

        {openForm ? (
          <form onSubmit={submit} className="card grid gap-3 p-4 md:grid-cols-2">
            <label className="grid gap-1 text-[12px] font-bold text-[var(--fg-muted)] md:col-span-2">
              Nombre comercial
              <input
                required
                className="field"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Auto Spa Centro"
              />
            </label>
            <label className="grid gap-1 text-[12px] font-bold text-[var(--fg-muted)] md:col-span-2">
              Dirección
              <input
                required
                className="field"
                value={draft.address}
                onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                placeholder="Av. Morelos 100"
              />
            </label>
            <label className="grid gap-1 text-[12px] font-bold text-[var(--fg-muted)]">
              Ciudad
              <select
                className="field"
                value={draft.city}
                onChange={(e) => setDraft({ ...draft, city: e.target.value })}
              >
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-[12px] font-bold text-[var(--fg-muted)]">
              Teléfono
              <input
                className="field"
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
              />
            </label>
            <label className="grid gap-1 text-[12px] font-bold text-[var(--fg-muted)]">
              Abre
              <input
                type="time"
                className="field"
                value={draft.openTime}
                onChange={(e) => setDraft({ ...draft, openTime: e.target.value })}
              />
            </label>
            <label className="grid gap-1 text-[12px] font-bold text-[var(--fg-muted)]">
              Cierra
              <input
                type="time"
                className="field"
                value={draft.closeTime}
                onChange={(e) => setDraft({ ...draft, closeTime: e.target.value })}
              />
            </label>
            <div className="flex gap-2 md:col-span-2">
              <button type="submit" className="cta flex-1 justify-center text-[14px]">
                Publicar en la red
              </button>
              <button
                type="button"
                onClick={() => setOpenForm(false)}
                className="rounded-[18px] px-4 text-[13px] font-bold text-[var(--fg-muted)]"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : null}

        <p className="text-[12px] font-semibold text-[var(--fg-muted)]">
          {list.length} de {locations.length} · {locations.filter(isOpenLocation).length} visibles
          para el cliente
        </p>

        {list.map((loc) => {
          const on = isOpenLocation(loc);
          return (
            <article
              key={loc.id}
              className="card p-4"
              data-testid={`admin-branch-${loc.id}`}
              style={{ opacity: on ? 1 : 0.72 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[15px] font-extrabold text-[var(--fg)]">{loc.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[12px] text-[var(--fg-muted)]">
                    <MapPin size={12} /> {loc.address} · {loc.city}
                  </p>
                  <p className="mt-1 text-[12px] font-semibold text-[var(--fg-muted)]">
                    {loc.phone} · {loc.openTime}–{loc.closeTime}
                  </p>
                </div>
                <span className={on ? "pill-on" : "pill-off"}>{on ? "Activa" : "De baja"}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  data-testid={`baja-${loc.id}`}
                  onClick={() => {
                    setLocationActive(loc.id, !on);
                    setFlash(
                      on
                        ? `${loc.name} se dio de baja. Ya no sale en la app del cliente.`
                        : `${loc.name} volvió a la red.`,
                    );
                  }}
                  className="press flex h-11 flex-1 items-center justify-center gap-2 rounded-[14px] text-[13px] font-extrabold"
                  style={{
                    background: on ? "#fff1f2" : "#ecfdf5",
                    color: on ? "#9f1239" : "#065f46",
                  }}
                >
                  <Power size={14} /> {on ? "Dar de baja" : "Reactivar"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`¿Eliminar ${loc.name} de la demo?`)) {
                      removeLocation(loc.id);
                      setFlash(`${loc.name} se eliminó.`);
                    }
                  }}
                  className="press grid h-11 w-11 place-items-center rounded-[14px] bg-[var(--bg)] text-[var(--fg-muted)]"
                  aria-label="Eliminar"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminSucursalesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-sm font-bold text-[var(--accent)]">Cargando red…</div>}>
      <Inner />
    </Suspense>
  );
}
