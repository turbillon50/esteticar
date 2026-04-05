import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  useListServices,
  useListLocations,
  useListTimeslots,
  getListTimeslotsQueryKey,
  useCreateBooking,
  getListBookingsQueryKey,
  getGetDashboardSummaryQueryKey,
} from "@workspace/api-client-react";
import { useAuth } from "@/components/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  BsArrowLeft, BsCheckCircleFill, BsClock,
  BsGeoAlt, BsArrowRight, BsLockFill,
  BsChevronLeft, BsChevronRight, BsGeoAltFill,
  BsStarFill,
} from "react-icons/bs";
import UnifiedMap from "@/components/UnifiedMap";
import type { MapLocation } from "@/components/UnifiedMap";

// ─── Step labels ────────────────────────────────────────────────────────────
const STEPS = ["Servicio", "Fecha", "Sucursal", "Horario", "Confirmar"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("es-MX", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const CITY_COORDS: Record<string, [number, number]> = {
  Cuernavaca: [18.9242, -99.2216],
  Jiutepec: [18.8861, -99.1708],
  Cuautla: [18.8064, -98.9456],
  Temixco: [18.8511, -99.2344],
  Yautepec: [18.8928, -99.0634],
  Jojutla: [18.618, -99.18],
  Xochitepec: [18.8078, -99.2428],
  Huitzilac: [19.01, -99.205],
};

function getLocCoords(loc: any): [number, number] {
  if (loc.lat && loc.lng) return [loc.lat, loc.lng];
  for (const [k, v] of Object.entries(CITY_COORDS)) {
    if (loc.city?.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return [18.9242, -99.2216];
}

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75",
  "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&q=75",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=75",
  "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&q=75",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=75",
];

// ─── Calendar component ───────────────────────────────────────────────────────
const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS_ES = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

function Calendar({ selected, onSelect }: { selected: string; onSelect: (d: string) => void }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayStr = today.toISOString().split("T")[0];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells: (number | null)[] = [...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div style={{ background: "#fff", borderRadius: 22, overflow: "hidden", boxShadow: "0 4px 20px rgba(3,4,94,0.10)" }}>
      {/* Month nav */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 20px 12px",
        background: "linear-gradient(135deg,#03045e,#0077b6)",
      }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={prevMonth}
          style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BsChevronLeft style={{ color: "#fff", fontSize: 14 }} />
        </motion.button>
        <p style={{ color: "#fff", fontWeight: 900, fontSize: 17 }}>
          {MONTHS_ES[viewMonth]} {viewYear}
        </p>
        <motion.button whileTap={{ scale: 0.9 }} onClick={nextMonth}
          style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BsChevronRight style={{ color: "#fff", fontSize: 14 }} />
        </motion.button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "10px 12px 4px", gap: 2 }}>
        {DAYS_ES.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 800, color: "#90a0b7", textTransform: "uppercase", letterSpacing: "0.05em" }}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "4px 12px 16px", gap: 3 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const isPast = dateStr < todayStr;
          const isToday = dateStr === todayStr;
          const isSel = dateStr === selected;
          return (
            <motion.button
              key={dateStr}
              whileTap={!isPast ? { scale: 0.88 } : {}}
              disabled={isPast}
              onClick={() => !isPast && onSelect(dateStr)}
              style={{
                aspectRatio: "1", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: isSel || isToday ? 900 : 600,
                background: isSel
                  ? "linear-gradient(135deg,#0077b6,#00b4d8)"
                  : isToday ? "rgba(0,119,182,0.12)" : "transparent",
                color: isSel ? "#fff" : isPast ? "#d1d5db" : isToday ? "#0077b6" : "#03045e",
                border: isToday && !isSel ? "1.5px solid #00b4d8" : "none",
                cursor: isPast ? "not-allowed" : "pointer",
                boxShadow: isSel ? "0 3px 12px rgba(0,119,182,0.35)" : "none",
                fontFamily: "inherit",
              }}
            >
              {day}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Geo-map location picker ──────────────────────────────────────────────────
function GeoLocationPicker({
  locations, selected, onSelect,
}: { locations: any[]; selected: any; onSelect: (l: any) => void }) {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [geoStatus, setGeoStatus] = useState<"pending" | "ok" | "denied">("pending");

  useEffect(() => {
    if (!navigator.geolocation) { setGeoStatus("denied"); return; }
    navigator.geolocation.getCurrentPosition(
      pos => { setUserPos([pos.coords.latitude, pos.coords.longitude]); setGeoStatus("ok"); },
      () => { setGeoStatus("denied"); },
      { timeout: 8000 }
    );
  }, []);

  // Sort by distance
  const sorted = [...locations].map(loc => {
    const [lat, lng] = getLocCoords(loc);
    const dist = userPos ? haversineKm(userPos[0], userPos[1], lat, lng) : null;
    return { ...loc, dist };
  }).sort((a, b) => {
    if (a.dist === null) return 1;
    if (b.dist === null) return -1;
    return a.dist - b.dist;
  });

  // Build map locations with Esteticar pin states
  const mapLocations: MapLocation[] = sorted.map(loc => {
    const [lat, lng] = getLocCoords(loc);
    return { id: loc.id, lat, lng, name: loc.name, state: selected?.id === loc.id ? "selected" : "normal" };
  });

  const center: [number, number] = userPos ?? [18.9242, -99.2216];
  const zoom = geoStatus === "ok" ? 13 : 11;

  return (
    <div>
      {/* Status banner */}
      {geoStatus === "pending" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "rgba(0,119,182,0.08)", borderRadius: 14, marginBottom: 14, border: "1px solid rgba(0,119,182,0.2)" }}>
          <div style={{ width: 16, height: 16, border: "2.5px solid #0077b6", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "#0077b6", fontSize: 13, fontWeight: 600 }}>Obteniendo tu ubicación...</p>
        </div>
      )}
      {geoStatus === "ok" && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(0,200,100,0.08)", borderRadius: 12, marginBottom: 14, border: "1px solid rgba(0,200,100,0.2)" }}>
          <BsGeoAltFill style={{ color: "#16a34a", fontSize: 14 }} />
          <p style={{ color: "#16a34a", fontSize: 13, fontWeight: 700 }}>Ubicación detectada — autolavados del más cercano al más lejano</p>
        </div>
      )}
      {geoStatus === "denied" && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(245,158,11,0.08)", borderRadius: 12, marginBottom: 14, border: "1px solid rgba(245,158,11,0.2)" }}>
          <BsGeoAlt style={{ color: "#d97706", fontSize: 14 }} />
          <p style={{ color: "#d97706", fontSize: 13, fontWeight: 700 }}>Mostrando todos los autolavados en Morelos</p>
        </div>
      )}

      {/* Map with Esteticar branded pins */}
      <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 6px 24px rgba(3,4,94,0.15)", marginBottom: 16 }}>
        <UnifiedMap
          center={center}
          zoom={zoom}
          height={240}
          locations={mapLocations}
          userPosition={userPos}
          onMarkerClick={mapLoc => {
            const loc = sorted.find(l => l.id === mapLoc.id);
            if (loc) onSelect(loc);
          }}
        />
      </div>

      {/* Location list sorted by distance */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sorted.map((loc, i) => {
          const isSel = selected?.id === loc.id;
          return (
            <motion.button
              key={loc.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(loc)}
              style={{
                display: "flex", alignItems: "center", borderRadius: 18, overflow: "hidden", cursor: "pointer",
                background: isSel ? "linear-gradient(135deg,#03045e,#0077b6)" : "#fff",
                boxShadow: isSel ? "0 6px 24px rgba(3,4,94,0.3)" : "0 2px 10px rgba(3,4,94,0.07)",
                border: isSel ? "2px solid rgba(72,202,228,0.4)" : "2px solid transparent",
                textAlign: "left",
              }}
            >
              {/* Rank / distance badge */}
              <div style={{ width: 56, flexShrink: 0, background: isSel ? "rgba(0,180,216,0.2)" : "#f0f4f8", alignSelf: "stretch", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: isSel ? "#48cae4" : "#0077b6" }}>{i + 1}</span>
                {loc.dist !== null && (
                  <span style={{ fontSize: 9, fontWeight: 800, color: isSel ? "rgba(72,202,228,0.7)" : "#90a0b7", textAlign: "center", lineHeight: 1.2 }}>
                    {loc.dist < 1 ? `${Math.round(loc.dist * 1000)}m` : `${loc.dist.toFixed(1)}km`}
                  </span>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, padding: "12px 14px" }}>
                <p style={{ fontWeight: 900, fontSize: 14, marginBottom: 2, color: isSel ? "#fff" : "#03045e" }}>{loc.name}</p>
                <p style={{ fontSize: 11, color: isSel ? "rgba(255,255,255,0.6)" : "#90a0b7", marginBottom: 4 }}>{loc.address}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <BsClock style={{ color: isSel ? "#48cae4" : "#0077b6", fontSize: 10 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: isSel ? "#48cae4" : "#0077b6" }}>{loc.openTime} – {loc.closeTime}</span>
                  </div>
                  <div style={{ display: "flex", gap: 1 }}>
                    {[1,2,3,4].map(s => <BsStarFill key={s} style={{ color: "#f59e0b", fontSize: 9 }} />)}
                  </div>
                </div>
              </div>

              <div style={{ paddingRight: 14 }}>
                {isSel ? <BsCheckCircleFill style={{ color: "#48cae4", fontSize: 18 }} /> : <BsArrowRight style={{ color: "#c0ccd8", fontSize: 13 }} />}
              </div>
            </motion.button>
          );
        })}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Main Book page ───────────────────────────────────────────────────────────
