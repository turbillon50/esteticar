"use client";

import { OpsHead } from "@/components/ops/OpsHead";
import { staffLabel } from "@/lib/ops";
import { useEsteticar } from "@/lib/store";
import type { StaffStatus } from "@/lib/types";

const NEXT: Record<StaffStatus, StaffStatus> = {
  en_turno: "descanso",
  descanso: "libre",
  libre: "en_turno",
};

const CHIP: Record<StaffStatus, string> = {
  en_turno: "ops-chip ok",
  descanso: "ops-chip warn",
  libre: "ops-chip",
};

const LABEL: Record<StaffStatus, string> = {
  en_turno: "En turno",
  descanso: "Descanso",
  libre: "Libre",
};

export default function AdminEquipoPage() {
  const staff = useEsteticar((s) => s.staff);
  const locations = useEsteticar((s) => s.locations);
  const setStaffStatus = useEsteticar((s) => s.setStaffStatus);
  const on = staff.filter((p) => p.status === "en_turno").length;

  return (
    <div className="ops-page">
      <OpsHead
        kicker="Personal Morelos"
        title="Equipo"
        hint={`${on} en turno ahora. Toca el estado para rotar turno / descanso / libre.`}
      />
      <div className="page ops-pad grid gap-3 md:grid-cols-2">
        {staff.map((p) => {
          const loc = locations.find((l) => l.id === p.locationId);
          return (
            <article key={p.id} className="ops-loc">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="ops-avatar">
                    {p.name
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <div>
                    <p className="font-extrabold text-[var(--fg)]">{p.name}</p>
                    <p className="text-[12px] text-[var(--fg-muted)]">
                      {staffLabel(p.role)} · {loc?.name}
                    </p>
                    <p className="text-[12px] text-[var(--fg-muted)]">{p.phone}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className={CHIP[p.status]}
                  onClick={() => setStaffStatus(p.id, NEXT[p.status])}
                >
                  {LABEL[p.status]}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
