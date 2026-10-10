"use client";

import { setSubscriberStatus } from "@/lib/actions/admin";

export function SubscriberToggle({ id, status }: { id: string; status: string }) {
  const next = status === "subscribed" ? "unsubscribed" : "subscribed";
  return <button type="button" onClick={() => setSubscriberStatus(id, next)} className="text-xs uppercase tracking-[0.14em] text-mulberry">{next === "unsubscribed" ? "Unsubscribe" : "Resubscribe"}</button>;
}
