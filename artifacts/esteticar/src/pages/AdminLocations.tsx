import { useState } from "react";
import { useListLocations, getListLocationsQueryKey, useCreateLocation, useDeleteLocation } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { BsPlus, BsTrash, BsGeoAlt, BsXLg } from "react-icons/bs";

function LocationForm({ onClose, onSave }: { onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({ name: "", address: "", city: "", phone: "", openTime: "08:00", closeTime: "20:00" });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-[430px] bg-background rounded-t-3xl p-6 pb-10"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-foreground">Nueva sucursal</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
            <BsXLg className="text-sm" />
          </button>
        </div>
        <div className="space-y-3">
          {[
            { key: "name", label: "Nombre", type: "text" },
            { key: "address", label: "Dirección", type: "text" },
            { key: "city", label: "Ciudad", type: "text" },
            { key: "phone", label: "Teléfono", type: "tel" },
            { key: "openTime", label: "Abre", type: "time" },
            { key: "closeTime", label: "Cierra", type: "time" },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={e => update(key, e.target.value)}
                required={key !== "phone"}
                className="w-full h-12 px-4 rounded-2xl bg-muted text-foreground text-sm border-0 outline-none"
              />
            </div>
          ))}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onSave(form)}
            className="w-full h-12 rounded-2xl bg-primary text-white font-semibold mt-2"
          >
            Crear sucursal
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLocations() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const { data: locations, isLoading } = useListLocations({
    query: { queryKey: getListLocationsQueryKey() },
  });

  const createLocation = useCreateLocation({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListLocationsQueryKey() });
        setShowForm(false);
        toast.success("Sucursal creada");
      },
    },
  });

  const deleteLocation = useDeleteLocation({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListLocationsQueryKey() });
        toast.success("Sucursal eliminada");
      },
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-14 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sucursales</h1>
          <p className="text-sm text-muted-foreground">{locations?.length ?? 0} registradas</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center"
        >
          <BsPlus className="text-2xl" />
        </motion.button>
      </div>

      <div className="px-6 pb-8 space-y-3">
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-24 rounded-3xl bg-muted animate-pulse" />)}</div>
        ) : (
          locations?.map((loc) => (
            <motion.div key={loc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-3xl bg-card border border-card-border">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <BsGeoAlt className="text-secondary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{loc.name}</p>
                    <p className="text-xs text-muted-foreground">{loc.address}, {loc.city}</p>
                    <p className="text-xs text-secondary mt-0.5">{loc.openTime} – {loc.closeTime}</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteLocation.mutate({ id: loc.id })}
                  className="w-9 h-9 rounded-xl bg-red-50 text-red-400 flex items-center justify-center"
                >
                  <BsTrash className="text-sm" />
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <LocationForm
            onClose={() => setShowForm(false)}
            onSave={(data) => createLocation.mutate({ data: { ...data, isActive: true } })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
