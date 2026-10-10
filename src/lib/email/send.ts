import "server-only";
import { Resend } from "resend";
import type { ReactElement } from "react";

const from = process.env.EMAIL_FROM ?? "Virtuous Vogue <hello@example.com>";

/**
 * Email transport. With RESEND_API_KEY set, mail is delivered through
 * Resend; otherwise messages are logged so local flows still complete.
 */
export async function sendEmail({ to, subject, react, replyTo }: { to: string; subject: string; react: ReactElement; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[email:dry-run] to=${to} subject="${subject}"`);
    return { id: "dry-run" };
  }
  const resend = new Resend(key);
  const { data, error } = await resend.emails.send({ from, to, subject, react, replyTo });
  if (error) throw new Error(error.message);
  return data;
}
