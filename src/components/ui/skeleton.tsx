import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("skeleton", className)} />;
}

export function EmptyState({
  title,
  body,
  action,
  className,
}: {
  title: string;
  body?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border border-dashed border-line-strong px-6 py-14 text-center", className)}>
      <p className="display-sm">{title}</p>
      {body ? <p className="mx-auto mt-3 max-w-md text-sm text-ink-muted">{body}</p> : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
