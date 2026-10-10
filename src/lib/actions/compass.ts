"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { getAdminStore } from "@/lib/data/store";
import { getSessionUser } from "@/lib/auth/session";
import { directionProfiles } from "@/lib/studio/compass-content";
import { type Answers, type CompassResult, isComplete } from "@/lib/studio/compass-model";

const ANON_COOKIE = "vv_anon";

export async function getAnonToken() {
  const store = await cookies();
  let token = store.get(ANON_COOKIE)?.value;
  if (!token) {
    token = randomUUID();
    store.set(ANON_COOKIE, token, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 90, path: "/" });
  }
  return token;
}

export async function saveCompassResult(input: { answers: Answers; result: CompassResult; locale: string }) {
  if (!isComplete(input.answers)) return { ok: false as const, error: "incomplete" };
  const user = await getSessionUser();
  const anon = user ? null : await getAnonToken();
  const profile = directionProfiles[input.result.primary];
  const pick = (v: { en: string; fr: string }) => (input.locale === "fr" ? v.fr : v.en);
  const store = getAdminStore();
  try {
    const row = await store.insert<Record<string, unknown>>("style_profiles", {
      user_id: user?.id ?? null,
      anon_token: anon,
      version: 1,
      scores: input.result.scores,
      primary_direction: input.result.primary,
      secondary_direction: input.result.secondary,
      style_words: input.result.styleWords,
      colour_mood: pick(profile.colourMood),
      silhouette_direction: pick(profile.silhouette),
      wardrobe_priorities: profile.priorities.map(pick),
      outfit_formulas: profile.formulas.map(pick),
      experiments: profile.experiments.map(pick),
      recommended_service: profile.service,
      share_slug: randomUUID().slice(0, 8),
    });
    for (const [key, answer] of Object.entries(input.answers)) {
      await store.insert("style_answers", { style_profile_id: row.id, question_key: key, answer });
    }
    return { ok: true as const, id: row.id as string };
  } catch (e) {
    console.error("[compass] save", e);
    return { ok: false as const, error: "server" };
  }
}

export async function claimAnonymousResults(userId: string) {
  const store = await cookies();
  const token = store.get(ANON_COOKIE)?.value;
  if (!token) return;
  const admin = getAdminStore();
  for (const table of ["style_profiles", "colour_profiles"]) {
    const rows = await admin.list<{ id: string }>(table, { anon_token: token, user_id: null });
    for (const r of rows) await admin.update(table, r.id, { user_id: userId, anon_token: null });
  }
}
