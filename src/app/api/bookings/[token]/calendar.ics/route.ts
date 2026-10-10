import { NextResponse } from "next/server";
import { getAdminStore } from "@/lib/data/store";
import { getServiceBySlug } from "@/lib/domain/services";
import { SITE } from "@/lib/site";

function icsDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const rows = await getAdminStore().list<{ id: string; service_slug: string; starts_at: string; ends_at: string; format: string; manage_token: string }>("appointments", { manage_token: token });
  const a = rows[0];
  if (!a) return new NextResponse("Not found", { status: 404 });
  const service = await getServiceBySlug(a.service_slug);
  const summary = `Virtuous Vogue · ${service?.name.en ?? a.service_slug}`;
  const location = a.format === "virtual" ? "Video call (link sent by email)" : `Virtuous Vogue, ${SITE.city}`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Virtuous Vogue//Bookings//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${a.id}@virtuousvogue`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(a.starts_at)}`,
    `DTEND:${icsDate(a.ends_at)}`,
    `SUMMARY:${summary}`,
    `LOCATION:${location}`,
    `URL:${SITE.url}/book/manage/${a.manage_token}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return new NextResponse(ics, { headers: { "content-type": "text/calendar; charset=utf-8", "content-disposition": 'attachment; filename="virtuous-vogue.ics"' } });
}
