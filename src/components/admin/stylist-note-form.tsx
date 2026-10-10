"use client";

import { useActionState } from "react";
import { addStylistNote, type AdminFormState } from "@/lib/actions/admin";
import { Field, Input, Select, Textarea, Checkbox, Notice } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const initial: AdminFormState = { status: "idle" };

export function StylistNoteForm({ userId, appointmentId }: { userId: string; appointmentId?: string }) {
  const [state, action, pending] = useActionState(addStylistNote, initial);
  return (
    <form action={action} className="mt-4 space-y-4">
      <input type="hidden" name="user_id" value={userId} />
      {appointmentId ? <input type="hidden" name="appointment_id" value={appointmentId} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Kind" htmlFor="n-kind"><Select id="n-kind" name="kind" defaultValue="note"><option value="note">Note</option><option value="principle">Style principle</option><option value="priority">Wardrobe priority</option><option value="colour">Colour guidance</option><option value="outfit">Outfit</option><option value="recommendation">Recommended purchase</option></Select></Field>
        <Field label="Title" htmlFor="n-title"><Input id="n-title" name="title" maxLength={120} /></Field>
      </div>
      <Field label="Body" htmlFor="n-body" required><Textarea id="n-body" name="body" required maxLength={4000} /></Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Budget hint (purchases)" htmlFor="n-budget"><Input id="n-budget" name="budget_hint" maxLength={60} /></Field>
        <Field label="Link (purchases)" htmlFor="n-url"><Input id="n-url" name="url" type="url" maxLength={300} /></Field>
        <div className="flex items-end"><Checkbox name="visible" defaultChecked label="Visible to client" /></div>
      </div>
      {state.status === "success" ? <Notice tone="success">Saved to the client's Style Passport.</Notice> : null}
      {state.status === "error" ? <Notice tone="error">{state.message ?? "Could not save."}</Notice> : null}
      <Button type="submit" size="sm" loading={pending} disabled={pending}>Save</Button>
    </form>
  );
}
