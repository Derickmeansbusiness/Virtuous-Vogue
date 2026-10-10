"use client";

import { useActionState } from "react";
import { addAvailability, deleteAvailability, type AdminFormState } from "@/lib/actions/admin";
import { Field, Input, Select, Checkbox, Notice } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const initial: AdminFormState = { status: "idle" };

export function AvailabilityForm() {
  const [state, action, pending] = useActionState(addAvailability, initial);
  return (
    <form action={action} className="border border-line bg-ivory p-5">
      <p className="eyebrow text-mulberry">Add a rule</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Field label="Weekday" htmlFor="av-wd"><Select id="av-wd" name="weekday" defaultValue=""><option value="">—</option>{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => <option key={d} value={i}>{d}</option>)}</Select></Field>
        <Field label="or date" htmlFor="av-date"><Input id="av-date" name="date" type="date" /></Field>
        <Field label="From" htmlFor="av-start"><Input id="av-start" name="start_time" type="time" defaultValue="09:00" required /></Field>
        <Field label="To" htmlFor="av-end"><Input id="av-end" name="end_time" type="time" defaultValue="17:00" required /></Field>
        <Field label="Buffer min" htmlFor="av-buf"><Input id="av-buf" name="buffer_minutes" type="number" defaultValue={15} min={0} /></Field>
        <div className="flex items-end"><Checkbox name="is_day_off" label="Day off" /></div>
      </div>
      {state.status === "error" ? <Notice tone="error" className="mt-4">{state.message}</Notice> : null}
      <Button type="submit" size="sm" className="mt-4" loading={pending} disabled={pending}>Add</Button>
    </form>
  );
}

export function DeleteRuleButton({ id }: { id: string }) {
  return <button type="button" onClick={() => deleteAvailability(id)} className="text-xs uppercase tracking-[0.14em] text-danger">Remove</button>;
}
