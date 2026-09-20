"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useEsteticar } from "@/lib/store";
import { Splash } from "./Splash";
import { TopBar } from "./TopBar";
import { SideMenu } from "./SideMenu";
import { TabBar } from "./TabBar";
import { DesktopRail } from "./DesktopRail";
import { AdminRail } from "./AdminRail";
import { AdminTabBar } from "./AdminTabBar";
import { AdminTopBar } from "./AdminTopBar";
import { AdminMenu } from "./AdminMenu";

const HIDE_MOBILE = ["/agenda", "/confirmacion"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOps = pathname.startsWith("/admin");
  const hideMobile = HIDE_MOBILE.some((p) => pathname.startsWith(p));
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const unsub = useEsteticar.persist.onFinishHydration(() => setReady(true));
    if (useEsteticar.persist.hasHydrated()) setReady(true);
    const t = window.setTimeout(() => setReady(true), 600);
    return () => {
      unsub();
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOps) return;
    setSplash(false);
    if (useEsteticar.getState().role !== "admin") {
      useEsteticar.getState().setRole("admin");
    }
  }, [isOps]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  const endSplash = useCallback(() => setSplash(false), []);

  return (
    <div className={`app ${isOps ? "is-ops" : ""}`}>
      {splash && !isOps ? <Splash onDone={endSplash} /> : null}
      {isOps ? <AdminRail /> : <DesktopRail />}
      <div className="stage">
        {isOps ? (
          <AdminTopBar open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} />
        ) : !hideMobile ? (
          <TopBar open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} />
        ) : null}
        {isOps ? (
          <AdminMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        ) : (
          <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        )}
        <div className="stage-body">
          {ready ? (
            children
          ) : (
            <div className="p-10 text-center text-sm font-bold text-[var(--accent)]">
              Cargando Esteticar…
            </div>
          )}
        </div>
        {isOps && ready ? <AdminTabBar /> : null}
        {!isOps && !hideMobile && ready ? <TabBar /> : null}
      </div>
    </div>
  );
}
