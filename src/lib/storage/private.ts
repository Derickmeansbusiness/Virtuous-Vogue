import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { supabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Private object storage. Supabase Storage in production; a local .data
 * folder in development. Paths are always prefixed with the owner's user id
 * so storage RLS can scope access.
 */
export async function uploadPrivateObject(bucket: string, objectPath: string, body: Buffer, contentType: string) {
  if (supabaseConfigured) {
    const sb = createSupabaseAdminClient();
    const { error } = await sb.storage.from(bucket).upload(objectPath, body, { contentType, upsert: false });
    if (error) throw new Error(`[storage] upload: ${error.message}`);
    return objectPath;
  }
  const file = path.join(process.cwd(), ".data", "storage", bucket, objectPath);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, body);
  return objectPath;
}

export async function deletePrivateObject(bucket: string, objectPath: string) {
  if (supabaseConfigured) {
    const sb = createSupabaseAdminClient();
    const { error } = await sb.storage.from(bucket).remove([objectPath]);
    if (error) throw new Error(`[storage] delete: ${error.message}`);
    return;
  }
  await fs.rm(path.join(process.cwd(), ".data", "storage", bucket, objectPath), { force: true });
}

export async function signedPrivateUrl(bucket: string, objectPath: string, seconds = 600) {
  if (supabaseConfigured) {
    const sb = createSupabaseAdminClient();
    const { data, error } = await sb.storage.from(bucket).createSignedUrl(objectPath, seconds);
    if (error) throw new Error(`[storage] sign: ${error.message}`);
    return data.signedUrl;
  }
  return `/api/local-storage/${bucket}/${objectPath}`;
}

export async function readPrivateObject(bucket: string, objectPath: string) {
  if (supabaseConfigured) {
    const sb = createSupabaseAdminClient();
    const { data, error } = await sb.storage.from(bucket).download(objectPath);
    if (error) throw new Error(`[storage] download: ${error.message}`);
    return Buffer.from(await data.arrayBuffer());
  }
  return fs.readFile(path.join(process.cwd(), ".data", "storage", bucket, objectPath));
}
