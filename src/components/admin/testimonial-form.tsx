"use client";

import { useActionState } from "react";
import { saveTestimonial, deleteTestimonial, type AdminFormState } from "@/lib/actions/admin";
import { Field, Input, Select, Textarea, Checkbox, Notice } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const initial: AdminFormState = { status: "idle" };

export function TestimonialForm() {
  const [state, action, pending] = useActionState(saveTestimonial, initial);
  return (
    <form action={action} className="border border-line bg-ivory p-5">
      <p className="eyebrow text-mulberry">Add a client story</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Client name (as she wants it shown)" htmlFor="t-name" required><Input id="t-name" name="client_name" required maxLength={120} /></Field>
        <Field label="Context (e.g. Executive, Douala)" htmlFor="t-ctx"><Input id="t-ctx" name="context" maxLength={120} /></Field>
        <Field label="Quote (EN)" htmlFor="t-en" required className="sm:col-span-2"><Textarea id="t-en" name="quote_en" required maxLength={1200} /></Field>
        <Field label="Quote (FR)" htmlFor="t-fr" className="sm:col-span-2"><Textarea id="t-fr" name="quote_fr" maxLength={1200} /></Field>
        <Field label="Service" htmlFor="t-svc"><Input id="t-svc" name="service_slug" placeholder="wardrobe-edit" /></Field>
        <Field label="Status" htmlFor="t-status"><Select id="t-status" name="status" defaultValue="draft"><option value="draft">Draft</option><option value="published">Published</option></Select></Field>
        <Field label="Order" htmlFor="t-order"><Input id="t-order" name="sort_order" type="number" defaultValue={0} /></Field>
        <div className="flex items-end"><Checkbox name="consent" label="Written consent received" /></div>
      </div>
      {state.status === "success" ? <Notice tone="success" className="mt-4">Saved.</Notice> : null}
      {state.status === "error" ? <Notice tone="error" className="mt-4">{state.message}</Notice> : null}
      <Button type="submit" size="sm" className="mt-4" loading={pending} disabled={pending}>Save</Button>
    </form>
  );
}

export function DeleteTestimonialButton({ id }: { id: string }) {
  return <button type="button" onClick={() => confirm("Delete this story?") && deleteTestimonial(id)} className="text-xs uppercase tracking-[0.14em] text-danger">Delete</button>;
}
