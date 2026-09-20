"use client";

import { amountOf, mxn, weekSeries } from "@/lib/ops";
import { OpsHead } from "@/components/ops/OpsHead";
import { useEsteticar } from "@/lib/store";

export default function AdminReportesPage() {
  const bookings = useEsteticar((s) => s.bookings);
  const services = useEsteticar((s) => s.services);
  const locations = useEsteticar((s) => s.locations);
  const live = bookings.filter((b) => b.status !== "cancelada");
  const week = weekSeries(bookings, services);
  const total = live.reduce((s, b) => s + amountOf(b, services), 0);
  const max = Math.max(1, ...week.map((d) => d.value));

  const byService = services.map((s) => ({
    name: s.name,
    n: live.filter((b) => b.serviceId === s.id).length,
    mx: live.filter((b) => b.serviceId === s.id).reduce((a, b) => a + amountOf(b, services), 0),
  }));

  const byCity = Array.from(new Set(locations.map((l) => l.city))).map((city) => {
    const ids = locations.filter((l) => l.city === city).map((l) => l.id);
    const list = live.filter((b) => ids.includes(b.locationId));
    return {
      city,
      n: list.length,
      mx: list.reduce((a, b) => a + amountOf(b, services), 0),
    };
  }).sort((a, b) => b.mx - a.mx);

  return (
    <div className="ops-page">
      <OpsHead
        kicker="Inteligencia"
        title="Reportes"
        hint="Vista de 7 días para la junta. Cuando conectemos caja real, esto sale de Postgres."
      />
      <div className="page ops-pad">
        <div className="ops-kpi">
          <div className="ops-stat">
            <p className="ops-stat-label">Volumen demo</p>
            <p className="ops-stat-value num">{mxn(total)}</p>
            <p className="ops-stat-sub">{live.length} servicios vivos</p>
          </div>
          <div className="ops-stat">
            <p className="ops-stat-label">Ticket</p>
            <p className="ops-stat-value num">{mxn(live.length ? Math.round(total / live.length) : 0)}</p>
            <p className="ops-stat-sub">Promedio</p>
          </div>
        </div>

        <section className="ops-panel mt-5">
          <div className="ops-panel-h">
            <h2>Últimos 7 días</h2>
          </div>
          <div className="ops-bars ops-bars-lg">
            {week.map((d) => (
              <div key={d.iso} className="ops-bar">
                <div className="ops-bar-fill" style={{ height: `${Math.max(8, (d.value / max) * 100)}%` }} />
                <span>{d.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="ops-split mt-5">
          <section className="ops-panel">
            <div className="ops-panel-h">
              <h2>Por servicio</h2>
            </div>
            {byService.map((s) => (
              <div key={s.name} className="ops-line">
                <span>
                  {s.name}
                  <em> · {s.n} servicios</em>
                </span>
                <strong className="num">{mxn(s.mx)}</strong>
              </div>
            ))}
          </section>
          <section className="ops-panel">
            <div className="ops-panel-h">
              <h2>Por ciudad</h2>
            </div>
            {byCity.map((c) => (
              <div key={c.city} className="ops-line">
                <span>
                  {c.city}
                  <em> · {c.n}</em>
                </span>
                <strong className="num">{mxn(c.mx)}</strong>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
