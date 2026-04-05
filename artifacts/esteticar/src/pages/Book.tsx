import { useState } from "react";
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
} from "react-icons/bs";

const STEPS = ["Servicio", "Sucursal", "Fecha", "Horario", "Confirmar"];

const GRADIENTS = [
  "linear-gradient(145deg,#03045e 0%,#0077b6 45%,#00b4d8 80%,#90e0ef 100%)",
  "linear-gradient(145deg,#005f73 0%,#0a9396 50%,#48cae4 85%,#caf0f8 100%)",
  "linear-gradient(145deg,#10002b 0%,#3a0ca3 45%,#4cc9f0 100%)",
];

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75",
  "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&q=75",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=75",
];

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("es-MX", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function getNext7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

export default function Book() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
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
        toast.success("Cita reservada con éxito");
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

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "#f0f4f8" }}>

      {/* ── HEADER ── */}
      <div style={{
        background: "linear-gradient(150deg,#020b1a 0%,#03045e 50%,#0077b6 100%)",
        padding: "52px 20px 20px",
        position: "relative", overflow: "hidden", flexShrink: 0,
      }}>
        {/* Bubble deco */}
        <div style={{
          position: "absolute", top: -30, right: -30, width: 120, height: 120,
          borderRadius: "50%", border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(0,180,216,0.1)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -20, right: 60, width: 70, height: 70,
          borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(72,202,228,0.08)", pointerEvents: "none",
        }} />

        {/* Back + Step */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, position: "relative", zIndex: 1 }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => step > 0 ? setStep(step - 1) : navigate("/")}
            style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, cursor: "pointer",
            }}
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

        {/* Progress bar */}
        <div style={{
          height: 4, borderRadius: 4,
          background: "rgba(255,255,255,0.15)",
          position: "relative", zIndex: 1, overflow: "hidden",
        }}>
          <motion.div
            style={{
              height: "100%", borderRadius: 4,
              background: "linear-gradient(90deg,#48cae4,#00b4d8)",
              boxShadow: "0 0 8px rgba(0,180,216,0.6)",
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>

        {/* Step indicator dots */}
        <div style={{ display: "flex", gap: 6, marginTop: 12, position: "relative", zIndex: 1 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{
              flex: 1, height: 2, borderRadius: 2,
              background: i <= step ? "#48cae4" : "rgba(255,255,255,0.15)",
              transition: "background 0.3s",
            }} />
          ))}
        </div>
      </div>

      {/* ── STEP CONTENT ── */}
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
                <p style={{ color: "#90a0b7", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                  Elige el tipo de lavado que necesitas
                </p>
                {!services
                  ? [1, 2, 3].map(i => <div key={i} style={{ height: 100, borderRadius: 20, background: "#e0e8f0" }} />)
                  : services.map((service, i) => {
                    const img = service.imageUrl?.startsWith("http") ? service.imageUrl : FALLBACK_IMGS[i % FALLBACK_IMGS.length];
                    return (
                      <motion.button
                        key={service.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setSelectedService(service); setStep(1); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 0,
                          borderRadius: 22, overflow: "hidden",
                          background: selectedService?.id === service.id
                            ? GRADIENTS[i % GRADIENTS.length]
                            : "#fff",
                          boxShadow: selectedService?.id === service.id
                            ? "0 8px 28px rgba(3,4,94,0.25)"
                            : "0 2px 12px rgba(3,4,94,0.08)",
                          border: selectedService?.id === service.id
                            ? "2px solid rgba(72,202,228,0.5)"
                            : "2px solid transparent",
                          cursor: "pointer", textAlign: "left",
                        }}
                      >
                        {/* Image */}
                        <div style={{ width: 90, height: 90, flexShrink: 0, overflow: "hidden", position: "relative" }}>
                          <img src={img} alt={service.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          {selectedService?.id === service.id && (
                            <div style={{
                              position: "absolute", inset: 0,
                              background: "rgba(3,4,94,0.3)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <BsCheckCircleFill style={{ color: "#48cae4", fontSize: 22 }} />
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1, padding: "0 16px" }}>
                          <p style={{
                            fontWeight: 900, fontSize: 15, marginBottom: 4,
                            color: selectedService?.id === service.id ? "#fff" : "#03045e",
                          }}>{service.name}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <BsClock style={{ color: selectedService?.id === service.id ? "rgba(144,224,239,0.7)" : "#90a0b7", fontSize: 10 }} />
                              <span style={{ color: selectedService?.id === service.id ? "rgba(144,224,239,0.8)" : "#90a0b7", fontSize: 12, fontWeight: 600 }}>
                                {service.durationMinutes} min
                              </span>
                            </div>
                            <span style={{
                              fontWeight: 900, fontSize: 17,
                              color: selectedService?.id === service.id ? "#48cae4" : "#0077b6",
                            }}>
                              ${Number(service.price).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div style={{ paddingRight: 16, flexShrink: 0 }}>
                          <BsArrowRight style={{
                            color: selectedService?.id === service.id ? "#48cae4" : "#c0ccd8",
                            fontSize: 14,
                          }} />
                        </div>
                      </motion.button>
                    );
                  })
                }
              </div>
            )}

            {/* ── STEP 1: Sucursal ── */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ color: "#90a0b7", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                  Elige el autolavado más cercano
                </p>
                {!locations
                  ? [1, 2, 3].map(i => <div key={i} style={{ height: 80, borderRadius: 20, background: "#e0e8f0" }} />)
                  : locations.filter(l => l.isActive).map(loc => {
                    const sel = selectedLocation?.id === loc.id;
                    return (
                      <motion.button
                        key={loc.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setSelectedLocation(loc); setStep(2); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 0,
                          borderRadius: 20, overflow: "hidden", cursor: "pointer",
                          background: sel ? "linear-gradient(135deg,#03045e,#0077b6)" : "#fff",
                          boxShadow: sel ? "0 6px 24px rgba(3,4,94,0.25)" : "0 2px 10px rgba(3,4,94,0.07)",
                          border: sel ? "2px solid rgba(72,202,228,0.4)" : "2px solid transparent",
                          textAlign: "left",
                        }}
                      >
                        <div style={{
                          width: 60, height: 74, flexShrink: 0,
                          background: sel ? "rgba(0,180,216,0.2)" : "#f0f4f8",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <BsGeoAlt style={{ color: sel ? "#48cae4" : "#0077b6", fontSize: 22 }} />
                        </div>
                        <div style={{ flex: 1, padding: "0 14px" }}>
                          <p style={{ fontWeight: 900, fontSize: 14, marginBottom: 3, color: sel ? "#fff" : "#03045e" }}>
                            {loc.name}
                          </p>
                          <p style={{ fontSize: 11, color: sel ? "rgba(255,255,255,0.6)" : "#90a0b7", marginBottom: 4 }}>
                            {loc.address}
                          </p>
                          {loc.openTime && (
                            <p style={{ fontSize: 11, fontWeight: 700, color: sel ? "#48cae4" : "#0077b6" }}>
                              {loc.openTime} – {loc.closeTime}
                            </p>
                          )}
                        </div>
                        <div style={{ paddingRight: 16 }}>
                          <BsArrowRight style={{ color: sel ? "#48cae4" : "#c0ccd8", fontSize: 14 }} />
                        </div>
                      </motion.button>
                    );
                  })
                }
              </div>
            )}

            {/* ── STEP 2: Fecha ── */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ color: "#90a0b7", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                  ¿Cuándo quieres tu cita?
                </p>
                {getNext7Days().map(date => {
                  const d = new Date(date + "T00:00:00");
                  const sel = selectedDate === date;
                  const isToday = date === new Date().toISOString().split("T")[0];
                  return (
                    <motion.button
                      key={date}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setSelectedDate(date); setStep(3); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 16,
                        borderRadius: 18, padding: "14px 18px", cursor: "pointer",
                        background: sel ? "linear-gradient(135deg,#03045e,#0077b6)" : "#fff",
                        boxShadow: sel ? "0 6px 24px rgba(3,4,94,0.25)" : "0 2px 10px rgba(3,4,94,0.07)",
                        textAlign: "left",
                      }}
                    >
                      <div style={{
                        width: 48, height: 52, borderRadius: 14, flexShrink: 0,
                        background: sel ? "rgba(0,180,216,0.2)" : "#f0f4f8",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: sel ? "#48cae4" : "#90a0b7", letterSpacing: "0.08em" }}>
                          {d.toLocaleDateString("es-MX", { weekday: "short" })}
                        </span>
                        <span style={{ fontSize: 22, fontWeight: 900, lineHeight: 1, color: sel ? "#fff" : "#03045e" }}>
                          {d.getDate()}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 800, fontSize: 14, color: sel ? "#fff" : "#03045e", textTransform: "capitalize" }}>
                          {d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}
                        </p>
                        {isToday && (
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#48cae4" }}>Hoy</span>
                        )}
                      </div>
                      {sel && <BsCheckCircleFill style={{ color: "#48cae4", fontSize: 18, flexShrink: 0 }} />}
                    </motion.button>
                  );
                })}
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
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} style={{ height: 56, borderRadius: 16, background: "#e0e8f0" }} />
                    ))}
                  </div>
                ) : timeslots.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "48px 0" }}>
                    <p style={{ fontWeight: 900, fontSize: 16, color: "#03045e", marginBottom: 6 }}>Sin horarios disponibles</p>
                    <p style={{ color: "#90a0b7", fontSize: 13, marginBottom: 20 }}>Prueba con otra fecha o sucursal</p>
                    <motion.button whileTap={{ scale: 0.96 }} onClick={() => setStep(2)}
                      style={{
                        height: 46, paddingLeft: 24, paddingRight: 24,
                        borderRadius: 14, background: "linear-gradient(135deg,#0077b6,#00b4d8)",
                        color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer",
                        fontFamily: "inherit", border: "none",
                      }}>
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
                            background: sel
                              ? "linear-gradient(135deg,#03045e,#0077b6)"
                              : available ? "#fff" : "#f0f4f8",
                            color: sel ? "#48cae4" : available ? "#03045e" : "#c0ccd8",
                            boxShadow: sel ? "0 4px 16px rgba(3,4,94,0.3)" : available ? "0 2px 8px rgba(3,4,94,0.07)" : "none",
                            border: sel ? "1.5px solid rgba(72,202,228,0.4)" : "none",
                            cursor: available ? "pointer" : "not-allowed",
                            fontFamily: "inherit",
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

                {/* Auth gate — only here */}
                {!isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      borderRadius: 22, overflow: "hidden",
                      background: "linear-gradient(135deg,#03045e,#0077b6)",
                      boxShadow: "0 8px 32px rgba(3,4,94,0.3)",
                      position: "relative",
                    }}
                  >
                    <div style={{
                      position: "absolute", top: -20, right: -20, width: 80, height: 80,
                      borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)",
                      background: "rgba(0,180,216,0.1)", pointerEvents: "none",
                    }} />
                    <div style={{ padding: "22px 22px 22px", position: "relative", zIndex: 1 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 14, marginBottom: 14,
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <BsLockFill style={{ color: "#48cae4", fontSize: 18 }} />
                      </div>
                      <p style={{ color: "#fff", fontWeight: 900, fontSize: 18, marginBottom: 4 }}>
                        Un último paso
                      </p>
                      <p style={{ color: "rgba(144,224,239,0.75)", fontSize: 13, marginBottom: 20 }}>
                        Crea tu cuenta o inicia sesión para confirmar tu reserva. Es gratis y tarda 30 segundos.
                      </p>
                      <div style={{ display: "flex", gap: 10 }}>
                        <motion.button whileTap={{ scale: 0.96 }}
                          onClick={() => navigate("/register")}
                          style={{
                            flex: 1, height: 48, borderRadius: 14,
                            background: "linear-gradient(135deg,#00b4d8,#0096c7)",
                            color: "#fff", fontWeight: 900, fontSize: 14,
                            border: "none", cursor: "pointer", fontFamily: "inherit",
                            boxShadow: "0 4px 14px rgba(0,180,216,0.35)",
                          }}>
                          Crear cuenta
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.96 }}
                          onClick={() => navigate("/login")}
                          style={{
                            flex: 1, height: 48, borderRadius: 14,
                            background: "rgba(255,255,255,0.12)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "rgba(255,255,255,0.8)", fontWeight: 700, fontSize: 14,
                            cursor: "pointer", fontFamily: "inherit",
                          }}>
                          Iniciar sesión
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Summary card */}
                <div style={{
                  borderRadius: 22, overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(3,4,94,0.12)",
                }}>
                  <div style={{
                    padding: "18px 20px",
                    background: "linear-gradient(135deg,#03045e,#0077b6,#00b4d8)",
                    position: "relative",
                  }}>
                    <div style={{
                      position: "absolute", top: -15, right: -15, width: 60, height: 60,
                      borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)",
                      background: "rgba(255,255,255,0.06)", pointerEvents: "none",
                    }} />
                    <p style={{ color: "rgba(72,202,228,0.8)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>
                      Resumen de tu reserva
                    </p>
                    <p style={{ color: "#fff", fontWeight: 900, fontSize: 20, lineHeight: 1.1 }}>
                      {selectedService?.name}
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 2 }}>
                      {selectedLocation?.name}
                    </p>
                  </div>
                  <div style={{ background: "#fff", padding: "16px 20px 20px" }}>
                    {[
                      { label: "Precio", value: `$${Number(selectedService?.price).toLocaleString()} MXN` },
                      { label: "Duración", value: `${selectedService?.durationMinutes} minutos` },
                      { label: "Fecha", value: formatDate(selectedDate) },
                      { label: "Horario", value: `${selectedSlot?.startTime} – ${selectedSlot?.endTime}` },
                      { label: "Dirección", value: selectedLocation?.address },
                    ].map(({ label, value }, i, arr) => (
                      <div key={label} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                        padding: "10px 0",
                        borderBottom: i < arr.length - 1 ? "1px solid #f0f4f8" : "none",
                      }}>
                        <span style={{ color: "#90a0b7", fontSize: 13, fontWeight: 600 }}>{label}</span>
                        <span style={{ color: "#03045e", fontSize: 13, fontWeight: 900, textAlign: "right", maxWidth: "60%" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Notas para el lavador (opcional)"
                  style={{
                    width: "100%", height: 80, borderRadius: 16, padding: "12px 16px",
                    background: "#fff", color: "#03045e", fontSize: 13, fontWeight: 500,
                    border: "none", outline: "none", resize: "none",
                    boxShadow: "0 2px 10px rgba(3,4,94,0.07)",
                    fontFamily: "inherit", boxSizing: "border-box",
                  }}
                />

                {/* Confirm button — only if authenticated */}
                {isAuthenticated && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    disabled={createBooking.isPending}
                    onClick={handleConfirm}
                    style={{
                      width: "100%", height: 56, borderRadius: 18,
                      background: "linear-gradient(135deg,#0077b6,#00b4d8)",
                      color: "#fff", fontWeight: 900, fontSize: 16,
                      border: "none", cursor: "pointer", fontFamily: "inherit",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                      boxShadow: "0 8px 28px rgba(0,119,182,0.4)",
                      opacity: createBooking.isPending ? 0.7 : 1,
                    }}
                  >
                    {createBooking.isPending ? "Confirmando..." : (
                      <><BsCheckCircleFill style={{ fontSize: 18 }} /> Confirmar reserva</>
                    )}
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
