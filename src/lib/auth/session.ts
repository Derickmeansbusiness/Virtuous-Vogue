import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { supabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { readLocalSessionCookie } from "./local-session";
import { getStore } from "@/lib/data/store";

export type SessionUser = {
  id: string;
  email: string;
  role: "client" | "admin";
  name?: string;
  locale?: string;
};

/**
 * Data access layer entry point: the only place that reads the session.
 * Cached per request so layouts and pages share one lookup.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();

  if (!supabaseConfigured) {
    const local = readLocalSessionCookie(cookieStore.get("vv_local_session")?.value);
    if (!local) return null;
    return { id: local.userId, email: local.email, role: local.role, name: local.name };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const store = getStore();
  const profile = await store.get<{ role?: string; full_name?: string; locale?: string }>("profiles", user.id);
  return {
    id: user.id,
    email: user.email ?? "",
    role: profile?.role === "admin" ? "admin" : "client",
    name: profile?.full_name ?? (user.user_metadata?.full_name as string | undefined),
    locale: profile?.locale,
  };
});

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    const { redirect } = await import("next/navigation");
    redirect("/login");
  }
  return user!;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin") {
    const { redirect } = await import("next/navigation");
    redirect("/account");
  }
  return user;
}
