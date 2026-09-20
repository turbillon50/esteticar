"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, MapPin } from "lucide-react";
import { useEsteticar } from "@/lib/store";

function Inner() {
  const params = useSearchParams();
  const folio = params.get("folio");
  const bookings = useEsteticar((s) => s.bookings);
  const services = useEsteticar((s) => s.services);
  const locations = useEsteticar((s) => s.locations);
  const booking = bookings.find((b) => b.folio === folio) ?? bookings[0];
  const service = services.find((s) => s.id === booking?.serviceId);
  const location = locations.find((l) => l.id === booking?.locationId);

  if (!booking) {
    return (
      <div className="p-8 text-center">
        <p className="font-bold">No hay folio todavía.</p>
        <Link href="/agenda" className="mt-4 inline-block font-extrabold text-[var(--accent)]">
          Agendar
        </Link>
      </div>
    );
  }

  return (
    <div className="hero-light flex min-h-full flex-col px-5 pb-10 pt-16 text-white">
      <div className="mx-auto w-full max-w-md">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-[#48cae4]/20">
          <CheckCircle2 size={40} className="text-[#48cae4]" />
        </div>
        <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#48cae4]">
          Cita reservada
        </p>
        <h1 className="display mt-2 text-center text-[48px] leading-none">Listo.</h1>
        <p className="mt-3 text-center text-sm text-white/70">
          Pago por adelantado registrado. Muestra este folio en sucursal.
        </p>

        <div
          className="mt-8 rounded-[26px] border border-white/15 bg-white/10 p-5 backdrop-blur"
          data-testid="folio-card"
        >
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#48cae4]">Folio</p>
          <p className="mt-1 text-[34px] font-extrabold tracking-wide" data-testid="folio">
            {booking.folio}
          </p>
          <div className="mt-4 space-y-2 text-sm font-semibold text-white/85">
            <p>{service?.name}</p>
            <p className="flex items-center gap-2">
              <Clock size={14} /> {booking.date} · {booking.time}
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={14} /> {location?.name}
            </p>
            <p className="capitalize">Pago: {booking.payment}</p>
            <p className="text-2xl font-extrabold text-[#48cae4]">
              ${service?.price.toLocaleString("es-MX")}
            </p>
          </div>
        </div>

        <Link
          href="/citas"
          className="mt-8 flex h-14 items-center justify-center rounded-[18px] bg-white text-[15px] font-extrabold text-[var(--navy)]"
        >
          Ver mis citas
        </Link>
        <Link href="/" className="mt-3 flex h-12 items-center justify-center text-sm font-bold text-white/70">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold">Cargando folio…</div>}>
      <Inner />
    </Suspense>
  );
}
