"use client";

import { MotionConfig } from "motion/react";

/**
 * Honours prefers-reduced-motion globally: transforms and layout animations
 * are disabled for those users while opacity transitions remain, and server
 * and client render identical initial styles so hydration never mismatches.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
