import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = "ESTETICAR".split("");

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  const [progress, setProgress] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    // Phase 0 → 1: logo in
    const t0 = setTimeout(() => setPhase(1), 300);
    // Phase 1 → 2: text in
    const t1 = setTimeout(() => setPhase(2), 900);
    // Phase 2 → 3: tagline + progress
    const t2 = setTimeout(() => setPhase(3), 1500);
    // Fill progress bar
    const t3 = setTimeout(() => setProgress(100), 1600);
    // Exit
    const t4 = setTimeout(() => setExit(true), 2600);
    const t5 = setTimeout(() => onDone(), 3100);
    return () => [t0, t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!exit ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          style={{
            position: "fixed", inset: 0, zIndex: 99999,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Cinematic gradient background */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(165deg, #020b1a 0%, #03045e 35%, #0077b6 70%, #00b4d8 100%)",
          }} />

          {/* Animated orbs */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", top: "10%", right: "-10%",
              width: 280, height: 280, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(72,202,228,0.35) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            style={{
              position: "absolute", bottom: "15%", left: "-8%",
              width: 220, height: 220, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,119,182,0.4) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Water ripple rings */}
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0.3, opacity: 0.6 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 2.5, delay: i * 0.7, repeat: Infinity, ease: "easeOut" }}
              style={{
                position: "absolute",
                width: 100, height: 100,
                borderRadius: "50%",
                border: "1px solid rgba(72,202,228,0.4)",
                pointerEvents: "none",
              }}
            />
          ))}

          {/* Main content */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>

            {/* Logo icon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={phase >= 0 ? { scale: 1, opacity: 1 } : {}}
              transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.15 }}
              style={{
                width: 88, height: 88, borderRadius: 28,
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                border: "1.5px solid rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 28,
                boxShadow: "0 0 0 12px rgba(72,202,228,0.06), 0 20px 60px rgba(0,0,0,0.4)",
                position: "relative",
              }}
            >
              {/* Inner glow */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 28,
                background: "linear-gradient(135deg, rgba(72,202,228,0.2) 0%, transparent 60%)",
              }} />
              {/* Water drop SVG */}
              <svg width="44" height="54" viewBox="0 0 44 54" fill="none">
                <path d="M22 2C22 2 4 20 4 32C4 42.49 12.06 51 22 51C31.94 51 40 42.49 40 32C40 20 22 2 22 2Z"
                  fill="url(#splashGrad)" />
                <path d="M22 2C22 2 4 20 4 32C4 37 8 44 16 47C10 40 12 28 22 2Z"
                  fill="rgba(144,224,239,0.5)" />
                <defs>
                  <linearGradient id="splashGrad" x1="0" y1="0" x2="0.3" y2="1">
                    <stop offset="0%" stopColor="rgba(144,224,239,0.9)" />
                    <stop offset="50%" stopColor="rgba(0,180,216,0.95)" />
                    <stop offset="100%" stopColor="rgba(0,119,182,0.8)" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Wordmark — letter by letter */}
            <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.08 * i, ease: "easeOut" }}
                  style={{
                    fontSize: 34, fontWeight: 900, color: "#fff",
                    letterSpacing: "0.18em",
                    textShadow: "0 2px 20px rgba(72,202,228,0.4)",
                    fontFamily: "inherit",
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                color: "rgba(144,224,239,0.75)",
                fontSize: 13, fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                textAlign: "center",
                marginBottom: 52,
              }}
            >
              Lavado premium · Morelos
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={phase >= 3 ? { opacity: 1 } : {}}
              transition={{ duration: 0.3 }}
              style={{ width: 160 }}
            >
              <div style={{ height: 2, borderRadius: 2, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  style={{
                    height: "100%", borderRadius: 2,
                    background: "linear-gradient(90deg, #48cae4, #00b4d8, #0077b6)",
                    boxShadow: "0 0 8px rgba(72,202,228,0.8)",
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Bottom tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              position: "absolute", bottom: 52,
              color: "rgba(255,255,255,0.25)",
              fontSize: 10, letterSpacing: "0.2em",
              textTransform: "uppercase", fontWeight: 600,
            }}
          >
            Powered by Esteticar Platform
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
