"use server";

import { z } from "zod";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { writeLocalSessionCookie } from "@/lib/auth/local-session";
import { getAdminStore } from "@/lib/data/store";
import { claimAnonymousResults } from "./compass";
import { rateLimit } from "@/lib/security/rate-limit";
import { SITE } from "@/lib/site";

export type AuthState = { status: "idle" } | { status: "sent"; email: string } | { status: "error"; code: "invalid" | "rate" | "server" | "exists" | "credentials" };

const emailSchema = z.string().trim().toLowerCase().email();

function safeNext(next: unknown) {
  const n = typeof next === "string" ? next : "/account";
  return n.startsWith("/") && !n.startsWith("//") ? n : "/account";
}

/**
 * Passwordless sign-in / sign-up with a magic link (Supabase). In local
 * development without Supabase, a signed dev session is created directly.
 */
export async function requestMagicLink(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { status: "error", code: "invalid" };
  const email = parsed.data;
  const fullName = String(formData.get("full_name") ?? "").trim().slice(0, 120);
  const locale = String(formData.get("locale") ?? "en") === "fr" ? "fr" : "en";
  const next = safeNext(formData.get("next"));
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0] ?? "anon";
  if (!(await rateLimit(`auth:${ip}`, 5, 10 * 60_000))) return { status: "error", code: "rate" };

  if (!supabaseConfigured) {
    // Local development: first email to sign in becomes the admin unless configured otherwise.
    const store = getAdminStore();
    const existing = await store.list<{ id: string; email: string; role: string; full_name?: string | null }>("profiles", { email });
    const adminEmail = process.env.LOCAL_ADMIN_EMAIL?.toLowerCase();
    let profile = existing[0];
    if (!profile) {
      const all = await store.list<{ id: string }>("profiles");
      const role = adminEmail ? (email === adminEmail ? "admin" : "client") : all.length === 0 ? "admin" : "client";
      profile = await store.insert<{ id: string; email: string; role: string; full_name?: string | null }>("profiles", { email, full_name: fullName || null, role, locale, time_zone: SITE.timeZone });
    }
    const cookieStore = await cookies();
    cookieStore.set("vv_local_session", writeLocalSessionCookie({ userId: profile.id, email, role: profile.role as "client" | "admin", name: profile.full_name ?? fullName }), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    await claimAnonymousResults(profile.id);
    redirect(next);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${SITE.url}/auth/callback?next=${encodeURIComponent(next)}`,
      data: { full_name: fullName || undefined, locale },
    },
  });
  if (error) {
    console.error("[auth] otp", error.message);
    return { status: "error", code: "server" };
  }
  return { status: "sent", email };
}

export async function signOut() {
  const cookieStore = await cookies();
  if (supabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  cookieStore.delete("vv_local_session");
  redirect("/");
}