export default function Book() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [notes, setNotes] = useState("");

  const { data: services } = useListServices();
  const { data: locations } = useListLocations();
  const { data: timeslots } = useListTimeslots(
    { locationId: selectedLocation?.id, date: selectedDate },
    {
      query: {
        queryKey: getListTimeslotsQueryKey({ locationId: selectedLocation?.id, date: selectedDate }),
        enabled: !!selectedLocation && !!selectedDate,
      },
    }
  );

  const createBooking = useCreateBooking({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        navigate("/bookings");
        toast.success("¡Cita reservada con éxito!");
      },
      onError: (err: any) => toast.error(err?.message ?? "Error al reservar"),
    },
  });

  const handleConfirm = () => {
    createBooking.mutate({
      data: {
        serviceId: selectedService.id,
        locationId: selectedLocation.id,
        timeslotId: selectedSlot.id,
        date: selectedDate,
        notes: notes || undefined,
      },
    });
  };

  const activeLocations = locations?.filter(l => l.isActive) ?? [];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "#f0f4f8" }}>

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(150deg,#020b1a 0%,#03045e 50%,#0077b6 100%)",
        padding: "52px 20px 20px", position: "relative", overflow: "hidden", flexShrink: 0,
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,180,216,0.1)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -20, right: 60, width: 70, height: 70, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(72,202,228,0.08)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, position: "relative", zIndex: 1 }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => step > 0 ? setStep(step - 1) : navigate("/")}
            style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}
          >
            <BsArrowLeft style={{ color: "#fff", fontSize: 16 }} />
          </motion.button>
          <div>
            <p style={{ color: "rgba(72,202,228,0.8)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Paso {step + 1} de {STEPS.length}
            </p>
            <p style={{ color: "#fff", fontWeight: 900, fontSize: 20, lineHeight: 1.1 }}>{STEPS[step]}</p>
          </div>
        </div>

        {/* Progress */}
        <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.15)", position: "relative", zIndex: 1, overflow: "hidden" }}>
          <motion.div
            style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#48cae4,#00b4d8)", boxShadow: "0 0 8px rgba(0,180,216,0.6)" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 12, position: "relative", zIndex: 1 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 2, borderRadius: 2, background: i <= step ? "#48cae4" : "rgba(255,255,255,0.15)", transition: "background 0.3s" }} />
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ padding: "20px 16px 32px" }}
          >

            {/* ── STEP 0: Servicio ── */}
            {step === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <p style={{ color: "#90a0b7", fontSize: 13, fontWeight: 600 }}>Elige el tipo de lavado</p>
                {!services
                  ? [1,2,3].map(i => <div key={i} style={{ height: 90, borderRadius: 20, background: "#e0e8f0" }} />)
                  : services.map((service, i) => {
                    const img = service.imageUrl?.startsWith("http") ? service.imageUrl : FALLBACK_IMGS[i % FALLBACK_IMGS.length];
                    const sel = selectedService?.id === service.id;
                    return (
                      <motion.button
                        key={service.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setSelectedService(service); setStep(1); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 0, borderRadius: 22, overflow: "hidden",
                          background: sel ? "linear-gradient(145deg,#03045e,#0077b6,#00b4d8)" : "#fff",
                          boxShadow: sel ? "0 8px 28px rgba(3,4,94,0.25)" : "0 2px 12px rgba(3,4,94,0.08)",
                          border: sel ? "2px solid rgba(72,202,228,0.5)" : "2px solid transparent",
                          cursor: "pointer", textAlign: "left",
                        }}
                      >
                        <div style={{ width: 90, height: 90, flexShrink: 0, overflow: "hidden", position: "relative" }}>
                          <img src={img} alt={service.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          {sel && <div style={{ position: "absolute", inset: 0, background: "rgba(3,4,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <BsCheckCircleFill style={{ color: "#48cae4", fontSize: 22 }} />
                          </div>}
                        </div>
                        <div style={{ flex: 1, padding: "0 16px" }}>
                          <p style={{ fontWeight: 900, fontSize: 15, marginBottom: 4, color: sel ? "#fff" : "#03045e" }}>{service.name}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <BsClock style={{ color: sel ? "rgba(144,224,239,0.7)" : "#90a0b7", fontSize: 10 }} />
                              <span style={{ color: sel ? "rgba(144,224,239,0.8)" : "#90a0b7", fontSize: 12, fontWeight: 600 }}>{service.durationMinutes} min</span>
                            </div>
                            <span style={{ fontWeight: 900, fontSize: 17, color: sel ? "#48cae4" : "#0077b6" }}>
                              ${Number(service.price).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div style={{ paddingRight: 16 }}>
                          <BsArrowRight style={{ color: sel ? "#48cae4" : "#c0ccd8", fontSize: 14 }} />
                        </div>
                      </motion.button>
                    );
                  })}
              </div>
            )}

            {/* ── STEP 1: Fecha (Calendario) ── */}
            {step === 1 && (
              <div>
                <p style={{ color: "#90a0b7", fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
                  ¿Cuándo quieres tu cita?
                </p>
                <Calendar
                  selected={selectedDate}
                  onSelect={d => { setSelectedDate(d); setStep(2); }}
                />
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: 14, padding: "12px 16px", borderRadius: 14,
                      background: "linear-gradient(135deg,#03045e,#0077b6)",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}
                  >
                    <p style={{ color: "#fff", fontWeight: 800, fontSize: 14, textTransform: "capitalize" }}>
                      {formatDate(selectedDate)}
                    </p>
                    <BsCheckCircleFill style={{ color: "#48cae4", fontSize: 18 }} />
                  </motion.div>
                )}
              </div>
            )}

            {/* ── STEP 2: Sucursal (Mapa + GPS) ── */}
            {step === 2 && (
              <div>
                <p style={{ color: "#90a0b7", fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
                  Autolavados cercanos a ti
                </p>
                <GeoLocationPicker
                  locations={activeLocations}
                  selected={selectedLocation}
                  onSelect={loc => { setSelectedLocation(loc); setStep(3); }}
                />
              </div>
            )}

            {/* ── STEP 3: Horario ── */}
            {step === 3 && (
              <div>
                <p style={{ color: "#90a0b7", fontSize: 13, fontWeight: 600, marginBottom: 14, textTransform: "capitalize" }}>
                  {selectedDate ? formatDate(selectedDate) : ""}
                </p>
                {!timeslots ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                    {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ height: 56, borderRadius: 16, background: "#e0e8f0" }} />)}
                  </div>
                ) : timeslots.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "48px 0" }}>
                    <p style={{ fontWeight: 900, fontSize: 16, color: "#03045e", marginBottom: 6 }}>Sin horarios disponibles</p>
                    <p style={{ color: "#90a0b7", fontSize: 13, marginBottom: 20 }}>Prueba con otra fecha</p>
                    <motion.button whileTap={{ scale: 0.96 }} onClick={() => setStep(1)}
                      style={{ height: 46, padding: "0 24px", borderRadius: 14, background: "linear-gradient(135deg,#0077b6,#00b4d8)", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit", border: "none" }}>
                      Cambiar fecha
                    </motion.button>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                    {timeslots.map(slot => {
                      const available = slot.isAvailable && slot.currentBookings < slot.maxBookings;
                      const sel = selectedSlot?.id === slot.id;
                      return (
                        <motion.button
                          key={slot.id}
                          whileTap={{ scale: available ? 0.93 : 1 }}
                          disabled={!available}
                          onClick={() => { setSelectedSlot(slot); setStep(4); }}
                          style={{
                            height: 56, borderRadius: 16, fontWeight: 900, fontSize: 13,
                            background: sel ? "linear-gradient(135deg,#03045e,#0077b6)" : available ? "#fff" : "#f0f4f8",
                            color: sel ? "#48cae4" : available ? "#03045e" : "#c0ccd8",
                            boxShadow: sel ? "0 4px 16px rgba(3,4,94,0.3)" : available ? "0 2px 8px rgba(3,4,94,0.07)" : "none",
                            border: sel ? "1.5px solid rgba(72,202,228,0.4)" : "none",
                            cursor: available ? "pointer" : "not-allowed", fontFamily: "inherit",
                          }}
                        >
                          {slot.startTime}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 4: Confirmar ── */}
            {step === 4 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Auth gate */}
                {!isAuthenticated && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    style={{ borderRadius: 22, overflow: "hidden", background: "linear-gradient(135deg,#03045e,#0077b6)", boxShadow: "0 8px 32px rgba(3,4,94,0.3)" }}>
                    <div style={{ padding: "22px" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 14, marginBottom: 14, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <BsLockFill style={{ color: "#48cae4", fontSize: 18 }} />
                      </div>
                      <p style={{ color: "#fff", fontWeight: 900, fontSize: 18, marginBottom: 4 }}>Un último paso</p>
                      <p style={{ color: "rgba(144,224,239,0.75)", fontSize: 13, marginBottom: 20 }}>Crea tu cuenta para confirmar tu reserva. Es gratis.</p>
                      <div style={{ display: "flex", gap: 10 }}>
                        <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("/register")}
                          style={{ flex: 1, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#00b4d8,#0096c7)", color: "#fff", fontWeight: 900, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                          Crear cuenta
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("/login")}
                          style={{ flex: 1, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                          Iniciar sesión
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Summary */}
                <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: "0 4px 20px rgba(3,4,94,0.12)" }}>
                  <div style={{ padding: "18px 20px", background: "linear-gradient(135deg,#03045e,#0077b6,#00b4d8)" }}>
                    <p style={{ color: "rgba(72,202,228,0.8)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Resumen</p>
                    <p style={{ color: "#fff", fontWeight: 900, fontSize: 20 }}>{selectedService?.name}</p>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{selectedLocation?.name}</p>
                  </div>
                  <div style={{ background: "#fff", padding: "16px 20px 20px" }}>
                    {[
                      { label: "Precio", value: `$${Number(selectedService?.price).toLocaleString()} MXN` },
                      { label: "Duración", value: `${selectedService?.durationMinutes} min` },
                      { label: "Fecha", value: formatDate(selectedDate) },
                      { label: "Horario", value: `${selectedSlot?.startTime} – ${selectedSlot?.endTime}` },
                      { label: "Dirección", value: selectedLocation?.address },
                    ].map(({ label, value }, i, arr) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid #f0f4f8" : "none" }}>
                        <span style={{ color: "#90a0b7", fontSize: 13, fontWeight: 600 }}>{label}</span>
                        <span style={{ color: "#03045e", fontSize: 13, fontWeight: 900, textAlign: "right", maxWidth: "60%" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Notas para el lavador (opcional)"
                  style={{ width: "100%", height: 80, borderRadius: 16, padding: "12px 16px", background: "#fff", color: "#03045e", fontSize: 13, fontWeight: 500, border: "none", outline: "none", resize: "none", boxShadow: "0 2px 10px rgba(3,4,94,0.07)", fontFamily: "inherit", boxSizing: "border-box" }}
                />

                {isAuthenticated && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    disabled={createBooking.isPending}
                    onClick={handleConfirm}
                    style={{ width: "100%", height: 56, borderRadius: 18, background: "linear-gradient(135deg,#0077b6,#00b4d8)", color: "#fff", fontWeight: 900, fontSize: 16, border: "none", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 8px 28px rgba(0,119,182,0.4)", opacity: createBooking.isPending ? 0.7 : 1 }}
                  >
                    {createBooking.isPending ? "Confirmando..." : <><BsCheckCircleFill style={{ fontSize: 18 }} /> Confirmar reserva</>}
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
