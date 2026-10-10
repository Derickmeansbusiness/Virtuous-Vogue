"use server";

import { z } from "zod";
import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import sharp from "sharp";
import { getAdminStore } from "@/lib/data/store";
import { getSessionUser } from "@/lib/auth/session";
import { getAnonToken } from "./compass";
import { rateLimit } from "@/lib/security/rate-limit";
import { uploadPrivateObject, signedPrivateUrl } from "@/lib/storage/private";
import { classifyGarment } from "@/lib/ai";
import { composeOutfits, type RemixContext, type RemixItem, type Outfit } from "@/lib/studio/remix-engine";
import { removeBackground } from "@/lib/integrations/background-removal";
import { sendEmail } from "@/lib/email/send";
import { AskVvEmail } from "@/lib/email/templates/ask-vv";

const MAX_BYTES = 12 * 1024 * 1024;

export type UploadedPiece = { tempId: string; previewDataUrl: string; guess: Partial<RemixItem>; storagePath?: string };

/**
 * Receives one clothing photo, compresses it, optionally removes the
 * background, asks the classifier for a first guess and returns a small
 * preview. Anonymous visitors keep images in memory on the client only;
 * signed-in clients get the image stored privately under their user id.
 */
export async function uploadPiece(formData: FormData): Promise<{ ok: true; piece: UploadedPiece } | { ok: false; error: string }> {
  const file = formData.get("photo");
  const consent = formData.get("consent") === "on";
  if (!consent) return { ok: false, error: "consent" };
  if (!(file instanceof File) || !/^image\//.test(file.type) || file.size > MAX_BYTES) return { ok: false, error: "file" };
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0] ?? "anon";
  if (!(await rateLimit(`remix-upload:${ip}`, 40, 10 * 60_000))) return { ok: false, error: "rate" };

  try {
    const original = Buffer.from(await file.arrayBuffer());
    const compressed = await sharp(original).rotate().resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    const cutout = await removeBackground(compressed).catch(() => null);
    const preview = await sharp(cutout ?? compressed).resize({ width: 480, height: 480, fit: "inside" }).webp({ quality: 70 }).toBuffer();
    const guess = await classifyGarment(compressed).catch(() => ({}));
    const user = await getSessionUser();
    let storagePath: string | undefined;
    if (user) {
      storagePath = await uploadPrivateObject("wardrobe", `${user.id}/${randomUUID()}.jpg`, compressed, "image/jpeg");
      if (cutout) await uploadPrivateObject("wardrobe", storagePath.replace(/\.jpg$/, ".cutout.png"), cutout, "image/png").catch(() => {});
    }
    return {
      ok: true,
      piece: { tempId: randomUUID(), previewDataUrl: `data:image/webp;base64,${preview.toString("base64")}`, guess, storagePath },
    };
  } catch (e) {
    console.error("[remix] upload", e);
    return { ok: false, error: "server" };
  }
}

const itemSchema = z.object({
  id: z.string(),
  category: z.enum(["top", "bottom", "dress", "outerwear", "shoes", "bag", "accessory", "other"]),
  subcategory: z.string().max(40).optional(),
  name: z.string().max(80).optional(),
  colour: z.string().max(30).optional(),
  colourHex: z.string().max(9).optional(),
  pattern: z.enum(["plain", "stripe", "check", "print", "floral", "heritage", "other"]).optional(),
  fabric: z.string().max(40).optional(),
  fit: z.enum(["fitted", "regular", "relaxed", "oversized"]).optional(),
  silhouette: z.string().max(40).optional(),
  seasons: z.array(z.enum(["hot", "warm", "mild", "cool"])).optional(),
  occasions: z.array(z.string().max(30)).optional(),
  coverage: z.enum(["full", "mostly", "balanced", "light"]).optional(),
  favourite: z.boolean().optional(),
  storagePath: z.string().optional(),
  brand: z.string().max(60).optional(),
  notes: z.string().max(300).optional(),
});

const contextSchema = z.object({
  occasion: z.string().max(30),
  climate: z.enum(["hot", "warm", "mild", "cool"]).optional(),
  timeOfDay: z.enum(["day", "evening"]).optional(),
  venue: z.string().max(80).optional(),
  dressCode: z.enum(["casual", "smart_casual", "business", "formal", "black_tie", "none"]).optional(),
  modesty: z.enum(["full", "mostly", "balanced", "relaxed"]).optional(),
  shoes: z.enum(["flat", "heel", "sandal", "sneaker", "any"]).optional(),
});

