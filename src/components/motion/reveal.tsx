"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils/cn";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  as?: "div" | "section" | "article" | "li" | "figure" | "header";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </Comp>
  );
}

export function Stagger({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : stagger } },
  };
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

/** Line-by-line editorial text reveal using a clip mask. */
export function TextReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  as: Tag = "h1",
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const reduce = useReducedMotion();
  return (
    <Tag className={cn(className)}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={cn("block will-change-transform", lineClassName)}
            initial={reduce ? false : { y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, ease, delay: delay + i * 0.12 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Masked image reveal: the image slides into view behind an ivory mask. */
export function MaskReveal({
  children,
  className,
  direction = "up",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const clip = {
    up: { from: "inset(100% 0 0 0)", to: "inset(0 0 0 0)" },
    left: { from: "inset(0 100% 0 0)", to: "inset(0 0 0 0)" },
    right: { from: "inset(0 0 0 100%)", to: "inset(0 0 0 0)" },
  }[direction];
  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      initial={reduce ? false : { clipPath: clip.from }}
      whileInView={{ clipPath: clip.to }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1.3, ease, delay }}
    >
      <motion.div
        className="h-full w-full"
        initial={reduce ? false : { scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 1.6, ease, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
