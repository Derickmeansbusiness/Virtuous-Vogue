import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import { supabaseAnonKey, supabaseConfigured, supabaseUrl } from "./env";
import { readLocalSessionCookie } from "@/lib/auth/local-session";

export async function updateSession(request: NextRequest, response: NextResponse) {
  if (!supabaseConfigured) {
    const local = readLocalSessionCookie(request.cookies.get("vv_local_session")?.value);
    return { response, user: local ? { id: local.userId } : null };
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
