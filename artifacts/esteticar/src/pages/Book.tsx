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
import { BsArrowLeft, BsCheckCircleFill, BsClock, BsGeoAlt, BsCalendar3 } from "react-icons/bs";

const STEPS = ["Servicio", "Sucursal", "Fecha", "Horario", "Confirmar"];

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

const slideVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

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
        toast.success("Cita reservada");
      },
      onError: (err: any) => toast.error(err?.message ?? "Error al reservar"),
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "#f5f6f8" }}>
        <div
          className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "linear-gradient(135deg, #0A1628, #0d2240)" }}
        >
          <BsCalendar3 className="text-white text-2xl" />
        </div>
        <h2 className="text-xl font-black mb-2 text-center" style={{ color: "#0A1628" }}>Inicia sesión para reservar</h2>
        <p className="text-sm text-center mb-6" style={{ color: "#9ca3af" }}>Necesitas una cuenta para agendar tu lavado</p>
        <button
          onClick={() => navigate("/login")}
          className="w-full h-12 rounded-2xl font-black text-white"
          style={{ background: "linear-gradient(135deg, #0A1628, #0d2240)" }}
        >
          Iniciar sesión
        </button>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f5f6f8" }}>

      {/* Header */}
      <div
        className="relative overflow-hidden px-5 pt-14 pb-6"
        style={{ background: "linear-gradient(150deg, #0A1628 0%, #0d2240 80%)" }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #00B4D8, transparent 70%)", transform: "translate(30%, -30%)" }} />

        <div className="flex items-center gap-3 mb-5 relative z-10">
          <button
            onClick={() => step > 0 ? setStep(step - 1) : navigate("/")}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <BsArrowLeft className="text-white" />
          </button>
          <div>
            <p className="text-white/50 text-xs font-medium">Paso {step + 1} de {STEPS.length}</p>
            <p className="text-white font-black text-lg">{STEPS[step]}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="h-1 rounded-full relative z-10 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #00B4D8, #0094b3)" }}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="px-4 py-5"
          >

            {/* Step 0: Service */}
            {step === 0 && (
              <div className="space-y-3">
                {services?.map(service => {
                  const sel = selectedService?.id === service.id;
                  return (
                    <motion.button
                      key={service.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setSelectedService(service); setStep(1); }}
                      className="w-full flex items-center gap-4 p-4 rounded-3xl text-left"
                      style={{
                        background: "#ffffff",
                        border: sel ? "2px solid #00B4D8" : "2px solid transparent",
                        boxShadow: "0 2px 12px rgba(10,22,40,0.07)",
                      }}
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                        style={{ background: sel ? "rgba(0,180,216,0.1)" : "#f5f6f8" }}
                      >
                        {service.imageUrl
                          ? <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                          : <span className="text-2xl font-black" style={{ color: "#00B4D8", opacity: 0.5 }}>✦</span>
                        }
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-sm" style={{ color: "#0A1628" }}>{service.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <BsClock className="text-[10px]" style={{ color: "#9ca3af" }} />
                            <span className="text-xs font-medium" style={{ color: "#9ca3af" }}>{service.durationMinutes} min</span>
                          </div>
                          <span className="text-sm font-black" style={{ color: "#00B4D8" }}>${Number(service.price).toLocaleString()}</span>
                        </div>
                      </div>
                      {sel && <BsCheckCircleFill className="text-xl flex-shrink-0" style={{ color: "#00B4D8" }} />}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Step 1: Location */}
            {step === 1 && (
              <div className="space-y-3">
                {locations?.filter(l => l.isActive).map(loc => {
                  const sel = selectedLocation?.id === loc.id;
                  return (
                    <motion.button
                      key={loc.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setSelectedLocation(loc); setStep(2); }}
                      className="w-full flex items-start gap-4 p-4 rounded-3xl text-left"
                      style={{
                        background: "#ffffff",
                        border: sel ? "2px solid #00B4D8" : "2px solid transparent",
                        boxShadow: "0 2px 12px rgba(10,22,40,0.07)",
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: sel ? "rgba(0,180,216,0.15)" : "#f5f6f8" }}
                      >
                        <BsGeoAlt className="text-xl" style={{ color: sel ? "#00B4D8" : "#9ca3af" }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-sm" style={{ color: "#0A1628" }}>{loc.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{loc.address}</p>
                        <p className="text-xs font-semibold mt-1" style={{ color: "#00B4D8" }}>{loc.openTime} – {loc.closeTime}</p>
                      </div>
                      {sel && <BsCheckCircleFill className="text-xl flex-shrink-0" style={{ color: "#00B4D8" }} />}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Step 2: Date */}
            {step === 2 && (
              <div className="space-y-3">
                {getNext7Days().map(date => {
                  const d = new Date(date + "T00:00:00");
                  const sel = selectedDate === date;
                  const isToday = date === new Date().toISOString().split("T")[0];
                  return (
                    <motion.button
                      key={date}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setSelectedDate(date); setStep(3); }}
                      className="w-full flex items-center gap-4 p-4 rounded-3xl text-left"
                      style={{
                        background: sel ? "#0A1628" : "#ffffff",
                        boxShadow: "0 2px 12px rgba(10,22,40,0.07)",
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
                        style={{ background: sel ? "rgba(0,180,216,0.2)" : "#f5f6f8" }}
                      >
                        <span className="text-[10px] font-bold uppercase" style={{ color: sel ? "#00B4D8" : "#9ca3af" }}>
                          {d.toLocaleDateString("es-MX", { weekday: "short" })}
                        </span>
                        <span className="text-lg font-black leading-none" style={{ color: sel ? "#ffffff" : "#0A1628" }}>
                          {d.getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="font-black text-sm capitalize" style={{ color: sel ? "#ffffff" : "#0A1628" }}>
                          {d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "short" })}
                        </p>
                        {isToday && (
                          <span className="text-xs font-bold" style={{ color: "#00B4D8" }}>Hoy</span>
                        )}
                      </div>
                      {sel && <BsCheckCircleFill className="text-xl ml-auto flex-shrink-0" style={{ color: "#00B4D8" }} />}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Step 3: Timeslot */}
            {step === 3 && (
              <div>
                <p className="text-sm font-semibold mb-4 capitalize" style={{ color: "#6b7280" }}>
                  {selectedDate ? formatDate(selectedDate) : ""}
                </p>
                {!timeslots ? (
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="h-14 rounded-2xl bg-white animate-pulse" />
                    ))}
                  </div>
                ) : timeslots.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="font-black mb-1" style={{ color: "#0A1628" }}>Sin horarios</p>
                    <p className="text-sm" style={{ color: "#9ca3af" }}>Prueba otra fecha</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {timeslots.map(slot => {
                      const available = slot.isAvailable && slot.currentBookings < slot.maxBookings;
                      const sel = selectedSlot?.id === slot.id;
                      return (
                        <motion.button
                          key={slot.id}
                          whileTap={{ scale: available ? 0.93 : 1 }}
                          disabled={!available}
                          onClick={() => { setSelectedSlot(slot); setStep(4); }}
                          className="h-14 rounded-2xl text-sm font-black"
                          style={{
                            background: sel ? "#0A1628" : available ? "#ffffff" : "#f5f6f8",
                            color: sel ? "#00B4D8" : available ? "#0A1628" : "#d1d5db",
                            boxShadow: sel ? "none" : available ? "0 2px 8px rgba(10,22,40,0.07)" : "none",
                            border: sel ? "2px solid #00B4D8" : available ? "2px solid transparent" : "none",
                            cursor: available ? "pointer" : "not-allowed",
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

            {/* Step 4: Confirm */}
            {step === 4 && (
              <div className="space-y-4">
                <div
                  className="rounded-3xl overflow-hidden"
                  style={{ background: "#ffffff", boxShadow: "0 2px 12px rgba(10,22,40,0.08)" }}
                >
                  {/* Summary header */}
                  <div
                    className="px-5 py-4"
                    style={{ background: "linear-gradient(135deg, #0A1628 0%, #0d2240 100%)" }}
                  >
                    <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#00B4D8" }}>Resumen</p>
                    <p className="font-black text-lg text-white">{selectedService?.name}</p>
                    <p className="text-white/50 text-sm">{selectedLocation?.name}</p>
                  </div>

                  <div className="px-5 py-4 space-y-3">
                    {[
                      { label: "Precio", value: `$${Number(selectedService?.price).toLocaleString()} MXN` },
                      { label: "Duración", value: `${selectedService?.durationMinutes} minutos` },
                      { label: "Fecha", value: formatDate(selectedDate) },
                      { label: "Horario", value: `${selectedSlot?.startTime} – ${selectedSlot?.endTime}` },
                      { label: "Dirección", value: selectedLocation?.address },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-start">
                        <span className="text-sm font-semibold" style={{ color: "#9ca3af" }}>{label}</span>
                        <span className="text-sm font-black text-right ml-4" style={{ color: "#0A1628" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notas adicionales (opcional)"
                  className="w-full h-20 p-4 rounded-2xl text-sm font-medium outline-none resize-none"
                  style={{ background: "#ffffff", color: "#0A1628" }}
                />

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={createBooking.isPending}
                  onClick={handleConfirm}
                  className="w-full h-14 rounded-3xl font-black text-white flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #00B4D8 0%, #0094b3 100%)", fontSize: 16 }}
                >
                  {createBooking.isPending ? "Reservando..." : (
                    <><BsCheckCircleFill className="text-lg" /> Confirmar reserva</>
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
