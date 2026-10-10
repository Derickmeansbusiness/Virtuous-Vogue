"use client";

import { motion, useReducedMotion } from "motion/react";

export function BlendBars({ items }: { items: { key: string; name: string; value: number }[] }) {
  const reduce = useReducedMotion();
  return (
    <ul className="mt-4 space-y-3">
      {items.map((it, i) => (
        <li key={it.key} className="grid grid-cols-[1fr_auto] items-center gap-4 text-sm">
          <div>
            <div className="flex items-baseline justify-between">
              <span className={i === 0 ? "font-semibold text-ink" : "text-ink-soft"}>{it.name}</span>
            </div>
            <div className="mt-1.5 h-1 w-full bg-line">
              <motion.div
                className={i === 0 ? "h-1 bg-mulberry" : "h-1 bg-satin-deep"}
                initial={reduce ? false : { width: 0 }}
                whileInView={{ width: `${Math.round(it.value * 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
              />
            </div>
          </div>
          <span className="w-10 text-right font-display text-sm tabular-nums text-ink-muted">{Math.round(it.value * 100)}%</span>
        </li>
      ))}
    </ul>
  );
}
