import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "secondary" | "ghost" | "ink" | "link" | "ivory" | "glass";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-[0.12em] uppercase transition-[background-color,color,border-color,transform] duration-300 ease-[var(--ease-editorial)] disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-mulberry text-porcelain border border-mulberry hover:bg-mulberry-deep hover:border-mulberry-deep",
  secondary:
    "bg-transparent text-ink border border-ink/70 hover:bg-ink hover:text-ivory",
  ivory:
    "bg-ivory text-ink border border-ivory hover:bg-porcelain",
  ghost:
    "bg-transparent text-ink border border-transparent hover:border-line-strong",
  ink: "bg-ink text-ivory border border-ink hover:bg-ink-soft",
  glass: "glass-glitter text-ivory",
  link: "bg-transparent text-mulberry border-b border-mulberry/50 hover:border-mulberry px-0 py-0 rounded-none normal-case tracking-normal font-medium",
};

const sizes: Record<Size, string> = {
  sm: "text-[0.6875rem] px-4 py-2.5",
  md: "text-xs px-6 py-3.5",
  lg: "text-xs px-8 py-4.5",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  external?: boolean;
  loading?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  external,
  loading,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], variant !== "link" && sizes[size], className);
  if (href) {
    if (external) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer" onClick={props.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}>
          {children}
        </a>
      );
    }
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Link href={href as any} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} aria-busy={loading || undefined} {...props}>
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-3.5 animate-spin rounded-full border-[1.5px] border-current border-t-transparent",
        className,
      )}
    />
  );
}
