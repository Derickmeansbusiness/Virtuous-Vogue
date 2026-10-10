"use client";

import * as React from "react";
import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Camera, Trash2, Upload } from "lucide-react";
import { analyseColourPhoto, deleteColourImage, type ColourLensState } from "@/lib/actions/colour-lens";
import { Button } from "@/components/ui/button";
import { Checkbox, Notice } from "@/components/ui/form";
import { PaletteStrip } from "./palette-strip";
import { Reveal } from "@/components/motion/reveal";
import { track } from "@/lib/analytics/client";
import { cn } from "@/lib/utils/cn";

const initial: ColourLensState = { status: "idle" };

export function ColourLens({ signedIn }: { signedIn: boolean }) {
  const t = useTranslations("studio.colour");
  const c = useTranslations("cta");
  const locale = useLocale();
  const [state, action, pending] = useActionState(analyseColourPhoto, initial);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string>("");
  const [dragging, setDragging] = React.useState(false);
  const [deleted, setDeleted] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const tips = t.raw("tips") as string[];

  React.useEffect(() => {
    if (state.status === "ok") track("colour_lens_complete", { undertone: state.reading.undertone, contrast: state.reading.contrast });
  }, [state]);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    track("colour_lens_start");
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && inputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      inputRef.current.files = dt.files;
      onFile(file);
    }
  };

  if (state.status === "ok") {
    const { reading, guidance } = state;
    return (
      <Reveal className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="eyebrow inline-block border border-mulberry px-2 py-1 text-mulberry">{t("badge")}</span>
          {preview ? (
            <div className="mt-6 aspect-[4/5] overflow-hidden bg-ivory-deep">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="" className="h-full w-full object-cover" />
            </div>
          ) : null}
          <p className="mt-4 font-serif text-base text-ink-soft">{guidance.summary}</p>
          <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-4 text-sm">
            <div>
              <dt className="eyebrow text-ink-muted">{t("undertone")}</dt>
              <dd className="mt-1 font-display text-xl capitalize">{t(reading.undertone)}</dd>
            </div>
            <div>
              <dt className="eyebrow text-ink-muted">{t("contrast")}</dt>
              <dd className="mt-1 font-display text-xl capitalize">{reading.contrast === "uncertain" ? t("uncertain") : t(reading.contrast)}</dd>
            </div>
            <div>
              <dt className="eyebrow text-ink-muted">{t("confidence")}</dt>
              <dd className="mt-1 font-display text-xl">{Math.round(reading.confidence * 100)}%</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {state.imageStored && !deleted ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  const res = await deleteColourImage({ id: state.id });
                  if (res.ok) setDeleted(true);
                }}
              >
                <Trash2 className="size-4" aria-hidden /> {t("deleteImage")}
              </Button>
            ) : null}
            {deleted ? <p className="text-xs text-success">{t("deleted")}</p> : null}
            {!signedIn ? (
              <Button href={`/signup?next=/account/passport`} variant="secondary" size="sm">
                {t("save")}
              </Button>
            ) : (
              <p className="text-xs text-ink-muted">{t("saved")}</p>
            )}
          </div>
        </div>
        <div className="space-y-10 lg:col-span-6 lg:col-start-7">
          {[
            { title: t("families"), swatches: guidance.families },
            { title: t("neutrals"), swatches: guidance.neutrals },
            { title: t("accents"), swatches: guidance.accents },
            { title: t("careful"), swatches: guidance.testCarefully },
          ].map((group) => (
            <section key={group.title}>
              <h3 className="eyebrow text-ink-muted">{group.title}</h3>
              <PaletteStrip colours={group.swatches.map((s) => s.hex)} labels={group.swatches.map((s) => s.name)} className="mt-3" />
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
                {group.swatches.map((s) => (
                  <li key={s.hex + s.name}>{s.name}</li>
                ))}
              </ul>
            </section>
          ))}
          <section>
            <h3 className="eyebrow text-ink-muted">{t("metals")}</h3>
            <p className="mt-2 font-serif text-base text-ink-soft">{guidance.metals}</p>
          </section>
          <section>
            <h3 className="eyebrow text-ink-muted">{t("combinations")}</h3>
            <ul className="mt-2 space-y-1 font-serif text-base text-ink-soft">
              {guidance.combinations.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <div className="border-t border-line pt-8">
            <Button href="/book?service=colour-harmony" size="lg">
              {c("refinePalette")}
            </Button>
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <form action={action} className="grid gap-12 lg:grid-cols-12">
      <input type="hidden" name="locale" value={locale} />
      <div className="lg:col-span-5">
        <h2 className="display-sm">{t("tipsTitle")}</h2>
        <ol className="mt-5 space-y-3 border-t border-line pt-5 font-serif text-base text-ink-soft">
          {tips.map((tip, i) => (
            <li key={tip} className="flex gap-4">
              <span className="font-display text-xs tracking-[0.2em] text-ink-muted">0{i + 1}</span>
              <span>{tip}</span>
            </li>
          ))}
        </ol>
        <div className="mt-8 border border-line bg-porcelain p-5">
          <h3 className="eyebrow text-mulberry">{t("consentTitle")}</h3>
          <p className="mt-2 text-sm text-ink-soft">{t("consentBody")}</p>
          <Checkbox name="consent" required label={t("consent")} className="mt-4" />
          {signedIn ? <Checkbox name="keep" label={t("save")} className="mt-3" /> : null}
          <p className="mt-3 text-xs text-ink-muted">{t("privacyNote")}</p>
        </div>
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <label
          htmlFor="colour-photo"
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "relative flex aspect-[4/5] cursor-pointer flex-col items-center justify-center gap-4 border border-dashed text-center transition-colors",
            dragging ? "border-mulberry bg-mulberry-tint" : "border-line-strong bg-porcelain hover:border-ink",
          )}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <>
              <Camera className="size-8 text-mulberry" strokeWidth={1.25} aria-hidden />
              <span className="display-sm px-6">{t("upload")}</span>
              <span className="px-8 text-sm text-ink-muted">{t("dropHint")}</span>
            </>
          )}
          <input
            ref={inputRef}
            id="colour-photo"
            name="photo"
            type="file"
            accept="image/*"
            capture="user"
            className="sr-only"
            onChange={(e) => onFile(e.target.files?.[0])}
            required
          />
        </label>
        {fileName ? <p className="mt-2 truncate text-xs text-ink-muted">{fileName}</p> : null}
        {state.status === "unclear" ? (
          <Notice tone="warning" className="mt-4">
            <p className="font-semibold">{t("unclear")}</p>
            <p className="mt-1">{t("unclearBody")}</p>
          </Notice>
        ) : null}
        {state.status === "error" ? (
          <Notice tone="error" className="mt-4">
            {state.code === "consent" ? t("consent") : state.code === "file" ? t("upload") : t("unclearBody")}
          </Notice>
        ) : null}
        <div className="mt-6 flex items-center gap-4">
          <Button type="submit" size="lg" loading={pending} disabled={pending}>
            <Upload className="size-4" aria-hidden /> {pending ? t("analysing") : t("analyse")}
          </Button>
        </div>
      </div>
    </form>
  );
}
