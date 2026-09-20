"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";
import { useEsteticar } from "@/lib/store";

const HIDE_NAV = ["/agenda", "/confirmacion"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = !HIDE_NAV.some((p) => pathname.startsWith(p));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = useEsteticar.persist.onFinishHydration(() => setReady(true));
    if (useEsteticar.persist.hasHydrated()) setReady(true);
    return unsub;
  }, []);

  return (
    <div
      className="flex min-h-dvh justify-center"
      style={{
        background: "linear-gradient(160deg,#020b1a 0%,#03045e 50%,#0077b6 100%)",
      }}
    >
      <div
        className="relative flex w-full max-w-[430px] flex-col"
        style={{
          minHeight: "100dvh",
          background: "#f0f4f8",
          boxShadow: "0 0 80px rgba(0,119,182,0.35), 0 0 40px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="flex-1 overflow-y-auto overscroll-none"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {ready ? children : <div className="p-10 text-center text-sm font-bold text-[#0077b6]">Cargando Esteticar…</div>}
        </div>
        {showNav && ready ? <BottomNav /> : null}
      </div>
    </div>
  );
}
