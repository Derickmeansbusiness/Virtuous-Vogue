"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { getAdminStore } from "@/lib/data/store";
import { rateLimit } from "@/lib/security/rate-limit";
import { sendEmail } from "@/lib/email/send";
import { LeadEmail } from "@/lib/email/templates/lead";

export type LeadState = { status: "idle" } | { status: "success" } | { status: "error"; code: "invalid" | "rate" | "server" };

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().max(32).optional().or(z.literal("")),
  topic: z.string().max(40).default("consultation"),
  message: z.string().trim().min(5).max(3000),
  consent: z.literal("on"),
  locale: z.string().max(5).optional(),
  company: z.string().max(0).optional(),
});

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", code: "invalid" };
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0] ?? "anon";
  if (!(await rateLimit(`lead:${ip}`, 5, 60 * 60_000))) return { status: "error", code: "rate" };
  try {
    const d = parsed.data;
    await getAdminStore().insert("leads", { name: d.name, email: d.email, phone: d.phone || null, channel: "contact_form", topic: d.topic, message: d.message, context: {}, status: "new", locale: d.locale ?? "en" });
    const stylist = process.env.STYLIST_NOTIFICATION_EMAIL;
    if (stylist) await sendEmail({ to: stylist, subject: `[Lead] ${d.topic}: ${d.name}`, react: LeadEmail(d), replyTo: d.email }).catch(() => {});
    return { status: "success" };
  } catch (e) {
    console.error("[lead]", e);
    return { status: "error", code: "server" };
  }
}
