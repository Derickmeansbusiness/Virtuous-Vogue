"use client";

import { useActionState } from "react";
import { saveService, type AdminFormState } from "@/lib/actions/admin";
import type { Service } from "@/content/types";
import { Field, Input, Checkbox, Notice, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const initial: AdminFormState = { status: "idle" };

export function ServiceForm({ service, row }: { service: Service; row?: { active: boolean; cal_event_type_id?: string | null; location_note?: string | null } }) {
  const [state, action, pending] = useActionState(saveService, initial);
  return (
    <form action={action} className="border border-line bg-ivory p-5">
      <input type="hidden" name="slug" value={service.slug} />
      <div className="flex items-baseline justify-between"><p className="display-sm">{service.name.en}</p><span className="font-display text-xs tracking-[0.2em] text-ink-muted">VV / {service.number}</span></div>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field label="Minutes" htmlFor={`${service.slug}-dur`}><Input id={`${service.slug}-dur`} name="duration_minutes" type="number" defaultValue={service.durationMinutes} min={15} step={15} /></Field>
        <Field label="Price XAF" htmlFor={`${service.slug}-price`} hint="empty = on request"><Input id={`${service.slug}-price`} name="price_xaf" type="number" defaultValue={service.priceXaf ?? ""} min={0} step={500} /></Field>
        <Field label="Deposit %" htmlFor={`${service.slug}-dep`}><Input id={`${service.slug}-dep`} name="deposit_percent" type="number" defaultValue={service.depositPercent} min={0} max={100} /></Field>
        <Field label="Capacity" htmlFor={`${service.slug}-cap`}><Input id={`${service.slug}-cap`} name="capacity" type="number" defaultValue={service.capacity} min={1} /></Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        {(["in_person", "virtual", "group"] as const).map((f) => <Checkbox key={f} name="formats" value={f} defaultChecked={service.formats.includes(f)} label={f.replace("_", " ")} />)}
        <Checkbox name="active" defaultChecked={row?.active ?? true} label="Active" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Cal.com event type id" htmlFor={`${service.slug}-cal`}><Input id={`${service.slug}-cal`} name="cal_event_type_id" defaultValue={row?.cal_event_type_id ?? ""} /></Field>
        <Field label="Location note" htmlFor={`${service.slug}-loc`}><Input id={`${service.slug}-loc`} name="location_note" defaultValue={row?.location_note ?? ""} maxLength={200} /></Field>
        <Field label="Name override (EN)" htmlFor={`${service.slug}-nen`}><Input id={`${service.slug}-nen`} name="name_en" placeholder={service.name.en} /></Field>
        <Field label="Name override (FR)" htmlFor={`${service.slug}-nfr`}><Input id={`${service.slug}-nfr`} name="name_fr" placeholder={service.name.fr} /></Field>
        <Field label="Short description (EN)" htmlFor={`${service.slug}-sen`} className="sm:col-span-2"><Textarea id={`${service.slug}-sen`} name="short_en" placeholder={service.short.en} className="min-h-16" /></Field>
        <Field label="Short description (FR)" htmlFor={`${service.slug}-sfr`} className="sm:col-span-2"><Textarea id={`${service.slug}-sfr`} name="short_fr" placeholder={service.short.fr} className="min-h-16" /></Field>
      </div>
      {state.status === "success" ? <Notice tone="success" className="mt-4">Saved.</Notice> : null}
      {state.status === "error" ? <Notice tone="error" className="mt-4">{state.message}</Notice> : null}
      <Button type="submit" size="sm" className="mt-4" loading={pending} disabled={pending}>Save</Button>
    </form>
  );
}
