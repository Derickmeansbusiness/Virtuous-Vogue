import { cn } from "@/lib/utils/cn";

export function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="border border-line bg-ivory p-5">
      <p className="eyebrow text-ink-muted">{label}</p>
      <p className="display-md mt-2">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
}

export function Table({ head, children, className }: { head: string[]; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto border border-line bg-ivory", className)}>
      <table className="w-full text-sm">
        <thead><tr className="border-b border-line text-left">{head.map((h) => <th key={h} className="eyebrow px-4 py-3 font-semibold text-ink-muted">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 align-top", className)}>{children}</td>;
}

export function Badge({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "success" | "warning" | "danger" | "mulberry" }) {
  const tones = { muted: "border-line text-ink-muted", success: "border-success/40 text-success", warning: "border-warning/40 text-warning", danger: "border-danger/40 text-danger", mulberry: "border-mulberry/40 text-mulberry" };
  return <span className={cn("inline-block border px-2 py-0.5 text-[0.625rem] uppercase tracking-[0.14em]", tones[tone])}>{children}</span>;
}

export function PageHeader({ title, body, action }: { title: string; body?: string; action?: React.ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
      <div><h1 className="display-md">{title}</h1>{body ? <p className="mt-1 text-sm text-ink-soft">{body}</p> : null}</div>
      {action}
    </header>
  );
}
