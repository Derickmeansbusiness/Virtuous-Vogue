"use client";

import { useActionState } from "react";
import { saveLookbook, addLookbookItem, deleteLookbookItem, type AdminFormState } from "@/lib/actions/admin";
import { Field, Input, Select, Textarea, Notice } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const initial: AdminFormState = { status: "idle" };

export function LookbookForm({ clients, defaultClient, existing }: { clients: { id: string; label: string }[]; defaultClient?: string; existing?: { id: string; title: string; theme?: string | null; style_direction?: string | null; palette: string[]; stylist_note?: string | null; status: "draft" | "published" } }) {
  const [state, action, pending] = useActionState(saveLookbook, initial);
  return (
    <form action={action} className="border border-line bg-ivory p-5">
      {existing ? <input type="hidden" name="id" value={existing.id} /> : null}
      <p className="eyebrow text-mulberry">{existing ? "Lookbook details" : "New lookbook"}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Client" htmlFor="lb-client" required><Select id="lb-client" name="user_id" defaultValue={defaultClient ?? ""} required><option value="">—</option>{clients.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</Select></Field>
        <Field label="Title" htmlFor="lb-title" required><Input id="lb-title" name="title" defaultValue={existing?.title ?? ""} required maxLength={120} /></Field>
        <Field label="Theme" htmlFor="lb-theme"><Input id="lb-theme" name="theme" defaultValue={existing?.theme ?? ""} maxLength={120} /></Field>
        <Field label="Style direction" htmlFor="lb-dir"><Input id="lb-dir" name="style_direction" defaultValue={existing?.style_direction ?? ""} maxLength={120} /></Field>
        <Field label="Palette (hex, comma-separated)" htmlFor="lb-pal" className="sm:col-span-2"><Input id="lb-pal" name="palette" defaultValue={existing?.palette?.join(", ") ?? ""} placeholder="#F4EFE7, #672F40, #C5AE96" /></Field>
        <Field label="Stylist note" htmlFor="lb-note" className="sm:col-span-2"><Textarea id="lb-note" name="stylist_note" defaultValue={existing?.stylist_note ?? ""} maxLength={2000} /></Field>
        <Field label="Status" htmlFor="lb-status"><Select id="lb-status" name="status" defaultValue={existing?.status ?? "draft"}><option value="draft">Draft</option><option value="published">Published (visible to client)</option></Select></Field>
      </div>
      {state.status === "success" ? <Notice tone="success" className="mt-4">Saved.</Notice> : null}
      {state.status === "error" ? <Notice tone="error" className="mt-4">{state.message}</Notice> : null}
      <Button type="submit" size="sm" className="mt-4" loading={pending} disabled={pending}>Save</Button>
    </form>
  );
}

export function LookbookItemForm({ lookbookId, outfits, nextOrder }: { lookbookId: string; outfits: { id: string; label: string }[]; nextOrder: number }) {
  const [state, action, pending] = useActionState(addLookbookItem, initial);
  return (
    <form action={action} className="mt-6 border border-line bg-ivory p-5">
      <input type="hidden" name="lookbook_id" value={lookbookId} />
      <input type="hidden" name="sort_order" value={nextOrder} />
      <p className="eyebrow text-mulberry">Add a board</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field label="Kind" htmlFor="li-kind"><Select id="li-kind" name="kind" defaultValue="outfit"><option value="outfit">Outfit</option><option value="board">Board</option><option value="note">Annotation</option><option value="recommendation">Shopping recommendation</option></Select></Field>
        <Field label="Saved outfit" htmlFor="li-outfit"><Select id="li-outfit" name="outfit_id" defaultValue=""><option value="">—</option>{outfits.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</Select></Field>
        <Field label="Title" htmlFor="li-title"><Input id="li-title" name="title" maxLength={120} /></Field>
        <Field label="Body / annotation" htmlFor="li-body" className="sm:col-span-3"><Textarea id="li-body" name="body" maxLength={3000} /></Field>
      </div>
      {state.status === "error" ? <Notice tone="error" className="mt-4">{state.message}</Notice> : null}
      <Button type="submit" size="sm" className="mt-4" loading={pending} disabled={pending}>Add board</Button>
    </form>
  );
}

export function DeleteItemButton({ id, lookbookId }: { id: string; lookbookId: string }) {
  return <button type="button" onClick={() => deleteLookbookItem(id, lookbookId)} className="text-xs uppercase tracking-[0.14em] text-danger">Remove</button>;
}
