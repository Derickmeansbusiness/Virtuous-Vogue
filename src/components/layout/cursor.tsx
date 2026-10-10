"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/**
 * Restrained editorial cursor for fine pointers only. It never replaces
 * the native cursor on touch devices or when reduced motion is preferred.
 */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [active, setActive] = React.useState(false);
  const [enabled, setEnabled] = React.useState(false);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;
    setEnabled(true);
    document.body.dataset.cursor = "custom";
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setActive(Boolean(t?.closest("a, button, [role=button], input, label, select, textarea")));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      delete document.body.dataset.cursor;
    };
  }, [reduce, x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] -ml-2 -mt-2 size-4 rounded-full border border-mulberry mix-blend-multiply"
      style={{ x: sx, y: sy }}
      animate={{ scale: active ? 2.4 : 1, backgroundColor: active ? "rgba(103,47,64,0.12)" : "rgba(103,47,64,0)" }}
      transition={{ duration: 0.25 }}
    />
  );
}
