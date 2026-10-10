"use client";

import { motion, useScroll, useReducedMotion } from "motion/react";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  if (reduce) return null;
  return <motion.div aria-hidden className="fixed left-0 top-[var(--vv-header-h)] z-40 h-px w-full origin-left bg-mulberry" style={{ scaleX: scrollYProgress }} />;
}
