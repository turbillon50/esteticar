"use client";

import { useEffect, useState } from "react";

export function Splash({ onDone }: { onDone: () => void }) {
  const [out, setOut] = useState(false);

  useEffect(() => {
    let live = true;
    try {
      if (sessionStorage.getItem("esteticar-splash") === "1") {
        onDone();
        return;
      }
    } catch {
      onDone();
      return;
    }
    const fade = window.setTimeout(() => {
      if (live) setOut(true);
    }, 1600);
    const done = window.setTimeout(() => {
      try {
        sessionStorage.setItem("esteticar-splash", "1");
      } catch {
        /* ignore */
      }
      if (live) onDone();
    }, 2000);
    return () => {
      live = false;
      clearTimeout(fade);
      clearTimeout(done);
    };
  }, [onDone]);

  return (
    <div className={`splash ${out ? "is-out" : ""}`} aria-hidden>
      <div className="splash-mark">
        <img src="/brand/logo.jpg" alt="Esteticar" />
      </div>
      <p className="splash-copy">Morelos · a domicilio</p>
    </div>
  );
}
