"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils/cn";

export function PaletteStrip({ colours, className, labels }: { colours: string[]; className?: string; labels?: string[] }) {
  const reduce = useReducedMotion();
  return (
    <ul className={cn("flex gap-2", className)} aria-label="Palette">
      {colours.map((c, i) => (
        <motion.li
          key={c + i}
          className="group relative h-14 flex-1 overflow-hidden border border-ink/10"
          style={{ backgroundColor: c }}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, duration: 0.6 }}
          whileHover={reduce ? undefined : { scaleY: 1.12 }}
          title={labels?.[i] ?? c}
        >
          <span className="sr-only">{labels?.[i] ?? c}</span>
        </motion.li>
      ))}
    </ul>
  );
}
