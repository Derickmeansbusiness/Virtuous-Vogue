import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Filter, Store } from "./store";

const DATA_DIR = path.join(process.cwd(), ".data");

/**
 * JSON-file store for local development without Supabase. Not for
 * production use: single-process, no RLS, no concurrency guarantees.
 */
export class LocalFileStore implements Store {
  private cache = new Map<string, Record<string, unknown>[]>();
  private queue: Promise<void> = Promise.resolve();

  private file(table: string) {
    return path.join(DATA_DIR, `${table}.json`);
  }

  private async read(table: string) {
    if (this.cache.has(table)) return this.cache.get(table)!;
    try {
      const raw = await fs.readFile(this.file(table), "utf8");
      const rows = JSON.parse(raw) as Record<string, unknown>[];
      this.cache.set(table, rows);
      return rows;
    } catch {
      this.cache.set(table, []);
      return [];
    }
  }

  private async write(table: string, rows: Record<string, unknown>[]) {
    this.cache.set(table, rows);
    this.queue = this.queue.then(async () => {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(this.file(table), JSON.stringify(rows, null, 2), "utf8");
    });
    await this.queue;
  }

  async get<T extends object>(table: string, id: string) {
    const rows = await this.read(table);
    return (rows.find((r) => r.id === id) as (T & { id: string }) | undefined) ?? null;
  }

  async list<T extends object>(table: string, filter: Filter = {}, opts: { orderBy?: string; ascending?: boolean; limit?: number } = {}) {
    let rows = (await this.read(table)).filter((r) =>
      Object.entries(filter).every(([k, v]) => v === undefined || r[k] === v),
    );
    if (opts.orderBy) {
      const key = opts.orderBy;
      const dir = opts.ascending ? 1 : -1;
      rows = [...rows].sort((a, b) => ((a[key] as string) > (b[key] as string) ? dir : -dir));
    }
    if (opts.limit) rows = rows.slice(0, opts.limit);
    return rows as (T & { id: string })[];
  }

  async insert<T extends object>(table: string, row: Partial<T> & { id?: string }) {
    const rows = await this.read(table);
    const now = new Date().toISOString();
    const full = { created_at: now, updated_at: now, ...row, id: row.id ?? randomUUID() } as Record<string, unknown>;
    await this.write(table, [...rows, full]);
    return full as T & { id: string };
  }

  async update<T extends object>(table: string, id: string, patch: Partial<T>) {
    const rows = await this.read(table);
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error(`[local-store] ${table}/${id} not found`);
    const next = { ...rows[idx], ...patch, updated_at: new Date().toISOString() };
    const copy = [...rows];
    copy[idx] = next;
    await this.write(table, copy);
    return next as T & { id: string };
  }

  async upsert<T extends object>(table: string, row: Partial<T> & { id: string }) {
    const existing = await this.get(table, row.id);
    return existing ? this.update<T>(table, row.id, row) : this.insert<T>(table, row);
  }

  async delete(table: string, id: string) {
    const rows = await this.read(table);
    await this.write(table, rows.filter((r) => r.id !== id));
  }
}
