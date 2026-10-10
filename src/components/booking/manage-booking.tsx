"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { addDays, format, startOfDay } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Button } from "@/components/ui/button";
import { ChoiceChip, Notice } from "@/components/ui/form";
import { fetchSlots, manageBooking } from "@/lib/actions/booking";

export function ManageBooking({ token, serviceSlug, format: fmt, startsAt }: { token: string; serviceSlug: string; format: string; startsAt: string }) {
  const t = useTranslations("booking");
  const router = useRouter();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Douala";
  const [mode, setMode] = React.useState<"idle" | "reschedule" | "cancel">("idle");
  const [slots, setSlots] = React.useState<Record<string, { startsAt: string }[]>>({});
  const [pick, setPick] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  // eslint-disable-next-line react-hooks/purity -- 24h cut-off evaluated against the current time
  const late = (new Date(startsAt).getTime() - Date.now()) / 36e5 < 24;

  React.useEffect(() => {
    if (mode !== "reschedule") return;
    const from = startOfDay(new Date());
    fetchSlots({ serviceSlug, format: fmt, from: from.toISOString(), to: addDays(from, 21).toISOString() }).then(setSlots);
  }, [mode, serviceSlug, fmt]);

  const act = async (action: "cancel" | "reschedule") => {
    setBusy(true);
    setMsg(null);
    const res = await manageBooking({ token, action, startsAt: pick ?? undefined });
    setBusy(false);
    if (!res.ok) {
      setMsg(res.error === "late" ? t("policy") : res.error === "slot" ? t("slotTaken") : t("error"));
      return;
    }
    router.refresh();
    setMode("idle");
  };

  if (late) return <Notice>{t("policy")}</Notice>;

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => setMode("reschedule")}>{t("reschedule")}</Button>
        <Button variant="ghost" onClick={() => setMode("cancel")}>{t("cancel")}</Button>
      </div>
      {mode === "reschedule" ? (
        <div className="mt-6">
          <p className="eyebrow text-ink-muted">{t("chooseTime")}</p>
          <div className="mt-3 max-h-80 space-y-4 overflow-y-auto">
            {Object.entries(slots).filter(([, s]) => s.length).map(([day, s]) => (
              <div key={day}>
                <p className="font-display text-sm">{format(new Date(`${day}T12:00:00`), "EEE d MMM")}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {s.map((x) => (
                    <ChoiceChip key={x.startsAt} selected={pick === x.startsAt} onClick={() => setPick(x.startsAt)}>{formatInTimeZone(new Date(x.startsAt), tz, "HH:mm")}</ChoiceChip>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <Button onClick={() => act("reschedule")} disabled={!pick || busy} loading={busy}>{t("reschedule")}</Button>
            <Button variant="ghost" onClick={() => setMode("idle")}>{t("back")}</Button>
          </div>
        </div>
      ) : null}
      {mode === "cancel" ? (
        <div className="mt-6 flex gap-3">
          <Button onClick={() => act("cancel")} loading={busy} disabled={busy}>{t("cancel")}</Button>
          <Button variant="ghost" onClick={() => setMode("idle")}>{t("back")}</Button>
        </div>
      ) : null}
      {msg ? <Notice tone="error" className="mt-4">{msg}</Notice> : null}
    </div>
  );
}
