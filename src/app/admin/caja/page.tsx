"use client";

import { amountOf, cajaSplit, mxn, ofDay, PAY_LABEL, statusLabel } from "@/lib/ops";
import { OpsHead } from "@/components/ops/OpsHead";
import { useEsteticar } from "@/lib/store";

export default function AdminCajaPage() {
  const bookings = useEsteticar((s) => s.bookings);
  const services = useEsteticar((s) => s.services);
  const locations = useEsteticar((s) => s.locations);
  const today = ofDay(bookings, 0).filter((b) => b.status !== "cancelada");
  const closed = today.filter((b) => b.status === "completada");
  const open = today.filter((b) => b.status !== "completada");
  const split = cajaSplit(today, services);
  const cobrado = closed.reduce((s, b) => s + amountOf(b, services), 0);
  const porCobrar = open.reduce((s, b) => s + amountOf(b, services), 0);

  return (
    <div className="ops-page">
      <OpsHead
        kicker="Finanzas del día"
        title="Caja"
        hint="Pago por adelantado: tarjeta, transferencia y OXXO. Demo — aún sin conciliar banco."
      />
      <div className="page ops-pad">
        <div className="ops-kpi">
          <div className="ops-stat">
            <p className="ops-stat-label">Cobrado</p>
            <p className="ops-stat-value num">{mxn(cobrado)}</p>
            <p className="ops-stat-sub">{closed.length} servicios cerrados</p>
          </div>
          <div className="ops-stat">
            <p className="ops-stat-label">Por liquidar</p>
            <p className="ops-stat-value num">{mxn(porCobrar)}</p>
            <p className="ops-stat-sub">{open.length} en curso o pendientes</p>
          </div>
          <div className="ops-stat">
            <p className="ops-stat-label">Tarjeta</p>
            <p className="ops-stat-value num">{mxn(split.tarjeta)}</p>
            <p className="ops-stat-sub">Hoy</p>
          </div>
          <div className="ops-stat">
            <p className="ops-stat-label">OXXO + transfer</p>
            <p className="ops-stat-value num">{mxn(split.oxxo + split.transferencia)}</p>
            <p className="ops-stat-sub">Efectivo digital</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {today.map((b) => {
            const loc = locations.find((l) => l.id === b.locationId);
            return (
              <article key={b.id} className="ops-ticket">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-extrabold tracking-[0.12em] text-[var(--accent)]">
                      {b.folio}
                    </p>
                    <p className="mt-0.5 font-extrabold text-[var(--fg)]">{b.customerName}</p>
                    <p className="mt-1 text-[12px] font-semibold text-[var(--fg-muted)]">
                      {loc?.name} · {b.time} · {PAY_LABEL[b.payment]}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="num text-[18px] font-extrabold text-[var(--fg)]">
                      {mxn(amountOf(b, services))}
                    </p>
                    <span className="ops-chip info mt-1">{statusLabel(b.status)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
