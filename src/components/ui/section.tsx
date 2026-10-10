import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Section({
  className,
  children,
  id,
  tone = "ivory",
  as: Tag = "section",
  padded = true,
  ...rest
}: React.HTMLAttributes<HTMLElement> & {
  tone?: "ivory" | "porcelain" | "ink" | "mulberry" | "satin" | "transparent";
  as?: "section" | "div" | "article" | "header" | "footer";
  padded?: boolean;
}) {
  const tones = {
    ivory: "bg-ivory text-ink",
    porcelain: "bg-porcelain text-ink",
    ink: "bg-ink text-ivory",
    mulberry: "bg-mulberry text-porcelain",
    satin: "bg-satin-tint text-ink",
    transparent: "",
  };
  return (
    <Tag
      id={id}
      className={cn(tones[tone], padded && "py-20 md:py-28 lg:py-36", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Container({
  className,
  children,
  narrow,
}: {
  className?: string;
  children: React.ReactNode;
  narrow?: boolean;
}) {
  return (
    <div className={cn("container-vv", narrow && "max-w-4xl", className)}>{children}</div>
  );
}
