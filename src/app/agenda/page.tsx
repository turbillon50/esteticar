"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Landmark,
  MapPin,
  Navigation,
  Store,
} from "lucide-react";
import { DynamicMap } from "@/components/DynamicMap";
import { rankByTravelTime, resolveUserOrigin, type Coord } from "@/lib/geo";
import { slotsForLocation } from "@/lib/seed";
import { useEsteticar } from "@/lib/store";
import type { PaymentMethod } from "@/lib/types";

const STEPS = ["Servicio", "Fecha", "Sucursal", "Horario", "Pago"] as const;
const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function iso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function todayISO() {
  const t = new Date();
  return iso(t.getFullYear(), t.getMonth(), t.getDate());
}

function Calendar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (d: string) => void;
}) {
  const today = new Date();
  const [y, setY] = useState(today.getFullYear());
  const [m, setM] = useState(today.getMonth());
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(first).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  const min = todayISO();

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between bg-[var(--navy)] px-5 py-4">
        <button
          type="button"
          onClick={() => {
            if (m === 0) {
              setM(11);
              setY((v) => v - 1);
            } else setM((v) => v - 1);
          }}
          className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white"
        >
          <ArrowLeft size={14} />
        </button>
        <p className="text-[17px] font-extrabold text-white">
          {MONTHS[m]} {y}
        </p>
        <button
          type="button"
          onClick={() => {
            if (m === 11) {
              setM(0);
              setY((v) => v + 1);
            } else setM((v) => v + 1);
          }}
          className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white"
        >
          <ArrowRight size={14} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 px-3 pt-2.5">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-extrabold uppercase tracking-wide text-[var(--fg-subtle)]"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 px-3 pb-4 pt-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const dateStr = iso(y, m, day);
          const past = dateStr < min;
          const on = dateStr === selected;
          return (
            <button
              key={dateStr}
              type="button"
              disabled={past}
              onClick={() => onSelect(dateStr)}
              className="aspect-square rounded-full text-[13px]"
              style={{
                fontWeight: on ? 800 : 600,
                background: on ? "var(--accent)" : "transparent",
                color: on ? "#fff" : past ? "#d1d5db" : "var(--fg)",
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AgendaPage() {
  const router = useRouter();
  const services = useEsteticar((s) => s.services);
  const locations = useEsteticar((s) => s.locations);
  const addBooking = useEsteticar((s) => s.addBooking);

  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [locationId, setLocationId] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentMethod>("tarjeta");
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [busy, setBusy] = useState(false);
  const [raw, setRaw] = useState<Coord | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setRaw({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setRaw(null),
      { timeout: 8000 },
    );
  }, []);

  const originInfo = resolveUserOrigin(raw);
  const ranked = useMemo(
    () => rankByTravelTime(originInfo.origin, locations),
    [originInfo.origin, locations],
  );

  const service = services.find((s) => s.id === serviceId) ?? null;
  const location = locations.find((l) => l.id === locationId) ?? null;
  const slots = location ? slotsForLocation(location) : [];
  const progress = ((step + 1) / STEPS.length) * 100;

  const pay = () => {
    if (!service || !location || !date || !time) return;
    setBusy(true);
    const booking = addBooking({
      serviceId: service.id,
      locationId: location.id,
      date,
      time,
      payment,
    });
    router.push(`/confirmacion?folio=${booking.folio}`);
  };

  return (
    <div className="flex min-h-full flex-col bg-[var(--bg)]">
      <div className="wizard-grid flex-1">
        <header className="wizard-head">
          <div className="mb-5 flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => (step > 0 ? setStep(step - 1) : router.push("/"))}
              className="icon-btn"
              aria-label="Regresar"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#b8ecf6]/80">
                Paso {step + 1} de {STEPS.length}
              </p>
              <p className="display text-[32px] leading-none text-white">{STEPS[step]}</p>
            </div>
          </div>
          <div className="h-1 overflow-hidden rounded bg-white/15">
            <div
              className="h-full rounded bg-[#2ec4e0]"
              style={{ width: `${progress}%`, transition: "width 250ms cubic-bezier(0.22,1,0.36,1)" }}
            />
          </div>
          <ol className="mt-6 hidden flex-col gap-2 lg:flex">
            {STEPS.map((label, i) => (
              <li
                key={label}
                className="text-[13px] font-bold"
                style={{ color: i === step ? "#b8ecf6" : "rgba(255,255,255,0.45)" }}
              >
                {String(i + 1).padStart(2, "0")}  {label}
              </li>
            ))}
          </ol>
        </header>

        <div className="px-4 py-5 lg:px-10 lg:py-8">
          {step === 0 && (
            <div className="flex flex-col gap-3.5">
              <p className="text-[13px] font-semibold text-[var(--fg-muted)]">Elige el tipo de lavado</p>
              {services.map((s) => {
                const on = serviceId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    data-testid={`pick-service-${s.id}`}
                    onClick={() => {
                      setServiceId(s.id);
                      setStep(1);
                    }}
                    className="press flex overflow-hidden rounded-[22px] text-left"
                    style={{
                      background: on ? "var(--navy)" : "#fff",
                      border: on ? "1px solid transparent" : "1px solid var(--border)",
                    }}
                  >
                    <img src={s.image} alt="" className="h-[90px] w-[90px] object-cover" />
                    <div className="flex flex-1 items-center justify-between px-4">
                      <div>
                        <p className="text-[15px] font-extrabold" style={{ color: on ? "#fff" : "var(--fg)" }}>
                          {s.name}
                        </p>
                        <p className="mt-1 text-[17px] font-extrabold text-[var(--accent-2)]">
                          ${s.price.toLocaleString("es-MX")}
                          <span className="ml-2 text-xs font-semibold opacity-70">{s.durationMinutes} min</span>
                        </p>
                      </div>
                      <ArrowRight size={14} className="text-[#c0ccd8]" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="mb-3.5 text-[13px] font-semibold text-[var(--fg-muted)]">
                ¿Qué día te lo lavamos?
              </p>
              <Calendar
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  setTime(null);
                  setStep(2);
                }}
              />
            </div>
          )}

          {step === 2 && (
            <div>
              {originInfo.notice ? (
                <div
                  className="mb-3.5 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-3"
                  data-testid="geo-notice"
                >
                  <Navigation size={14} className="mt-0.5 shrink-0 text-amber-600" />
                  <p className="text-[13px] font-bold leading-snug text-amber-800">{originInfo.notice}</p>
                </div>
              ) : (
                <p className="mb-3.5 text-[13px] font-semibold text-[var(--fg-muted)]">
                  Ordenadas por tiempo de traslado, no por kilómetros.
                </p>
              )}
              <DynamicMap
                locations={locations}
                origin={originInfo.origin}
                selectedId={locationId}
                onSelect={setLocationId}
                height={280}
              />
              <div className="mt-3.5 flex flex-col gap-2.5">
                {ranked.map((loc, i) => {
                  const on = locationId === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      data-testid={`pick-branch-${loc.id}`}
                      onClick={() => {
                        setLocationId(loc.id);
                        setTime(null);
                        setStep(3);
                      }}
                      className="press flex overflow-hidden rounded-[18px] text-left"
                      style={{
                        background: on ? "var(--navy)" : "#fff",
                        border: on ? "1px solid transparent" : "1px solid var(--border)",
                      }}
                    >
                      <div
                        className="flex w-14 shrink-0 flex-col items-center justify-center"
                        style={{ background: on ? "rgba(46,196,224,0.12)" : "var(--bg)" }}
                      >
                        <span className="text-base font-extrabold" style={{ color: on ? "#2ec4e0" : "var(--accent)" }}>
                          {i + 1}
                        </span>
                        <span className="px-1 text-center text-[9px] font-extrabold" style={{ color: on ? "#b8ecf6" : "var(--accent)" }}>
                          {loc.eta}
                        </span>
                      </div>
                      <div className="flex-1 px-3.5 py-3">
                        <p className="text-sm font-extrabold" style={{ color: on ? "#fff" : "var(--fg)" }}>
                          {loc.name}
                        </p>
                        <p className="text-[11px]" style={{ color: on ? "rgba(255,255,255,0.6)" : "var(--fg-muted)" }}>
                          {loc.city} · {loc.openTime}–{loc.closeTime}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && location && (
            <div>
              <p className="mb-3.5 text-[13px] font-semibold text-[var(--fg-muted)]">
                Horarios en {location.name}
              </p>
              <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
                {slots.map((h) => {
                  const on = time === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      data-testid={`pick-slot-${h}`}
                      onClick={() => {
                        setTime(h);
                        setStep(4);
                      }}
                      className="h-12 rounded-2xl text-sm font-extrabold"
                      style={{
                        background: on ? "var(--accent)" : "#fff",
                        color: on ? "#fff" : "var(--fg)",
                        border: on ? "1px solid transparent" : "1px solid var(--border)",
                      }}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && service && location && date && time && (
            <div className="flex flex-col gap-3">
              <div className="card p-4">
                <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--accent)]">
                  Resumen
                </p>
                <ul className="space-y-2 text-sm font-semibold text-[var(--fg)]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[var(--accent-2)]" /> {service.name}
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock size={14} className="text-[var(--accent-2)]" /> {date} · {time}
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin size={14} className="text-[var(--accent-2)]" /> {location.name}
                  </li>
                </ul>
                <p className="mt-4 text-3xl font-extrabold text-[var(--fg)]">
                  ${service.price.toLocaleString("es-MX")}
                  <span className="ml-2 text-xs font-bold text-[var(--fg-muted)]">IVA incluido</span>
                </p>
              </div>

              <p className="mt-1 text-[13px] font-semibold text-[var(--fg-muted)]">Pago por adelantado</p>
              {(
                [
                  ["tarjeta", "Tarjeta", CreditCard],
                  ["transferencia", "Transferencia", Landmark],
                  ["oxxo", "OXXO", Store],
                ] as const
              ).map(([id, label, Icon]) => (
                <button
                  key={id}
                  type="button"
                  data-testid={`pay-${id}`}
                  onClick={() => setPayment(id)}
                  className="press flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left"
                  style={{
                    background: payment === id ? "var(--navy)" : "#fff",
                    color: payment === id ? "#fff" : "var(--fg)",
                    border: payment === id ? "1px solid transparent" : "1px solid var(--border)",
                  }}
                >
                  <Icon size={18} />
                  <span className="font-extrabold">{label}</span>
                </button>
              ))}

              {payment === "tarjeta" && (
                <input
                  value={card}
                  onChange={(e) => setCard(e.target.value)}
                  className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-semibold outline-none"
                  placeholder="Número de tarjeta (demo)"
                  inputMode="numeric"
                />
              )}
              {payment === "transferencia" && (
                <p className="card px-4 py-3 text-[13px] font-semibold text-[var(--fg)]">
                  CLABE demo 012 180 001234567890. Se confirma al instante en esta demo.
                </p>
              )}
              {payment === "oxxo" && (
                <p className="card px-4 py-3 text-[13px] font-semibold text-[var(--fg)]">
                  Te damos un código OXXO al confirmar. En esta demo se marca pagado de inmediato.
                </p>
              )}

              <button
                type="button"
                data-testid="confirm-pay"
                disabled={busy}
                onClick={pay}
                className="cta mt-2 justify-center text-[15px] disabled:opacity-60"
              >
                {busy ? "Procesando…" : "Pagar y confirmar"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
