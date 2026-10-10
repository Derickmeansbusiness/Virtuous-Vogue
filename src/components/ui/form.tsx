"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

const control =
  "w-full bg-transparent border-0 border-b border-line-strong px-0 py-3 text-base text-ink placeholder:text-ink-muted/70 focus:border-mulberry focus:outline-none transition-colors duration-300 rounded-none";

export function Field({
  label,
  hint,
  error,
  children,
  className,
  htmlFor,
  required,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="eyebrow text-ink-muted">
        {label}
        {required ? <span aria-hidden className="ml-1 text-mulberry">*</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-ink-muted">{hint}</p> : null}
      {error ? (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(control, className)} {...props} />;
  },
);

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn(control, "min-h-28 resize-y", className)} {...props} />;
});

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn(control, "appearance-none pr-6", className)} {...props}>
        {children}
      </select>
    );
  },
);

export function Checkbox({
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: React.ReactNode }) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3 text-sm text-ink-soft", className)}>
      <input
        type="checkbox"
        className="mt-1 size-4 shrink-0 appearance-none border border-line-strong bg-transparent checked:bg-mulberry checked:border-mulberry focus-visible:outline-2 focus-visible:outline-mulberry"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}

export function ChoiceChip({
  selected,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "border px-4 py-2.5 text-sm transition-colors duration-300",
        selected
          ? "border-mulberry bg-mulberry text-porcelain"
          : "border-line-strong bg-transparent text-ink hover:border-ink",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Notice({
  tone = "info",
  children,
  className,
}: {
  tone?: "info" | "success" | "error" | "warning";
  children: React.ReactNode;
  className?: string;
}) {
  const tones = {
    info: "border-line bg-porcelain text-ink-soft",
    success: "border-success/30 bg-success/5 text-success",
    error: "border-danger/30 bg-danger/5 text-danger",
    warning: "border-warning/30 bg-warning/5 text-warning",
  };
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("border px-4 py-3 text-sm", tones[tone], className)}>
      {children}
    </div>
  );
}
