"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { getAdminStore } from "@/lib/data/store";
import { sendEmail } from "@/lib/email/send";
import { WelcomeEmail } from "@/lib/email/templates/welcome";
import { rateLimit } from "@/lib/security/rate-limit";

export type NewsletterState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "already" }
  | { status: "error"; code: "invalid" | "server" | "rate" };

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  consent: z.literal("on"),
  source: z.string().max(60).optional(),
  company: z.string().max(0).optional(), // honeypot
});

export async function subscribeToNewsletter(_prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", code: "invalid" };
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0] ?? "anon";
  if (!(await rateLimit(`newsletter:${ip}`, 5, 60_000))) return { status: "error", code: "rate" };

  const { email, source } = parsed.data;
  const store = getAdminStore();
  try {
    const existing = await store.list<{ email: string; status: string }>("newsletter_subscribers", { email });
    if (existing.length > 0) {
      if (existing[0].status === "unsubscribed") {
        await store.update("newsletter_subscribers", existing[0].id, { status: "subscribed", resubscribed_at: new Date().toISOString() });
        return { status: "success" };
      }
      return { status: "already" };
    }
    const locale = h.get("x-next-intl-locale") ?? "en";
    await store.insert("newsletter_subscribers", {
      email,
      status: "subscribed",
      source: source ?? "unknown",
      locale,
      consent_at: new Date().toISOString(),
    });
    await sendEmail({
      to: email,
      subject: locale === "fr" ? "Bienvenue dans The Virtuous Edit" : "Welcome to The Virtuous Edit",
      react: WelcomeEmail({ locale }),
    }).catch(() => {});
    return { status: "success" };
  } catch (error) {
    console.error("[newsletter]", error);
    return { status: "error", code: "server" };
  }
}
