import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Eyebrow({
  className,
  children,
  as: Tag = "p",
  tone = "mulberry",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "p" | "span" | "div" | "h2" | "h3";
  tone?: "mulberry" | "ink" | "muted" | "ivory" | "satin";
}) {
  const tones = {
    mulberry: "text-mulberry",
    ink: "text-ink",
    muted: "text-ink-muted",
    ivory: "text-ivory/80",
    satin: "text-satin",
  };
  return <Tag className={cn("eyebrow", tones[tone], className)}>{children}</Tag>;
}

export function Issue({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("font-display text-sm tracking-[0.18em] text-ink-muted", className)}>
      {children}
    </span>
  );
}

export function Lede({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={cn("font-serif text-lg leading-relaxed text-ink-soft md:text-xl", className)}>
      {children}
    </p>
  );
}

export function Rule({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-line", className)} />;
}
