"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "@/i18n/navigation";
import { questions, scoreAnswers, isComplete, type Answers, type Question } from "@/lib/studio/compass-model";
import { ChoiceChip, Input, Textarea, Notice } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { saveCompassResult } from "@/lib/actions/compass";
import { track } from "@/lib/analytics/client";
import { cn } from "@/lib/utils/cn";

const STORAGE_KEY = "vv.compass.draft";

export function CompassWizard() {
  const t = useTranslations("studio.compass");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Answers>({});
  const [dir, setDir] = React.useState<1 | -1>(1);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const started = React.useRef(false);

  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { step: number; answers: Answers };
        // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from a browser API after mount
        setAnswers(parsed.answers ?? {});
        // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from a browser API after mount
        setStep(Math.min(parsed.step ?? 0, questions.length - 1));
      }
    } catch {}
  }, []);

  React.useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers }));
    } catch {}
  }, [step, answers]);

  const q = questions[step];
  const total = questions.length;
  const pct = Math.round(((step + 1) / total) * 100);
  const L = (v: { en: string; fr: string }) => (locale === "fr" ? v.fr : v.en);

  const answered = (question: Question) => {
    const a = answers[question.key];
    if (question.optional) return true;
    if (question.kind === "words") return Array.isArray(a) && a.filter((w) => w?.trim()).length === 3;
    if (question.kind === "multi") return Array.isArray(a) && a.length > 0;
    return typeof a === "string" && a.length > 0;
  };

  const set = (key: string, value: string | string[]) => {
    if (!started.current) {
      started.current = true;
      track("compass_start");
    }
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const next = async () => {
    setError(null);
    if (step < total - 1) {
      setDir(1);
      setStep((s) => s + 1);
      return;
    }
    if (!isComplete(answers)) {
      setError(t("incomplete"));
      return;
    }
    setSaving(true);
    try {
      const result = scoreAnswers(answers);
      const res = await saveCompassResult({ answers, result, locale });
      if (!res.ok) throw new Error(res.error);
      track("compass_complete", { primary: result.primary });
      sessionStorage.removeItem(STORAGE_KEY);
      router.push(`/studio/compass/result/${res.id}`);
    } catch (e) {
      console.error(e);
      setError(t("saveError"));
      setSaving(false);
    }
  };

  const back = () => {
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between text-xs">
        <span className="font-display tracking-[0.2em] text-ink-muted">
          {String(step + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span className="eyebrow text-ink-muted">{t("estimate")}</span>
      </div>
      <div className="mt-3 h-px w-full bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={t("progress")}>
        <motion.div className="h-px bg-mulberry" animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
      </div>

      <div className="relative mt-12 min-h-[22rem]">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.fieldset
            key={q.key}
            custom={dir}
            initial={{ opacity: 0, x: dir * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="border-0 p-0"
          >
            <legend className="display-md max-w-2xl">{L(q.title)}</legend>
            {q.help ? <p className="mt-3 max-w-xl text-sm text-ink-muted">{L(q.help)}</p> : null}
            {q.optional ? <p className="eyebrow mt-2 text-ink-muted">{tc("optional")}</p> : null}

            <div className="mt-8">
              {q.kind === "single" ? (
                <div className="flex flex-wrap gap-3">
                  {q.options.map((o) => (
                    <ChoiceChip key={o.value} selected={answers[q.key] === o.value} onClick={() => set(q.key, o.value)}>
                      {L(o.label)}
                    </ChoiceChip>
                  ))}
                </div>
              ) : null}
              {q.kind === "multi" ? (
                <div>
                  <div className="flex flex-wrap gap-3">
                    {q.options.map((o) => {
                      const current = (answers[q.key] as string[] | undefined) ?? [];
                      const selected = current.includes(o.value);
                      const full = q.max ? current.length >= q.max : false;
                      return (
                        <ChoiceChip
                          key={o.value}
                          selected={selected}
                          disabled={!selected && full}
                          onClick={() => set(q.key, selected ? current.filter((v) => v !== o.value) : [...current, o.value])}
                        >
                          {L(o.label)}
                        </ChoiceChip>
                      );
                    })}
                  </div>
                  {q.max ? <p className="eyebrow mt-3 text-ink-muted">{t("chooseUpTo", { count: q.max })}</p> : null}
                </div>
              ) : null}
              {q.kind === "words" ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  {[0, 1, 2].map((i) => {
                    const current = (answers[q.key] as string[] | undefined) ?? ["", "", ""];
                    return (
                      <Input
                        key={i}
                        aria-label={`${L(q.title)} ${i + 1}`}
                        value={current[i] ?? ""}
                        maxLength={24}
                        placeholder={t(`wordPlaceholder${i + 1}` as "wordPlaceholder1")}
                        onChange={(e) => {
                          const nextWords = [...current];
                          nextWords[i] = e.target.value;
                          set(q.key, nextWords);
                        }}
                      />
                    );
                  })}
                </div>
              ) : null}
              {q.kind === "text" ? (
                <Textarea
                  aria-label={L(q.title)}
                  value={(answers[q.key] as string) ?? ""}
                  placeholder={q.placeholder ? L(q.placeholder) : undefined}
                  maxLength={400}
                  onChange={(e) => set(q.key, e.target.value)}
                />
              ) : null}
            </div>
          </motion.fieldset>
        </AnimatePresence>
      </div>

      {error ? <Notice tone="error" className="mt-6">{error}</Notice> : null}

      <div className={cn("mt-10 flex items-center justify-between gap-4 border-t border-line pt-6")}>
        <Button variant="ghost" onClick={back} disabled={step === 0 || saving}>
          {tc("back")}
        </Button>
        <Button onClick={next} disabled={!answered(q) || saving} loading={saving}>
          {step === total - 1 ? t("seeResult") : tc("continue")}
        </Button>
      </div>
    </div>
  );
}