export async function remixCloset(input: { items: unknown; context: unknown; locale?: string }): Promise<{ ok: true; outfits: Outfit[]; persisted: boolean } | { ok: false; error: string }> {
  const items = z.array(itemSchema).min(3).max(60).safeParse(input.items);
  const ctx = contextSchema.safeParse(input.context);
  if (!items.success || !ctx.success) return { ok: false, error: "invalid" };
  const user = await getSessionUser();
  if (!user && items.data.length > 10) return { ok: false, error: "tooMany" };
  const outfits = composeOutfits(items.data as RemixItem[], ctx.data as RemixContext, 6);

  // Signed-in clients: persist wardrobe items (once) so outfits can be saved and scheduled.
  let persisted = false;
  if (user) {
    try {
      const store = getAdminStore();
      for (const it of items.data) {
        const existing = await store.get("wardrobe_items", it.id);
        if (!existing) {
          await store.insert("wardrobe_items", {
            id: it.id,
            user_id: user.id,
            category: it.category,
            subcategory: it.subcategory ?? null,
            name: it.name ?? null,
            colour: it.colour ?? null,
            colour_hex: it.colourHex ?? null,
            pattern: it.pattern ?? null,
            fabric: it.fabric ?? null,
            fit: it.fit ?? null,
            silhouette: it.silhouette ?? null,
            seasons: it.seasons ?? [],
            occasions: it.occasions ?? [],
            brand: it.brand ?? null,
            notes: it.notes ?? null,
            is_favourite: Boolean(it.favourite),
            source: "client",
          });
          if (it.storagePath) {
            await store.insert("wardrobe_images", { item_id: it.id, user_id: user.id, storage_path: it.storagePath, cutout_path: it.storagePath.replace(/\.jpg$/, ".cutout.png"), is_primary: true });
          }
        }
      }
      persisted = true;
    } catch (e) {
      console.error("[remix] persist", e);
    }
  }
  return { ok: true, outfits, persisted };
}

export async function saveOutfit(input: { outfit: Outfit; context: RemixContext; name?: string; hearted?: boolean; scheduledFor?: string; locale?: string }) {
  const user = await getSessionUser();
  if (!user) return { ok: false as const, error: "auth" };
  const store = getAdminStore();
  const row = await store.insert<{ id: string }>("outfits", {
    user_id: user.id,
    name: input.name?.slice(0, 80) ?? null,
    occasion: input.context.occasion,
    context: input.context,
    reasoning: input.outfit.reasons.map((r) => (input.locale === "fr" ? r.fr : r.en)).join(" "),
    gap_suggestions: input.outfit.gap ? [input.outfit.gap] : [],
    created_by: "remix",
    scheduled_for: input.scheduledFor ?? null,
  });
  for (const p of input.outfit.items) {
    await store.insert("outfit_items", { outfit_id: row.id, item_id: p.item.id, slot: p.slot, id: `${row.id}:${p.item.id}` });
  }
  await store.insert("saved_outfits", { id: `${user.id}:${row.id}`, user_id: user.id, outfit_id: row.id, hearted: input.hearted ?? true, share_token: randomUUID().slice(0, 10) });
  return { ok: true as const, id: row.id };
}

const askSchema = z.object({
  question: z.string().trim().min(5).max(1000),
  email: z.string().trim().toLowerCase().email().optional(),
  name: z.string().trim().max(120).optional(),
  outfit: z.unknown(),
  context: z.unknown(),
  locale: z.string().optional(),
});

/** "Ask Virtuous Vogue": the look + question become a consultation request with context for the stylist. */
export async function askVirtuousVogue(input: unknown) {
  const parsed = askSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "invalid" };
  const user = await getSessionUser();
  const email = user?.email ?? parsed.data.email;
  if (!email) return { ok: false as const, error: "email" };
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0] ?? "anon";
  if (!(await rateLimit(`ask:${ip}`, 5, 60 * 60_000))) return { ok: false as const, error: "rate" };
  const store = getAdminStore();
  const outfit = parsed.data.outfit as Outfit | undefined;
  const lead = await store.insert<{ id: string }>("leads", {
    name: user?.name ?? parsed.data.name ?? null,
    email,
    channel: "ask_vv",
    topic: "outfit",
    message: parsed.data.question,
    context: {
      user_id: user?.id ?? null,
      outfit: outfit ? { items: outfit.items.map((p) => ({ slot: p.slot, item: { ...p.item } })), reasons: outfit.reasons, gap: outfit.gap } : null,
      remixContext: parsed.data.context,
    },
    status: "new",
    locale: parsed.data.locale ?? "en",
  });
  const stylist = process.env.STYLIST_NOTIFICATION_EMAIL;
  if (stylist) {
    await sendEmail({ to: stylist, subject: `Ask VV · new outfit question from ${email}`, react: AskVvEmail({ question: parsed.data.question, email, outfit, locale: "en" }), replyTo: email }).catch(() => {});
  }
  return { ok: true as const, id: lead.id };
}

export async function wardrobeImageUrl(path: string) {
  const user = await getSessionUser();
  if (!user || (!path.startsWith(`${user.id}/`) && user.role !== "admin")) return null;
  return signedPrivateUrl("wardrobe", path);
}
