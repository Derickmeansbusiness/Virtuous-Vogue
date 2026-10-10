"use client";

import { useActionState } from "react";
import { saveArticle, type AdminFormState } from "@/lib/actions/admin";
import { Field, Input, Select, Textarea, Notice } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const initial: AdminFormState = { status: "idle" };

export function ArticleEditor({ slug, status, data }: { slug: string; status: "draft" | "published" | "archived"; data: unknown }) {
  const [state, action, pending] = useActionState(saveArticle, initial);
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Slug" htmlFor="a-slug" required><Input id="a-slug" name="slug" defaultValue={slug} required pattern="[a-z0-9-]+" /></Field>
        <Field label="Status" htmlFor="a-status"><Select id="a-status" name="status" defaultValue={status}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></Select></Field>
      </div>
      <Field label="Article JSON" htmlFor="a-data"><Textarea id="a-data" name="data" defaultValue={JSON.stringify(data, null, 2)} className="min-h-[32rem] font-mono text-xs" spellCheck={false} /></Field>
      {state.status === "success" ? <Notice tone="success">Saved.</Notice> : null}
      {state.status === "error" ? <Notice tone="error">{state.message}</Notice> : null}
      <Button type="submit" loading={pending} disabled={pending}>Save story</Button>
    </form>
  );
}
