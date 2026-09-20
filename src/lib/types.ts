export type Role = "cliente" | "proveedor" | "admin";

export type PaymentMethod = "tarjeta" | "transferencia" | "oxxo";

export type BookingStatus =
  | "pendiente"
  | "confirmada"
  | "completada"
  | "cancelada";

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  image: string;
  features: string[];
};

export type Location = {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  openTime: string;
  closeTime: string;
  lat: number;
  lng: number;
  rating: number;
  active: boolean;
};

export type Booking = {
  id: string;
  folio: string;
  serviceId: string;
  locationId: string;
  date: string;
  time: string;
  payment: PaymentMethod;
  status: BookingStatus;
  customerName: string;
  createdAt: string;
  notes?: string;
  staffId?: string;
};

export type StaffRole = "supervisor" | "lavador" | "caja";
export type StaffStatus = "en_turno" | "libre" | "descanso";

export type Staff = {
  id: string;
  name: string;
  role: StaffRole;
  locationId: string;
  status: StaffStatus;
  phone: string;
};

export function isOpenLocation(loc: Location) {
  return loc.active !== false;
}
