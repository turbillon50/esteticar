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
import { BsArrowLeft, BsArrowRight, BsCheckCircleFill, BsClock, BsGeoAlt, BsCalendar } from "react-icons/bs";

const STEPS = ["Servicio", "Sucursal", "Fecha", "Horario", "Confirmar"];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-primary" : i < current ? "w-4 bg-primary/40" : "w-4 bg-muted"}`}
        />
      ))}
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getNext7Days() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
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
      onError: (err: any) => {
        toast.error(err?.message ?? "Error al reservar");
      },
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BsCalendar className="text-primary text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Inicia sesión para reservar</h2>
          <p className="text-muted-foreground text-sm mb-6">Necesitas una cuenta para agendar tu lavado</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full h-12 rounded-2xl bg-primary text-white font-semibold"
          >
            Iniciar sesión
          </button>
        </div>
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

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-14 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => step > 0 ? setStep(step - 1) : navigate("/")}
            className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center"
          >
            <BsArrowLeft className="text-foreground" />
          </button>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Paso {step + 1} de {STEPS.length}</p>
            <h2 className="font-bold text-foreground">{STEPS[step]}</h2>
          </div>
        </div>
        <StepIndicator current={step} total={STEPS.length} />
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-full px-6 pb-6"
          >
            {/* Step 0: Select Service */}
            {step === 0 && (
              <div className="space-y-3">
                {services?.map((service) => (
                  <motion.div
                    key={service.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setSelectedService(service); setStep(1); }}
                    className={`p-4 rounded-3xl border-2 cursor-pointer transition-all ${selectedService?.id === service.id ? "border-primary bg-primary/5" : "border-card-border bg-card"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex-shrink-0 overflow-hidden">
                        {service.imageUrl ? (
                          <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-primary font-bold">✦</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground">{service.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <BsClock className="text-muted-foreground text-xs" />
                            <span className="text-xs text-muted-foreground">{service.durationMinutes} min</span>
                          </div>
                          <span className="text-sm font-bold text-primary">${Number(service.price).toLocaleString()}</span>
                        </div>
                      </div>
                      {selectedService?.id === service.id && (
                        <BsCheckCircleFill className="text-primary text-xl flex-shrink-0" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Step 1: Select Location */}
            {step === 1 && (
              <div className="space-y-3">
                {locations?.filter(l => l.isActive).map((location) => (
                  <motion.div
                    key={location.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setSelectedLocation(location); setStep(2); }}
                    className={`p-4 rounded-3xl border-2 cursor-pointer transition-all ${selectedLocation?.id === location.id ? "border-primary bg-primary/5" : "border-card-border bg-card"}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <BsGeoAlt className="text-secondary text-lg" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground">{location.name}</p>
                        <p className="text-sm text-muted-foreground">{location.address}</p>
                        <p className="text-xs text-secondary mt-1">{location.openTime} – {location.closeTime}</p>
                      </div>
                      {selectedLocation?.id === location.id && (
                        <BsCheckCircleFill className="text-primary text-xl flex-shrink-0" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Step 2: Select Date */}
            {step === 2 && (
              <div className="space-y-3">
                {getNext7Days().map((date) => {
                  const d = new Date(date + "T00:00:00");
                  const dayName = d.toLocaleDateString("es-MX", { weekday: "short" });
                  const dayNum = d.getDate();
                  const monthName = d.toLocaleDateString("es-MX", { month: "short" });
                  const isSelected = selectedDate === date;
                  return (
                    <motion.div
                      key={date}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setSelectedDate(date); setStep(3); }}
                      className={`p-4 rounded-3xl border-2 cursor-pointer flex items-center gap-4 transition-all ${isSelected ? "border-primary bg-primary/5" : "border-card-border bg-card"}`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center ${isSelected ? "bg-primary" : "bg-muted"}`}>
                        <span className={`text-xs font-semibold ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>{dayName.toUpperCase()}</span>
                        <span className={`text-lg font-bold leading-none ${isSelected ? "text-white" : "text-foreground"}`}>{dayNum}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground capitalize">{dayName}, {dayNum} de {monthName}</p>
                        {dayNum === new Date().getDate() && (
                          <span className="text-xs font-semibold text-secondary">Hoy</span>
                        )}
                      </div>
                      {isSelected && <BsCheckCircleFill className="text-primary text-xl ml-auto" />}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Step 3: Select Time Slot */}
            {step === 3 && (
              <div>
                <p className="text-sm text-muted-foreground mb-4 capitalize">{selectedDate ? formatDate(selectedDate) : ""}</p>
                {!timeslots ? (
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="h-14 rounded-2xl bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : timeslots.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No hay horarios disponibles para esta fecha.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {timeslots.map((slot) => {
                      const available = slot.isAvailable && slot.currentBookings < slot.maxBookings;
                      const isSelected = selectedSlot?.id === slot.id;
                      return (
                        <motion.button
                          key={slot.id}
                          whileTap={{ scale: available ? 0.95 : 1 }}
                          disabled={!available}
                          onClick={() => { setSelectedSlot(slot); setStep(4); }}
                          className={`h-14 rounded-2xl text-sm font-semibold transition-all ${
                            isSelected
                              ? "bg-primary text-white"
                              : available
                              ? "bg-card border-2 border-card-border text-foreground hover:border-primary"
                              : "bg-muted text-muted-foreground opacity-40 cursor-not-allowed"
                          }`}
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
                <div className="p-5 rounded-3xl bg-card border border-card-border space-y-4">
                  <h3 className="font-bold text-foreground text-lg">Resumen</h3>
                  {[
                    { label: "Servicio", value: selectedService?.name, sub: `$${Number(selectedService?.price).toLocaleString()}` },
                    { label: "Sucursal", value: selectedLocation?.name, sub: selectedLocation?.address },
                    { label: "Fecha", value: formatDate(selectedDate) },
                    { label: "Horario", value: `${selectedSlot?.startTime} – ${selectedSlot?.endTime}` },
                  ].map(({ label, value, sub }) => (
                    <div key={label} className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{value}</p>
                        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notas adicionales (opcional)"
                    className="w-full h-20 p-4 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm border-0 outline-none resize-none"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={createBooking.isPending}
                  onClick={handleConfirm}
                  className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-base disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {createBooking.isPending ? "Reservando..." : "Confirmar reserva"}
                  {!createBooking.isPending && <BsCheckCircleFill />}
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
