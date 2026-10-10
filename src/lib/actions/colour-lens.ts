"use server";

import { z } from "zod";
import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { analyseColourImage, type ColourReading } from "@/lib/studio/colour-analysis";
import { buildColourGuidance, type ColourGuidance } from "@/lib/studio/colour-guidance";
import { getAdminStore } from "@/lib/data/store";
import { getSessionUser } from "@/lib/auth/session";
import { getAnonToken } from "./compass";
import { rateLimit } from "@/lib/security/rate-limit";
import { uploadPrivateObject, deletePrivateObject } from "@/lib/storage/private";

export type ColourLensState =
  | { status: "idle" }
  | { status: "unclear"; reading: ColourReading }
  | { status: "ok"; id: string; reading: ColourReading; guidance: ColourGuidance; imageStored: boolean }
  | { status: "error"; code: "consent" | "file" | "rate" | "server" };

const MAX_BYTES = 10 * 1024 * 1024;

export async function analyseColourPhoto(_prev: ColourLensState, formData: FormData): Promise<ColourLensState> {
  const consent = formData.get("consent") === "on";
  if (!consent) return { status: "error", code: "consent" };
  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) return { status: "error", code: "file" };
  if (file.size > MAX_BYTES || !/^image\//.test(file.type)) return { status: "error", code: "file" };
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0] ?? "anon";
  if (!(await rateLimit(`colour:${ip}`, 10, 60_000))) return { status: "error", code: "rate" };
  const locale = (formData.get("locale") as string) === "fr" ? "fr" : "en";
  const keepImage = formData.get("keep") === "on";

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const reading = await analyseColourImage(buffer);
    if (reading.undertone === "uncertain" && reading.confidence < 0.35) {
      return { status: "unclear", reading };
    }
    const guidance = buildColourGuidance(reading, locale);
    const user = await getSessionUser();
    const anon = user ? null : await getAnonToken();
    let imagePath: string | null = null;
    if (user && keepImage) {
      imagePath = await uploadPrivateObject("colour-lens", `${user.id}/${randomUUID()}.jpg`, buffer, "image/jpeg");
    }
    const row = await getAdminStore().insert<Record<string, unknown>>("colour_profiles", {
      user_id: user?.id ?? null,
      anon_token: anon,
      source: "digital_preview",
      undertone: reading.undertone,
      contrast: reading.contrast,
      confidence: Number(reading.confidence.toFixed(2)),
      image_quality: reading.quality,
      families: guidance.families,
      neutrals: guidance.neutrals,
      accents: guidance.accents,
      metals: guidance.metals,
      combinations: guidance.combinations,
      test_carefully: guidance.testCarefully,
      notes: guidance.summary,
      image_path: imagePath,
    });
    // The uploaded buffer is never retained unless the client asked to keep it.
    return { status: "ok", id: row.id as string, reading, guidance, imageStored: Boolean(imagePath) };
  } catch (e) {
    console.error("[colour-lens]", e);
    return { status: "error", code: "server" };
  }
}

const deleteSchema = z.object({ id: z.string().min(1) });

export async function deleteColourImage(input: { id: string }) {
  const { id } = deleteSchema.parse(input);
  const user = await getSessionUser();
  const store = getAdminStore();
  const row = await store.get<{ user_id: string | null; image_path: string | null }>("colour_profiles", id);
  if (!row || !user || (row.user_id !== user.id && user.role !== "admin")) return { ok: false as const };
  if (row.image_path) await deletePrivateObject("colour-lens", row.image_path).catch(() => {});
  await store.update("colour_profiles", id, { image_path: null, image_deleted_at: new Date().toISOString() });
  return { ok: true as const };
}
