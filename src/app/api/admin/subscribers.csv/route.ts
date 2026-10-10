import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getAdminStore } from "@/lib/data/store";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return new NextResponse("Forbidden", { status: 403 });
  const subs = await getAdminStore().list<{ email: string; status: string; locale?: string; consent_at?: string }>("newsletter_subscribers", { status: "subscribed" });
  const csv = ["email,locale,consent_at", ...subs.map((s) => `${s.email},${s.locale ?? "en"},${s.consent_at ?? ""}`)].join("\n");
  return new NextResponse(csv, { headers: { "content-type": "text/csv", "content-disposition": 'attachment; filename="virtuous-edit-subscribers.csv"' } });
}
