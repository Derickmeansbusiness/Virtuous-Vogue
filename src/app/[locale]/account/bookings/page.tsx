import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { formatInTimeZone } from "date-fns-tz";
import { requireUser } from "@/lib/auth/session";
import { getPassport } from "@/lib/domain/passport";
import { listServices } from "@/lib/domain/services";
import { pick } from "@/content/types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Bookings", robots: { index: false } };

export default async function BookingsPage() {
  const user = await requireUser();
  const t = await getTranslations("account.bookings");
  const b = await getTranslations("booking");
  const c = await getTranslations("cta");
  const locale = await getLocale();
  const [p, services] = await Promise.all([getPassport(user.id), listServices()]);
  const name = (slug: string) => { const s = services.find((x) => x.slug === slug); return s ? pick(s.name, locale) : slug; };
  const upcoming = p.appointments.filter((a) => new Date(a.starts_at) >= new Date() && a.status !== "cancelled");
  const past = p.appointments.filter((a) => new Date(a.starts_at) < new Date() || a.status === "cancelled").reverse();
  const Row = ({ a }: { a: (typeof p.appointments)[number] }) => (
    <li className="grid gap-2 py-4 sm:grid-cols-12 sm:items-center">
      <div className="sm:col-span-5"><p className="display-sm">{name(a.service_slug)}</p><p className="text-xs text-ink-muted">{a.format === "in_person" ? b("inPerson") : a.format === "virtual" ? b("virtual") : b("group")}</p></div>
      <p className="text-sm sm:col-span-4">{formatInTimeZone(new Date(a.starts_at), a.time_zone, "EEE d MMM yyyy · HH:mm")}</p>
      <div className="flex items-center justify-between gap-3 sm:col-span-3 sm:justify-end"><span className="eyebrow text-ink-muted">{t(`status.${a.status}`)}</span><Button href={`/book/manage/${a.manage_token}`} variant="link">{b("manage")}</Button></div>
    </li>
  );
  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="display-lg">{t("title")}</h1></div><Button href="/book">{c("book")}</Button></header>
      <section><p className="eyebrow text-mulberry">{t("upcoming")}</p>{upcoming.length ? <ul className="mt-3 divide-y divide-line border-y border-line">{upcoming.map((a) => <Row key={a.id} a={a} />)}</ul> : <EmptyState className="mt-3" title={t("noUpcoming")} action={<Button href="/book" size="sm">{c("book")}</Button>} />}</section>
      {past.length ? <section><p className="eyebrow text-ink-muted">{t("past")}</p><ul className="mt-3 divide-y divide-line border-y border-line">{past.map((a) => <Row key={a.id} a={a} />)}</ul></section> : null}
    </div>
  );
}
