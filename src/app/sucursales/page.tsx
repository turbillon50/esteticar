"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Clock, MapPin, Navigation, Star } from "lucide-react";
import { DynamicMap } from "@/components/DynamicMap";
import { rankByTravelTime, resolveUserOrigin, type Coord } from "@/lib/geo";
import { useOpenLocations } from "@/lib/store";

export default function SucursalesPage() {
  const locations = useOpenLocations();
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
    <div className="min-h-full bg-[var(--bg)] pb-8">
      <header className="page pb-2 pt-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--accent)]">
          Dónde estamos
        </p>
        <h1 className="display mt-1 text-[40px] text-[var(--fg)]">Sucursales</h1>
        <p className="mt-1 text-[14px] font-medium text-[var(--fg-muted)]">
          {locations.length} autolavados · ordenadas por tiempo de traslado
        </p>
      </header>

      <div className="page split pt-2">
        <div>
          {originInfo.notice ? (
            <div
              className="mb-3.5 flex items-start gap-2 rounded-[16px] border border-amber-200 bg-amber-50 px-3.5 py-3"
              data-testid="geo-notice"
            >
              <Navigation size={14} className="mt-0.5 shrink-0 text-amber-700" />
              <p className="text-[13px] font-bold leading-snug text-amber-900">{originInfo.notice}</p>
            </div>
          ) : ready ? (
            <div className="mb-3.5 flex items-center gap-2 rounded-[16px] border border-[var(--border)] bg-white px-3.5 py-2.5">
              <MapPin size={14} className="text-[var(--accent)]" />
              <p className="text-[13px] font-bold text-[var(--fg)]">
                Tiempos de traslado desde tu ubicación
              </p>
            </div>
          ) : (
            <div className="mb-3.5 rounded-[16px] bg-white px-3.5 py-2.5 text-[13px] font-semibold text-[var(--accent)]">
              Obteniendo tu ubicación…
            </div>
          )}

          <DynamicMap
            locations={locations}
            origin={originInfo.origin}
            selectedId={selected}
            onSelect={setSelected}
            height={360}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          {ranked.map((loc, i) => {
            const on = selected === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => setSelected(on ? null : loc.id)}
                className="press flex overflow-hidden rounded-[18px] text-left"
                style={{
                  background: on ? "var(--navy)" : "#fff",
                  border: on ? "1px solid transparent" : "1px solid var(--border)",
                  boxShadow: on
                    ? "inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 24px rgba(7,20,40,0.25)"
                    : "inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
                data-testid={`branch-${loc.id}`}
              >
                <div
                  className="flex w-14 shrink-0 flex-col items-center justify-center"
                  style={{ background: on ? "rgba(46,196,224,0.12)" : "var(--bg)" }}
                >
                  <span
                    className="text-base font-extrabold"
                    style={{ color: on ? "#2ec4e0" : "var(--accent)" }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="px-1 text-center text-[9px] font-extrabold leading-tight"
                    style={{ color: on ? "#b8ecf6" : "var(--accent)" }}
                    data-testid={`eta-${loc.id}`}
                  >
                    {loc.eta}
                  </span>
                </div>
                <div className="flex-1 px-3.5 py-3">
                  <p className="text-sm font-extrabold" style={{ color: on ? "#fff" : "var(--fg)" }}>
                    {loc.name}
                  </p>
                  <p
                    className="mt-0.5 text-[11px] font-medium"
                    style={{ color: on ? "rgba(255,255,255,0.62)" : "var(--fg-muted)" }}
                  >
                    {loc.address} · {loc.city}
                  </p>
                  <div className="mt-1.5 flex items-center gap-3">
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-bold"
                      style={{ color: on ? "#2ec4e0" : "var(--accent)" }}
                    >
                      <Clock size={10} /> {loc.openTime} – {loc.closeTime}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--fg-muted)]">
                      <Star size={10} fill="currentColor" /> {loc.rating}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
          <Link href="/agenda" className="cta mt-2 justify-center">
            Agendar en la más cercana
          </Link>
        </div>
      </div>
    </div>
  );
}
