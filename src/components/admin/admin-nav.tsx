"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

const items = [
  ["/admin", "Dashboard"],
  ["/admin/appointments", "Appointments"],
  ["/admin/clients", "Clients"],
  ["/admin/lookbooks", "Lookbooks"],
  ["/admin/services", "Services"],
  ["/admin/availability", "Availability"],
  ["/admin/payments", "Payments"],
  ["/admin/magazine", "Magazine"],
  ["/admin/newsletter", "Newsletter"],
  ["/admin/leads", "Leads"],
  ["/admin/testimonials", "Testimonials"],
  ["/admin/analytics", "Analytics"],
] as const;

export function AdminNav({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Cockpit" className={cn("flex gap-4 overflow-x-auto scrollbar-none lg:flex-col lg:gap-0 lg:border-t lg:border-line", className)}>
      {items.map(([href, label]) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined} className={cn("shrink-0 py-2.5 text-sm lg:border-b lg:border-line", active ? "text-mulberry" : "text-ink-soft hover:text-ink")}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
