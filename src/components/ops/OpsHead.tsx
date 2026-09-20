"use client";

import { ReactNode, useEffect, useState } from "react";
import { greeting, longDate } from "@/lib/ops";

export function OpsHead({
  kicker,
  title,
  hint,
  actions,
}: {
  kicker?: string;
  title: string;
  hint?: string;
  actions?: ReactNode;
}) {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
      );
    tick();
    const t = window.setInterval(tick, 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="ops-head">
      <div className="ops-head-row">
        <div>
          <p className="ops-live">
            <span className="ops-dot" /> En vivo · {clock || "—"}
          </p>
          <p className="ops-kicker">{kicker ?? `${greeting()}, Sergio`}</p>
          <h1 className="display ops-title">{title}</h1>
          {hint ? <p className="ops-hint">{hint}</p> : null}
        </div>
        {actions ? <div className="ops-actions">{actions}</div> : null}
      </div>
      <p className="ops-date">{longDate()}</p>
    </header>
  );
}
