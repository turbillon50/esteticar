import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BsHouseDoor } from "react-icons/bs";

export default function NotFound() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-7xl font-black text-primary/20 mb-4">404</p>
        <h1 className="text-2xl font-bold text-foreground mb-2">Página no encontrada</h1>
        <p className="text-muted-foreground text-sm mb-8">La página que buscas no existe o fue movida.</p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/")}
          className="h-12 px-6 rounded-2xl bg-primary text-white font-semibold flex items-center gap-2 mx-auto"
        >
          <BsHouseDoor />
          Ir al inicio
        </motion.button>
      </motion.div>
    </div>
  );
}
