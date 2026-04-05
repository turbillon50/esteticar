import { useState } from "react";
import { useListProviders, getListProvidersQueryKey, useCreateProvider, useListLocations, useAssignProviderToLocation } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { BsPlus, BsPerson, BsGeoAlt, BsXLg } from "react-icons/bs";

function ProviderForm({ locations, onClose, onSave }: { locations: any[]; onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", locationId: "" });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-[430px] bg-background rounded-t-3xl p-6 pb-10 overflow-y-auto max-h-[90vh]"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-foreground">Nuevo proveedor</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
            <BsXLg className="text-sm" />
          </button>
        </div>
        <div className="space-y-3">
          {[
            { key: "name", label: "Nombre completo", type: "text" },
            { key: "email", label: "Correo electrónico", type: "email" },
            { key: "password", label: "Contraseña", type: "password" },
            { key: "phone", label: "Teléfono (opcional)", type: "tel" },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={e => update(key, e.target.value)}
                required={!["phone"].includes(key)}
                className="w-full h-12 px-4 rounded-2xl bg-muted text-foreground text-sm border-0 outline-none"
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Sucursal (opcional)</label>
            <select
              value={form.locationId}
              onChange={e => update("locationId", e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-muted text-foreground text-sm border-0 outline-none"
            >
              <option value="">Sin asignar</option>
              {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onSave({ ...form, locationId: form.locationId ? Number(form.locationId) : undefined })}
            className="w-full h-12 rounded-2xl bg-primary text-white font-semibold mt-2"
          >
            Crear proveedor
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminProviders() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const { data: providers, isLoading } = useListProviders({
    query: { queryKey: getListProvidersQueryKey() },
  });
  const { data: locations } = useListLocations();

  const createProvider = useCreateProvider({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProvidersQueryKey() });
        setShowForm(false);
        toast.success("Proveedor creado");
      },
      onError: (err: any) => toast.error(err?.message ?? "Error"),
    },
  });

  const locationMap = new Map(locations?.map(l => [l.id, l.name]) ?? []);

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-14 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Proveedores</h1>
          <p className="text-sm text-muted-foreground">{providers?.length ?? 0} registrados</p>
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
          <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-20 rounded-3xl bg-muted animate-pulse" />)}</div>
        ) : (
          providers?.map((provider) => (
            <motion.div key={provider.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-3xl bg-card border border-card-border">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary">{provider.name?.[0]?.toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-foreground">{provider.name}</p>
                  <p className="text-xs text-muted-foreground">{provider.email}</p>
                  {provider.locationId && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <BsGeoAlt className="text-secondary text-xs" />
                      <span className="text-xs text-secondary">{locationMap.get(provider.locationId) ?? "Sucursal"}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <ProviderForm
            locations={locations ?? []}
            onClose={() => setShowForm(false)}
            onSave={(data) => createProvider.mutate({ data })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
