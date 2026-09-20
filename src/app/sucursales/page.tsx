"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Clock, MapPin, Navigation, Star } from "lucide-react";
import { DynamicMap } from "@/components/DynamicMap";
import {
  rankByTravelTime,
  resolveUserOrigin,
  type Coord,
} from "@/lib/geo";
import { useEsteticar } from "@/lib/store";

export default function SucursalesPage() {
  const locations = useEsteticar((s) => s.locations);
  const [raw, setRaw] = useState<Coord | null>(null);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setReady(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setRaw({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setReady(true);
      },
      () => setReady(true),
      { timeout: 8000, maximumAge: 60_000 },
    );
  }, []);

  const originInfo = resolveUserOrigin(raw);
  const ranked = useMemo(
    () => rankByTravelTime(originInfo.origin, locations),
    [originInfo.origin, locations],
  );

  return (
    <div className="min-h-full bg-[#f0f4f8] pb-8">
      <header
        className="relative overflow-hidden px-5 pb-6 pt-14 text-white"
        style={{
          background: "linear-gradient(150deg,#020b1a 0%,#03045e 50%,#0077b6 90%)",
        }}
      >
        <p className="mb-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#48cae4]">
          Dónde estamos
        </p>
        <h1 className="text-[28px] font-extrabold leading-tight">Sucursales Esteticar</h1>
        <p className="mt-1 text-[13px] font-medium text-[#90e0ef]/70">
          {locations.length} autolavados en 6 ciudades de Morelos
        </p>
      </header>

      <div className="mt-5 px-4">
        {originInfo.notice ? (
          <div
            className="mb-3.5 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-3"
            data-testid="geo-notice"
          >
            <Navigation size={14} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-[13px] font-bold leading-snug text-amber-800">{originInfo.notice}</p>
          </div>
        ) : ready ? (
          <div className="mb-3.5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5">
            <MapPin size={14} className="text-emerald-600" />
            <p className="text-[13px] font-bold text-emerald-700">
              Ordenadas por tiempo de traslado desde tu ubicación
            </p>
          </div>
        ) : (
          <div className="mb-3.5 rounded-2xl bg-[#0077b6]/10 px-3.5 py-2.5 text-[13px] font-semibold text-[#0077b6]">
            Obteniendo tu ubicación…
          </div>
        )}

        <DynamicMap
          locations={locations}
          origin={originInfo.origin}
          selectedId={selected}
          onSelect={setSelected}
        />

        <div className="mt-4 flex flex-col gap-2.5">
          {ranked.map((loc, i) => {
            const on = selected === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => setSelected(on ? null : loc.id)}
                className="flex overflow-hidden rounded-[18px] text-left"
                style={{
                  background: on ? "linear-gradient(135deg,#03045e,#0077b6)" : "#fff",
                  boxShadow: on
                    ? "0 6px 24px rgba(3,4,94,0.3)"
                    : "0 2px 10px rgba(3,4,94,0.07)",
                }}
                data-testid={`branch-${loc.id}`}
              >
                <div
                  className="flex w-14 shrink-0 flex-col items-center justify-center"
                  style={{ background: on ? "rgba(0,180,216,0.2)" : "#f0f4f8" }}
                >
                  <span
                    className="text-base font-extrabold"
                    style={{ color: on ? "#48cae4" : "#0077b6" }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="px-1 text-center text-[9px] font-extrabold leading-tight"
                    style={{ color: on ? "rgba(72,202,228,0.85)" : "#0077b6" }}
                    data-testid={`eta-${loc.id}`}
                  >
                    {loc.eta}
                  </span>
                </div>
                <div className="flex-1 px-3.5 py-3">
                  <p
                    className="text-sm font-extrabold"
                    style={{ color: on ? "#fff" : "#03045e" }}
                  >
                    {loc.name}
                  </p>
                  <p
                    className="mt-0.5 text-[11px]"
                    style={{ color: on ? "rgba(255,255,255,0.6)" : "#90a0b7" }}
                  >
                    {loc.address} · {loc.city}
                  </p>
                  <div className="mt-1.5 flex items-center gap-3">
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-bold"
                      style={{ color: on ? "#48cae4" : "#0077b6" }}
                    >
                      <Clock size={10} /> {loc.openTime} – {loc.closeTime}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500">
                      <Star size={10} fill="currentColor" /> {loc.rating}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <Link
          href="/agenda"
          className="mt-5 flex h-12 items-center justify-center rounded-2xl text-sm font-extrabold text-white"
          style={{ background: "linear-gradient(135deg,#0077b6,#00b4d8)" }}
        >
          Agendar en la más cercana
        </Link>
      </div>
    </div>
  );
}
