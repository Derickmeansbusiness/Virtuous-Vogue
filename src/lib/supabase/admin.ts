import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";

/**
 * Service-role client for server-side jobs only (webhooks, admin tasks).
 * Never import this from a client component.
 */
export function createSupabaseAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL are required for admin operations.");
  }
  return createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
