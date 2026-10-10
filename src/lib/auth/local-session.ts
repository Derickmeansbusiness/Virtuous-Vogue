/**
 * Local development session used ONLY when Supabase is not configured.
 * It is an HMAC-signed cookie so the dev flow is still tamper-evident,
 * and it refuses to run in production.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export type LocalSession = { userId: string; email: string; role: "client" | "admin"; name?: string };

const secret = () => process.env.LOCAL_SESSION_SECRET ?? "virtuous-vogue-dev-only-secret";

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function writeLocalSessionCookie(session: LocalSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readLocalSessionCookie(value?: string): LocalSession | null {
  if (!value) return null;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as LocalSession;
  } catch {
    return null;
  }
}
