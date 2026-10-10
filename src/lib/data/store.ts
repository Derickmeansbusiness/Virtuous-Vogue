import "server-only";
import { supabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { LocalFileStore } from "./local-store";

/**
 * Minimal document/row store used by the domain layer. Two implementations:
 *  - SupabaseStore: production, respects RLS when using the user client.
 *  - LocalFileStore: development fallback when Supabase is not configured.
 *    Writes to .data/*.json and refuses to run in production.
 */
export type Row = Record<string, unknown> & { id: string };

export type Filter = Record<string, string | number | boolean | null | undefined>;

export interface Store {
  get<T extends object>(table: string, id: string): Promise<(T & { id: string }) | null>;
  list<T extends object>(
    table: string,
    filter?: Filter,
    opts?: { orderBy?: string; ascending?: boolean; limit?: number },
  ): Promise<(T & { id: string })[]>;
  insert<T extends object = Record<string, unknown>>(table: string, row: Record<string, unknown>): Promise<T & { id: string }>;
  update<T extends object = Record<string, unknown>>(table: string, id: string, patch: Record<string, unknown>): Promise<T & { id: string }>;
  upsert<T extends object = Record<string, unknown>>(table: string, row: Record<string, unknown> & { id: string }): Promise<T & { id: string }>;
  delete(table: string, id: string): Promise<void>;
}

class SupabaseStore implements Store {
  constructor(private readonly admin: boolean) {}

  private async client() {
    return this.admin ? createSupabaseAdminClient() : createSupabaseServerClient();
  }

  async get<T extends object>(table: string, id: string) {
    const sb = await this.client();
    const { data, error } = await sb.from(table).select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`[store] ${table}.get: ${error.message}`);
    return (data as (T & { id: string }) | null) ?? null;
  }

  async list<T extends object>(table: string, filter: Filter = {}, opts: { orderBy?: string; ascending?: boolean; limit?: number } = {}) {
    const sb = await this.client();
    let q = sb.from(table).select("*");
    for (const [k, v] of Object.entries(filter)) {
      if (v === undefined) continue;
      q = v === null ? q.is(k, null) : q.eq(k, v);
    }
    if (opts.orderBy) q = q.order(opts.orderBy, { ascending: opts.ascending ?? false });
    if (opts.limit) q = q.limit(opts.limit);
    const { data, error } = await q;
    if (error) throw new Error(`[store] ${table}.list: ${error.message}`);
    return (data ?? []) as (T & { id: string })[];
  }

  async insert<T extends object>(table: string, row: Record<string, unknown>) {
    const sb = await this.client();
    const { data, error } = await sb.from(table).insert(row).select("*").single();
    if (error) throw new Error(`[store] ${table}.insert: ${error.message}`);
    return data as T & { id: string };
  }

  async update<T extends object>(table: string, id: string, patch: Record<string, unknown>) {
    const sb = await this.client();
    const { data, error } = await sb.from(table).update(patch).eq("id", id).select("*").single();
    if (error) throw new Error(`[store] ${table}.update: ${error.message}`);
    return data as T & { id: string };
  }

  async upsert<T extends object>(table: string, row: Record<string, unknown> & { id: string }) {
    const sb = await this.client();
    const { data, error } = await sb.from(table).upsert(row).select("*").single();
    if (error) throw new Error(`[store] ${table}.upsert: ${error.message}`);
    return data as T & { id: string };
  }

  async delete(table: string, id: string) {
    const sb = await this.client();
    const { error } = await sb.from(table).delete().eq("id", id);
    if (error) throw new Error(`[store] ${table}.delete: ${error.message}`);
  }
}

let localStore: LocalFileStore | null = null;

export class StoreNotConfiguredError extends Error {
  constructor() {
    super("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and SUPABASE_SERVICE_ROLE_KEY.");
    this.name = "StoreNotConfiguredError";
  }
}

/**
 * Production without Supabase: reads return nothing so public pages still
 * render from seed content, and writes fail loudly with a clear message.
 */
class NullStore implements Store {
  private warned = false;
  private warn() {
    if (!this.warned) {
      this.warned = true;
      console.warn("[store] " + new StoreNotConfiguredError().message);
    }
  }
  async get() {
    this.warn();
    return null;
  }
  async list() {
    this.warn();
    return [];
  }
  async insert(): Promise<never> {
    throw new StoreNotConfiguredError();
  }
  async update(): Promise<never> {
    throw new StoreNotConfiguredError();
  }
  async upsert(): Promise<never> {
    throw new StoreNotConfiguredError();
  }
  async delete(): Promise<never> {
    throw new StoreNotConfiguredError();
  }
}

/** Store that acts as the current user (RLS enforced in production). */
export function getStore(): Store {
  if (supabaseConfigured) return new SupabaseStore(false);
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_LOCAL_STORE !== "true") {
    return new NullStore();
  }
  localStore ??= new LocalFileStore();
  return localStore;
}

/** Store with elevated privileges for webhooks and system jobs. */
export function getAdminStore(): Store {
  if (supabaseConfigured) return new SupabaseStore(true);
  return getStore();
}

export const storeMode = supabaseConfigured ? "supabase" : process.env.NODE_ENV === "production" && process.env.ALLOW_LOCAL_STORE !== "true" ? "unconfigured" : "local";
