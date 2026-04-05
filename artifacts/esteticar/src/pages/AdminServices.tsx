import { useState } from "react";
import { useListServices, getListServicesQueryKey, useCreateService, useDeleteService } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { BsPlus, BsTrash, BsClock, BsXLg } from "react-icons/bs";

function ServiceForm({ onClose, onSave }: { onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({ name: "", description: "", price: "", durationMinutes: "30", imageUrl: "" });
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
          <h3 className="font-bold text-lg text-foreground">Nuevo servicio</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
            <BsXLg className="text-sm" />
          </button>
        </div>
        <div className="space-y-3">
          {[
            { key: "name", label: "Nombre", type: "text" },
            { key: "description", label: "Descripción", type: "text" },
            { key: "price", label: "Precio (MXN)", type: "number" },
            { key: "durationMinutes", label: "Duración (minutos)", type: "number" },
            { key: "imageUrl", label: "URL de imagen (opcional)", type: "url" },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={e => update(key, e.target.value)}
                required={!["imageUrl"].includes(key)}
                className="w-full h-12 px-4 rounded-2xl bg-muted text-foreground text-sm border-0 outline-none"
              />
            </div>
          ))}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onSave({ ...form, price: Number(form.price), durationMinutes: Number(form.durationMinutes) })}
            className="w-full h-12 rounded-2xl bg-primary text-white font-semibold mt-2"
          >
            Crear servicio
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminServices() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const { data: services, isLoading } = useListServices({
    query: { queryKey: getListServicesQueryKey() },
  });

  const createService = useCreateService({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
        setShowForm(false);
        toast.success("Servicio creado");
      },
    },
  });

  const deleteService = useDeleteService({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
        toast.success("Servicio eliminado");
      },
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-14 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Servicios</h1>
          <p className="text-sm text-muted-foreground">{services?.length ?? 0} disponibles</p>
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
          services?.map((service) => (
            <motion.div key={service.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-3xl bg-card border border-card-border">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex-shrink-0 overflow-hidden">
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
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{service.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm font-bold text-primary">${Number(service.price).toLocaleString()}</span>
                      <div className="flex items-center gap-1">
                        <BsClock className="text-muted-foreground text-xs" />
                        <span className="text-xs text-muted-foreground">{service.durationMinutes} min</span>
                      </div>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteService.mutate({ id: service.id })}
                  className="w-9 h-9 rounded-xl bg-red-50 text-red-400 flex items-center justify-center ml-2 flex-shrink-0"
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
          <ServiceForm
            onClose={() => setShowForm(false)}
            onSave={(data) => createService.mutate({ data: { ...data, isActive: true } })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
