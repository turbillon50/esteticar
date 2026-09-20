"use client";

import Link from "next/link";
import { ArrowRight, Power } from "lucide-react";
import { OpsHead } from "@/components/ops/OpsHead";
import { BookingCard } from "@/components/ops/BookingCard";
import {
  amountOf,
  cajaSplit,
  mxn,
  occupancy,
  ofDay,
  weekSeries,
} from "@/lib/ops";
import { isoDay } from "@/lib/seed";
import { useEsteticar } from "@/lib/store";
import { isOpenLocation } from "@/lib/types";

export default function AdminHome() {
  const services = useEsteticar((s) => s.services);
  const bookings = useEsteticar((s) => s.bookings);
  const locations = useEsteticar((s) => s.locations);
  const staff = useEsteticar((s) => s.staff);
  const setLocationActive = useEsteticar((s) => s.setLocationActive);

  const today = ofDay(bookings, 0);
  const liveToday = today.filter((b) => b.status !== "cancelada");
  const pending = bookings.filter((b) => b.status === "pendiente");
  const patio = today.filter((b) => b.status === "confirmada");
  const closed = today.filter((b) => b.status === "completada");
  const ingresoHoy = liveToday.reduce((s, b) => s + amountOf(b, services), 0);
  const ticket = liveToday.length ? Math.round(ingresoHoy / liveToday.length) : 0;
  const week = weekSeries(bookings, services);
  const maxWeek = Math.max(1, ...week.map((d) => d.value));
  const caja = cajaSplit(liveToday, services);
  const onShift = staff.filter((p) => p.status === "en_turno");
  const down = locations.filter((l) => !isOpenLocation(l));

  return (
    <div className="ops-page">
      <OpsHead
        title="Tablero de operación"
        hint="Confirma citas, mira la caja del día y da de alta o baja sucursales desde aquí."
        actions={
          <Link href="/admin/citas" className="cta px-4 text-[13px]">
            Ir a agenda <ArrowRight size={14} />
          </Link>
        }
      />

      <div className="page ops-pad">
        <div className="ops-kpi">
          {[
            { label: "Caja de hoy", value: mxn(ingresoHoy), sub: `${liveToday.length} servicios` },
            { label: "Por confirmar", value: String(pending.length), sub: "requieren tu OK" },
            { label: "En patio", value: String(patio.length), sub: "confirmadas de hoy" },
            { label: "Ticket promedio", value: mxn(ticket), sub: `${closed.length} ya cerrados` },
          ].map((c) => (
            <div key={c.label} className="ops-stat">
              <p className="ops-stat-label">{c.label}</p>
              <p className="ops-stat-value num">{c.value}</p>
              <p className="ops-stat-sub">{c.sub}</p>
            </div>
          ))}
        </div>

        <section className="ops-panel mt-5">
          <div className="ops-panel-h">
            <h2>Semana</h2>
            <span>{mxn(week.reduce((s, d) => s + d.value, 0))} acumulado</span>
          </div>
          <div className="ops-bars">
            {week.map((d) => (
              <div key={d.iso} className="ops-bar">
                <div
                  className="ops-bar-fill"
                  style={{
                    height: `${Math.max(8, (d.value / maxWeek) * 100)}%`,
                    opacity: d.iso === isoDay(0) ? 1 : 0.45,
                  }}
                />
                <span>{d.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="ops-split mt-5">
          <section>
            <div className="ops-panel-h">
              <h2>Por confirmar</h2>
              <Link href="/admin/citas">Ver agenda</Link>
            </div>
            {pending.length === 0 ? (
              <p className="ops-empty">Nada pendiente. La red está al corriente.</p>
            ) : (
              <div className="grid gap-3">
                {pending.slice(0, 4).map((b) => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </div>
            )}
          </section>

          <div className="grid gap-4">
            <section className="ops-panel">
              <div className="ops-panel-h">
                <h2>Caja de hoy</h2>
                <Link href="/admin/caja">Detalle</Link>
              </div>
              {(["tarjeta", "transferencia", "oxxo"] as const).map((k) => (
                <div key={k} className="ops-line">
                  <span className="capitalize">{k === "oxxo" ? "OXXO" : k}</span>
                  <strong className="num">{mxn(caja[k])}</strong>
                </div>
              ))}
            </section>

            <section className="ops-panel">
              <div className="ops-panel-h">
                <h2>En turno</h2>
                <Link href="/admin/equipo">{onShift.length} personas</Link>
              </div>
              {onShift.slice(0, 5).map((p) => {
                const loc = locations.find((l) => l.id === p.locationId);
                return (
                  <div key={p.id} className="ops-line">
                    <span>
                      {p.name}
                      <em> · {loc?.city}</em>
                    </span>
                    <span className="ops-chip ok">En turno</span>
                  </div>
                );
              })}
            </section>
          </div>
        </div>

        <section className="mt-6">
          <div className="ops-panel-h">
            <h2>Red Morelos</h2>
            <Link href="/admin/sucursales">Gestionar</Link>
          </div>
          {down.length ? (
            <p className="ops-alert mb-3">
              {down.length} sucursal{down.length > 1 ? "es" : ""} de baja — no aparecen en la app del cliente.
            </p>
          ) : null}
          <div className="ops-grid-loc">
            {locations.map((loc) => {
              const on = isOpenLocation(loc);
              const occ = occupancy(loc, bookings, 0);
              return (
                <div key={loc.id} className="ops-loc" style={{ opacity: on ? 1 : 0.62 }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-extrabold text-[var(--fg)]">{loc.name}</p>
                      <p className="text-[12px] text-[var(--fg-muted)]">
                        {loc.city} · {loc.openTime}–{loc.closeTime}
                      </p>
                    </div>
                    <span className={on ? "ops-chip ok" : "ops-chip bad"}>{on ? "Activa" : "De baja"}</span>
                  </div>
                  <div className="ops-meter mt-3">
                    <i style={{ width: `${occ.pct}%` }} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[12px] font-semibold text-[var(--fg-muted)]">
                    <span>
                      {occ.taken} citas hoy · {occ.pct}% ocupación
                    </span>
                    <button
                      type="button"
                      onClick={() => setLocationActive(loc.id, !on)}
                      className="press grid h-8 w-8 place-items-center rounded-[10px] bg-[var(--bg)]"
                      aria-label={on ? "Dar de baja" : "Reactivar"}
                    >
                      <Power size={14} className={on ? "text-[var(--accent)]" : "text-rose-500"} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
