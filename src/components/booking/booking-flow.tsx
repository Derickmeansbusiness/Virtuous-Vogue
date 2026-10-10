"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { addDays, addMonths, endOfMonth, format, startOfMonth, startOfDay, isSameMonth, eachDayOfInterval, getDay } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import type { Service } from "@/content/types";
import { pick } from "@/content/types";
import { Button } from "@/components/ui/button";
import { ChoiceChip, Checkbox, Field, Input, Notice, Textarea } from "@/components/ui/form";
import { fetchSlots, createBooking, checkPayment, type CreateBookingResult } from "@/lib/actions/booking";
import { WhatsAppLink } from "@/components/layout/whatsapp";
import { track } from "@/lib/analytics/client";
import { cn } from "@/lib/utils/cn";
import { EditorialImage } from "@/components/media/editorial-image";

type Step = "service" | "learn" | "format" | "date" | "time" | "details" | "payment" | "confirm";
const ORDER: Step[] = ["service", "learn", "format", "date", "time", "details", "payment", "confirm"];

export function BookingFlow({ services, initialService, methods, user, compassId, outfitId, occasion }: { services: Service[]; initialService?: string; methods: ("mtn_momo" | "orange_money" | "card")[]; user: { name?: string; email: string } | null; compassId?: string; outfitId?: string; occasion?: string }) {
  const t = useTranslations("booking");
  const ts = useTranslations("services");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const tz = React.useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Douala", []);
  const [step, setStep] = React.useState<Step>(initialService ? "learn" : "service");
  const [serviceSlug, setServiceSlug] = React.useState<string | undefined>(initialService);
  const [fmt, setFmt] = React.useState<"in_person" | "virtual" | "group">("virtual");
  const [month, setMonth] = React.useState(startOfMonth(new Date()));
  const [slots, setSlots] = React.useState<Record<string, { startsAt: string; endsAt: string }[]>>({});
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const [date, setDate] = React.useState<string | null>(null);
  const [slot, setSlot] = React.useState<{ startsAt: string; endsAt: string } | null>(null);
  const [details, setDetails] = React.useState({ name: user?.name ?? "", email: user?.email ?? "", phone: "", goals: occasion ? (locale === "fr" ? `Occasion : ${occasion}. ` : `Occasion: ${occasion}. `) : "", attachPassport: Boolean(user) });
  const [method, setMethod] = React.useState<"mtn_momo" | "orange_money" | "card" | "later">(methods[0] ?? "later");
  const [momoPhone, setMomoPhone] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<CreateBookingResult | null>(null);
  const [payState, setPayState] = React.useState<"idle" | "waiting" | "succeeded" | "failed">("idle");
  const service = services.find((s) => s.slug === serviceSlug);
  const idx = ORDER.indexOf(step);

  const go = (s: Step) => {
    setError(null);
    setStep(s);
    track("booking_step", { step: s });
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  React.useEffect(() => {
    track("booking_start");
  }, []);

  React.useEffect(() => {
    if (!service || step !== "date") return;
    let alive = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from a browser API after mount
    setLoadingSlots(true);
    const from = startOfDay(new Date(Math.max(month.getTime(), Date.now())));
    const to = endOfMonth(month);
    fetchSlots({ serviceSlug: service.slug, format: fmt, from: from.toISOString(), to: to.toISOString() })
      .then((s) => alive && setSlots(s))
      .finally(() => alive && setLoadingSlots(false));
    return () => {
      alive = false;
    };
  }, [service, fmt, month, step]);

  React.useEffect(() => {
    if (!result?.ok || result.payment?.kind !== "push") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from a browser API after mount
    setPayState("waiting");
    let tries = 0;
    const id = setInterval(async () => {
      tries++;
      const r = await checkPayment(result.payment!.id);
      if (r.status === "succeeded") {
        setPayState("succeeded");
        track("payment_complete", { method });
        clearInterval(id);
      } else if (r.status === "failed" || r.status === "cancelled" || tries > 60) {
        setPayState("failed");
        clearInterval(id);
      }
    }, 4000);
    return () => clearInterval(id);
  }, [result, method]);

  const submit = async () => {
    if (!service || !slot) return;
    setBusy(true);
    setError(null);
    track("payment_start", { method });
    const res = await createBooking({ serviceSlug: service.slug, format: fmt, startsAt: slot.startsAt, timeZone: tz, name: details.name, email: details.email, phone: details.phone || undefined, goals: details.goals || undefined, attachPassport: details.attachPassport, compassId, outfitId, locale, method, momoPhone: momoPhone || undefined });
    setBusy(false);
    if (!res.ok) {
      setError(res.error === "slot" ? t("slotTaken") : res.error === "payment" ? t("paymentFailed") : t("error"));
      if (res.error === "slot") go("time");
      return;
    }
    setResult(res);
    track("booking_complete", { service: service.slug, format: fmt, method });
    if (res.payment?.kind === "redirect") {
      window.location.href = res.payment.url;
      return;
    }
    go("confirm");
  };

  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const leading = (getDay(startOfMonth(month)) + 6) % 7;
  const price = service?.priceXaf ?? null;
  const deposit = price ? Math.round((price * (service?.depositPercent ?? 50)) / 100) : null;

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      {/* Stepper */}
      <ol className="flex gap-3 overflow-x-auto scrollbar-none lg:col-span-12" aria-label={t("eyebrow")}>
        {ORDER.map((s, i) => (
          <li key={s} className={cn("flex shrink-0 items-center gap-2 text-[0.6875rem] uppercase tracking-[0.18em]", i < idx ? "text-mulberry" : i === idx ? "text-ink" : "text-ink-muted/60")}>
            <span className={cn("flex size-5 items-center justify-center border text-[0.625rem]", i < idx ? "border-mulberry bg-mulberry text-porcelain" : i === idx ? "border-ink" : "border-line")}>{i < idx ? <Check className="size-3" aria-hidden /> : i + 1}</span>
            {t(`steps.${s}`)}
          </li>
        ))}
      </ol>

      <div className="lg:col-span-7">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
            {step === "service" ? (
              <section>
                <h2 className="display-md">{t("chooseService")}</h2>
                <ul className="mt-6 divide-y divide-line border-y border-line">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <button type="button" onClick={() => { setServiceSlug(s.slug); go("learn"); }} className="group flex w-full items-center gap-5 py-5 text-left">
                        <span className="hidden w-16 shrink-0 overflow-hidden sm:block">
                          <EditorialImage id={s.image} className="aspect-[3/4] w-full" sizes="64px" />
                        </span>
                        <span className="flex-1">
                          <span className="font-display text-xs tracking-[0.2em] text-ink-muted">VV / {s.number}</span>
                          <span className="display-sm block transition-colors group-hover:text-mulberry">{pick(s.name, locale)}</span>
                          <span className="mt-1 block text-sm text-ink-soft">{pick(s.short, locale)}</span>
                          <span className="eyebrow mt-2 block text-ink-muted">{s.durationMinutes} min</span>
                        </span>
                        <ChevronRight className="size-5 text-mulberry" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {step === "learn" && service ? (
              <section>
                <p className="font-display text-xs tracking-[0.2em] text-ink-muted">VV / {service.number}</p>
                <h2 className="display-md mt-2">{pick(service.name, locale)}</h2>
                <p className="mt-4 font-serif text-lg text-ink-soft">{pick(service.intro, locale)}</p>
                <div className="mt-8 grid gap-8 sm:grid-cols-2">
                  <div>
                    <h3 className="eyebrow text-ink-muted">{ts("explore")}</h3>
                    <ul className="mt-3 space-y-2 text-sm text-ink-soft">{service.explore.map((x) => <li key={x.en}>{pick(x, locale)}</li>)}</ul>
                  </div>
                  <div>
                    <h3 className="eyebrow text-ink-muted">{ts("receive")}</h3>
                    <ul className="mt-3 space-y-2 text-sm text-ink-soft">{service.receive.map((x) => <li key={x.en}>{pick(x, locale)}</li>)}</ul>
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <Button variant="ghost" onClick={() => go("service")}><ChevronLeft className="size-4" aria-hidden /> {t("change")}</Button>
                  <Button onClick={() => go("format")}>{t("continue")}</Button>
                </div>
              </section>
            ) : null}

            {step === "format" && service ? (
              <section>
                <h2 className="display-md">{t("chooseFormat")}</h2>
                <div className="mt-6 flex flex-wrap gap-3">
                  {service.formats.map((f) => (
                    <ChoiceChip key={f} selected={fmt === f} onClick={() => setFmt(f)}>
                      {f === "in_person" ? t("inPerson") : f === "virtual" ? t("virtual") : t("group")}
                    </ChoiceChip>
                  ))}
                </div>
                <div className="mt-8 flex gap-3">
                  <Button variant="ghost" onClick={() => go("learn")}><ChevronLeft className="size-4" aria-hidden /> {t("back")}</Button>
                  <Button onClick={() => go("date")}>{t("continue")}</Button>
                </div>
              </section>
            ) : null}

            {step === "date" ? (
              <section>
                <h2 className="display-md">{t("chooseDate")}</h2>
                <p className="mt-2 text-xs text-ink-muted">{t("timezone", { tz })}</p>
                <div className="mt-6 flex items-center justify-between">
                  <button type="button" aria-label={t("back")} onClick={() => setMonth((m) => addMonths(m, -1))} disabled={isSameMonth(month, new Date())} className="p-2 disabled:opacity-30"><ChevronLeft className="size-5" aria-hidden /></button>
                  <p className="font-display text-xl">{format(month, "MMMM yyyy")}</p>
                  <button type="button" aria-label={t("continue")} onClick={() => setMonth((m) => addMonths(m, 1))} className="p-2"><ChevronRight className="size-5" aria-hidden /></button>
                </div>
                <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[0.625rem] uppercase tracking-[0.14em] text-ink-muted">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i} className="py-2">{d}</div>)}
                  {Array.from({ length: leading }).map((_, i) => <div key={`l${i}`} />)}
                  {days.map((d) => {
                    const key = format(d, "yyyy-MM-dd");
                    const n = slots[key]?.length ?? 0;
                    const past = d < startOfDay(new Date());
                    const disabled = past || (!loadingSlots && n === 0);
                    return (
                      <button
                        key={key}
                        type="button"
                        disabled={disabled}
                        onClick={() => { setDate(key); setSlot(null); go("time"); }}
                        aria-label={`${format(d, "d MMMM")}${n ? `, ${n}` : `, ${t("unavailable")}`}`}
                        className={cn("aspect-square text-sm transition-colors", loadingSlots && !past ? "skeleton" : "", disabled ? "text-ink-muted/40" : "border border-line hover:border-mulberry hover:text-mulberry", date === key && "border-mulberry bg-mulberry text-porcelain")}
                      >
                        {format(d, "d")}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-8"><Button variant="ghost" onClick={() => go("format")}><ChevronLeft className="size-4" aria-hidden /> {t("back")}</Button></div>
              </section>
            ) : null}

            {step === "time" && date ? (
              <section>
                <h2 className="display-md">{t("chooseTime")}</h2>
                <p className="mt-2 font-display text-lg">{format(new Date(`${date}T12:00:00`), "EEEE d MMMM")}</p>
                {slots[date]?.length ? (
                  <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots[date].map((s) => (
                      <ChoiceChip key={s.startsAt} selected={slot?.startsAt === s.startsAt} onClick={() => setSlot(s)}>
                        {formatInTimeZone(new Date(s.startsAt), tz, "HH:mm")}
                      </ChoiceChip>
                    ))}
                  </div>
                ) : (
                  <Notice className="mt-6">{t("noSlots")}</Notice>
                )}
                <div className="mt-8 flex gap-3">
                  <Button variant="ghost" onClick={() => go("date")}><ChevronLeft className="size-4" aria-hidden /> {t("back")}</Button>
                  <Button onClick={() => go("details")} disabled={!slot}>{t("continue")}</Button>
                </div>
              </section>
            ) : null}

            {step === "details" ? (
              <section>
                <h2 className="display-md">{t("yourDetails")}</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field label={t("name")} htmlFor="b-name" required><Input id="b-name" value={details.name} autoComplete="name" onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))} required /></Field>
                  <Field label={t("email")} htmlFor="b-email" required><Input id="b-email" type="email" value={details.email} autoComplete="email" onChange={(e) => setDetails((d) => ({ ...d, email: e.target.value }))} required /></Field>
                  <Field label={t("phone")} htmlFor="b-phone" className="sm:col-span-2"><Input id="b-phone" type="tel" inputMode="tel" value={details.phone} autoComplete="tel" placeholder="+237 6…" onChange={(e) => setDetails((d) => ({ ...d, phone: e.target.value }))} /></Field>
                  <Field label={t("goals")} htmlFor="b-goals" hint={t("goalsHint")} className="sm:col-span-2"><Textarea id="b-goals" value={details.goals} maxLength={2000} onChange={(e) => setDetails((d) => ({ ...d, goals: e.target.value }))} /></Field>
                </div>
                {user ? (
                  <div className="mt-5 border border-line bg-porcelain p-4">
                    <Checkbox checked={details.attachPassport} onChange={(e) => setDetails((d) => ({ ...d, attachPassport: e.target.checked }))} label={t("linkPassport")} />
                    <p className="mt-2 text-xs text-ink-muted">{t("linkPassportHint")}</p>
                    {compassId ? <p className="eyebrow mt-2 text-mulberry">{t("compassAttached")}</p> : null}
                    {outfitId ? <p className="eyebrow mt-1 text-mulberry">{t("outfitAttached")}</p> : null}
                  </div>
                ) : compassId ? (
                  <p className="eyebrow mt-4 text-mulberry">{t("compassAttached")}</p>
                ) : null}
                <div className="mt-8 flex gap-3">
                  <Button variant="ghost" onClick={() => go("time")}><ChevronLeft className="size-4" aria-hidden /> {t("back")}</Button>
                  <Button onClick={() => go("payment")} disabled={details.name.trim().length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(details.email)}>{t("review")}</Button>
                </div>
              </section>
            ) : null}

            {step === "payment" && service && slot ? (
              <section>
                <h2 className="display-md">{t("steps.payment")}</h2>
                <dl className="mt-6 divide-y divide-line border-y border-line text-sm">
                  <div className="flex justify-between py-3"><dt className="text-ink-muted">{t("total")}</dt><dd className="font-display text-lg">{price ? `${price.toLocaleString(locale)} XAF` : "—"}</dd></div>
                  <div className="flex justify-between py-3"><dt className="text-ink-muted">{t("deposit")}</dt><dd className="font-display text-lg">{deposit ? `${deposit.toLocaleString(locale)} XAF` : "—"}</dd></div>
                  {price ? <div className="flex justify-between py-3"><dt className="text-ink-muted">{t("balance")}</dt><dd className="font-display text-lg">{(price - (deposit ?? 0)).toLocaleString(locale)} XAF</dd></div> : null}
                </dl>
                {!price ? <Notice className="mt-5">{t("priceOnRequest")}</Notice> : null}
                {price ? (
                  <div className="mt-6">
                    <p className="eyebrow text-ink-muted">{t("payWith")}</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {methods.includes("mtn_momo") ? <ChoiceChip selected={method === "mtn_momo"} onClick={() => setMethod("mtn_momo")}>{t("momo")}</ChoiceChip> : null}
                      {methods.includes("orange_money") ? <ChoiceChip selected={method === "orange_money"} onClick={() => setMethod("orange_money")}>{t("orange")}</ChoiceChip> : null}
                      {methods.includes("card") ? <ChoiceChip selected={method === "card"} onClick={() => setMethod("card")}>{t("card")}</ChoiceChip> : null}
                      <ChoiceChip selected={method === "later"} onClick={() => setMethod("later")}>{t("payLater")}</ChoiceChip>
                    </div>
                    {method === "mtn_momo" || method === "orange_money" ? (
                      <Field label={t("momoNumber")} htmlFor="b-momo" hint={t("momoHint")} className="mt-5 max-w-sm" required>
                        <Input id="b-momo" type="tel" inputMode="tel" value={momoPhone} placeholder="6XX XX XX XX" onChange={(e) => setMomoPhone(e.target.value)} required />
                      </Field>
                    ) : null}
                    {method === "later" ? <p className="mt-3 text-xs text-ink-muted">{t("payLaterHint")}</p> : null}
                  </div>
                ) : null}
                {error ? <Notice tone="error" className="mt-5">{error}</Notice> : null}
                <div className="mt-8 flex gap-3">
                  <Button variant="ghost" onClick={() => go("details")}><ChevronLeft className="size-4" aria-hidden /> {t("back")}</Button>
                  <Button onClick={submit} loading={busy} disabled={busy || ((method === "mtn_momo" || method === "orange_money") && momoPhone.replace(/\D/g, "").length < 8)} size="lg">
                    {busy ? t("processing") : price && method !== "later" ? t("pay") : t("confirmFree")}
                  </Button>
                </div>
              </section>
            ) : null}

            {step === "confirm" && result?.ok && service && slot ? (
              <section>
                {result.payment?.kind === "push" && payState === "waiting" ? (
                  <>
                    <h2 className="display-md">{t("processing")}</h2>
                    <Notice className="mt-5">{t("awaitingApproval")}</Notice>
                  </>
                ) : result.payment?.kind === "push" && payState === "failed" ? (
                  <>
                    <h2 className="display-md">{t("pendingTitle")}</h2>
                    <Notice tone="warning" className="mt-5">{t("paymentFailed")}</Notice>
                  </>
                ) : result.payment && payState !== "succeeded" ? (
                  <>
                    <h2 className="display-md">{t("pendingTitle")}</h2>
                    <p className="mt-4 font-serif text-lg text-ink-soft">{t("pendingBody")}</p>
                  </>
                ) : (
                  <>
                    <h2 className="display-md">{result.payment ? t("confirmedTitle") : t("pendingTitle")}</h2>
                    <p className="mt-4 font-serif text-lg text-ink-soft">{result.payment ? t("confirmedBody", { email: details.email }) : t("pendingBody")}</p>
                  </>
                )}
                <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
                  <div className="flex justify-between py-3"><dt className="text-ink-muted">{t("steps.service")}</dt><dd>{pick(service.name, locale)}</dd></div>
                  <div className="flex justify-between py-3"><dt className="text-ink-muted">{t("steps.time")}</dt><dd>{formatInTimeZone(new Date(slot.startsAt), tz, "EEEE d MMMM, HH:mm")} ({tz})</dd></div>
                  <div className="flex justify-between py-3"><dt className="text-ink-muted">{t("reference")}</dt><dd className="font-mono text-xs">{result.appointmentId.slice(0, 8).toUpperCase()}</dd></div>
                </dl>
                <p className="mt-5 text-xs text-ink-muted">{t("policy")}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Button href={`/book/manage/${result.manageToken}`} variant="secondary">{t("manage")}</Button>
                  <WhatsAppLink context={{ kind: "service", service: pick(service.name, locale) }} label={t("whatsappConfirm")} />
                </div>
              </section>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Summary rail */}
      <aside className="lg:col-span-4 lg:col-start-9">
        <div className="sticky top-[calc(var(--vv-header-h)+1.5rem)] border border-line bg-porcelain p-6">
          <p className="eyebrow text-ink-muted">{t("summary")}</p>
          {service ? (
            <div className="mt-4">
              <div className="aspect-[3/2] overflow-hidden">
                <EditorialImage id={service.image} className="h-full w-full" sizes="(min-width:1024px) 30vw, 100vw" />
              </div>
              <p className="display-sm mt-4">{pick(service.name, locale)}</p>
              <ul className="mt-3 space-y-1 text-sm text-ink-soft">
                <li>{service.durationMinutes} min · {fmt === "in_person" ? t("inPerson") : fmt === "virtual" ? t("virtual") : t("group")}</li>
                {slot ? <li>{formatInTimeZone(new Date(slot.startsAt), tz, "EEE d MMM · HH:mm")}</li> : null}
                <li>{price ? `${price.toLocaleString(locale)} XAF` : t("priceOnRequest")}</li>
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink-muted">{t("chooseService")}</p>
          )}
        </div>
      </aside>
    </div>
  );
}
