"use client";

import { useMemo, useState } from "react";
import { OpsHead } from "@/components/ops/OpsHead";
import { BookingCard } from "@/components/ops/BookingCard";
import { ofDay, statusLabel } from "@/lib/ops";
import { useEsteticar } from "@/lib/store";
import type { BookingStatus } from "@/lib/types";

const FILTERS: { id: "hoy" | "todas" | BookingStatus; label: string }[] = [
  { id: "hoy", label: "Hoy" },
  { id: "pendiente", label: "Por confirmar" },
  { id: "confirmada", label: "En patio" },
  { id: "completada", label: "Cerradas" },
  { id: "todas", label: "Todas" },
];

export default function AdminCitasPage() {
  const bookings = useEsteticar((s) => s.bookings);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("hoy");

  const list = useMemo(() => {
    if (filter === "hoy") return ofDay(bookings, 0);
    if (filter === "todas") return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  const cols: BookingStatus[] = ["pendiente", "confirmada", "completada"];

  return (
    <div className="ops-page">
      <OpsHead
        kicker="Agenda operativa"
        title="Citas"
        hint="Confirma, manda a patio y cierra el servicio. Lo mismo ve el lavador en su panel."
      />
      <div className="page ops-pad">
        <div className="ops-filters">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={filter === f.id ? "ops-chip info is-on" : "ops-chip"}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="ops-board mt-5">
          {cols.map((col) => {
            const items = list.filter((b) => b.status === col);
            return (
              <section key={col} className="ops-col">
                <header>
                  {statusLabel(col)}
                  <span>{items.length}</span>
                </header>
                <div className="grid gap-3">
                  {items.length === 0 ? (
                    <p className="ops-empty">Vacío</p>
                  ) : (
                    items.map((b) => <BookingCard key={b.id} booking={b} />)
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
