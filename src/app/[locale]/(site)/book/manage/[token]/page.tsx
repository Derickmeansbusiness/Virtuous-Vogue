import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { formatInTimeZone } from "date-fns-tz";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { getAdminStore } from "@/lib/data/store";
import { getServiceBySlug } from "@/lib/domain/services";
import { pick } from "@/content/types";
import { ManageBooking } from "@/components/booking/manage-booking";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { robots: { index: false } };

export default async function ManagePage({ params }: { params: Promise<{ locale: string; token: string }> }) {
  const { locale, token } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("booking");
  const current = await getLocale();
  const rows = await getAdminStore().list<{ id: string; service_slug: string; starts_at: string; ends_at: string; time_zone: string; status: string; format: string; guest_email: string }>("appointments", { manage_token: token });
  const a = rows[0];
  if (!a) notFound();
  const service = await getServiceBySlug(a.service_slug);
  const payments = await getAdminStore().list<{ status: string; amount: number; currency: string }>("payments", { appointment_id: a.id });
  const paid = payments.find((p) => p.status === "succeeded");

  return (
    <Section tone="ivory" className="pt-[calc(var(--vv-header-h)+2.5rem)]">
      <Container narrow>
        <Eyebrow>{t("manage")}</Eyebrow>
        <h1 className="display-lg mt-3">{a.status === "cancelled" ? t("cancel") : a.status === "pending_payment" ? t("pendingTitle") : t("confirmedTitle")}</h1>
        <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
          <div className="flex justify-between py-3"><dt className="text-ink-muted">{t("steps.service")}</dt><dd>{service ? pick(service.name, current) : a.service_slug}</dd></div>
          <div className="flex justify-between py-3"><dt className="text-ink-muted">{t("steps.time")}</dt><dd>{formatInTimeZone(new Date(a.starts_at), a.time_zone, "EEEE d MMMM yyyy, HH:mm")} ({a.time_zone})</dd></div>
          <div className="flex justify-between py-3"><dt className="text-ink-muted">{t("steps.format")}</dt><dd>{a.format === "in_person" ? t("inPerson") : a.format === "virtual" ? t("virtual") : t("group")}</dd></div>
          <div className="flex justify-between py-3"><dt className="text-ink-muted">{t("steps.payment")}</dt><dd>{paid ? `${paid.amount.toLocaleString(current)} ${paid.currency} ✓` : t("priceOnRequest")}</dd></div>
          <div className="flex justify-between py-3"><dt className="text-ink-muted">{t("reference")}</dt><dd className="font-mono text-xs">{a.id.slice(0, 8).toUpperCase()}</dd></div>
        </dl>
        <div className="mt-6 flex flex-wrap gap-4">
          <Button href={`/api/bookings/${token}/calendar.ics`} variant="secondary" external>
            .ics
          </Button>
        </div>
        {a.status !== "cancelled" ? (
          <div className="mt-10">
            <ManageBooking token={token} serviceSlug={a.service_slug} format={a.format} startsAt={a.starts_at} />
          </div>
        ) : null}
        <p className="mt-8 text-xs text-ink-muted">{t("policy")}</p>
      </Container>
    </Section>
  );
}
