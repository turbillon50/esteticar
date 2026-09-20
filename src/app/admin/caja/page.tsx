"use client";

import { amountOf, cajaSplit, mxn, ofDay, PAY_LABEL } from "@/lib/ops";
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

        <div className="ops-table mt-6">
          <div className="ops-tr ops-th">
            <span>Folio</span>
            <span>Cliente</span>
            <span>Sucursal</span>
            <span>Vía</span>
            <span className="text-right">Importe</span>
          </div>
          {today.map((b) => {
            const loc = locations.find((l) => l.id === b.locationId);
            return (
              <div key={b.id} className="ops-tr">
                <span className="font-extrabold text-[var(--accent)]">{b.folio}</span>
                <span>
                  {b.customerName}
                  <i className="block text-[11px] not-italic text-[var(--fg-muted)]">
                    {b.time} · {b.status}
                  </i>
                </span>
                <span>{loc?.name}</span>
                <span>{PAY_LABEL[b.payment]}</span>
                <span className="num text-right font-extrabold">{mxn(amountOf(b, services))}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
