"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Camera, Heart, Plus, Trash2, X, MessageCircle, CalendarDays, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox, ChoiceChip, Field, Input, Notice, Select, Textarea } from "@/components/ui/form";
import { uploadPiece, remixCloset, saveOutfit, askVirtuousVogue, type UploadedPiece } from "@/lib/actions/remix";
import type { Outfit, RemixContext, RemixItem } from "@/lib/studio/remix-engine";
import { track } from "@/lib/analytics/client";
import { cn } from "@/lib/utils/cn";

type Piece = RemixItem & { preview: string; storagePath?: string; detected?: boolean };

const CATEGORIES: RemixItem["category"][] = ["top", "bottom", "dress", "outerwear", "shoes", "bag", "accessory", "other"];
const COLOURS = ["ivory", "white", "black", "charcoal", "grey", "navy", "blue", "camel", "beige", "brown", "mulberry", "red", "pink", "olive", "green", "yellow", "orange", "purple", "multi"];
const PATTERNS: NonNullable<RemixItem["pattern"]>[] = ["plain", "stripe", "check", "print", "floral", "heritage", "other"];
const FITS: NonNullable<RemixItem["fit"]>[] = ["fitted", "regular", "relaxed", "oversized"];
const COVERAGE: NonNullable<RemixItem["coverage"]>[] = ["full", "mostly", "balanced", "light"];
const OCCASIONS = ["work", "presentation", "dinner", "wedding", "church", "travel", "weekend", "date", "event", "smart_casual", "formal", "everyday", "custom"] as const;

export function ClosetRemix({ signedIn }: { signedIn: boolean }) {
  const t = useTranslations("studio.remix");
  const tc = useTranslations("common");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [consent, setConsent] = React.useState(false);
  const [pieces, setPieces] = React.useState<Piece[]>([]);
  const [uploading, setUploading] = React.useState(0);
  const [editing, setEditing] = React.useState<string | null>(null);
  const [ctx, setCtx] = React.useState<RemixContext>({ occasion: "work", climate: "hot", timeOfDay: "day", dressCode: "none", modesty: "mostly", shoes: "any" });
  const [outfits, setOutfits] = React.useState<Outfit[] | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [ask, setAsk] = React.useState<Outfit | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const limit = signedIn ? 60 : 10;
  const L = (v: { en: string; fr: string }) => (locale === "fr" ? v.fr : v.en);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    if (!consent) {
      setError(t("consent"));
      return;
    }
    setError(null);
    if (pieces.length === 0) track("remix_start");
    const incoming = Array.from(files).slice(0, Math.max(0, limit - pieces.length));
    if (incoming.length < files.length) setError(t("tooMany"));
    setUploading((n) => n + incoming.length);
    await Promise.all(
      incoming.map(async (file) => {
        const fd = new FormData();
        fd.append("photo", file);
        fd.append("consent", "on");
        const res = await uploadPiece(fd);
        setUploading((n) => n - 1);
        if (!res.ok) {
          setError(res.error === "file" ? t("upload") : t("tooMany"));
          return;
        }
        const p: UploadedPiece = res.piece;
        setPieces((prev) => [
          ...prev,
          {
            id: p.tempId,
            category: (p.guess.category as RemixItem["category"]) ?? "top",
            colour: p.guess.colour,
            colourHex: p.guess.colourHex,
            pattern: p.guess.pattern ?? "plain",
            fit: p.guess.fit ?? "regular",
            coverage: p.guess.coverage ?? "mostly",
            seasons: ["hot", "warm"],
            preview: p.previewDataUrl,
            storagePath: p.storagePath,
            detected: true,
          },
        ]);
      }),
    );
    if (inputRef.current) inputRef.current.value = "";
  };

  const update = (id: string, patch: Partial<Piece>) => setPieces((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const remove = (id: string) => setPieces((prev) => prev.filter((p) => p.id !== id));

  const generate = async () => {
    setError(null);
    if (pieces.length < 3) {
      setError(t("needMore"));
      return;
    }
    setBusy(true);
    try {
      const items = pieces.map((p) => {
        const { preview: _preview, detected: _detected, ...rest } = p;
        void _preview;
        void _detected;
        return rest;
      });
      const res = await remixCloset({ items, context: ctx, locale });
      if (!res.ok) throw new Error(res.error);
      setOutfits(res.outfits);
      document.getElementById("remix-results")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    } catch (e) {
      setError(e instanceof Error && e.message === "tooMany" ? t("tooMany") : tc("errorBody"));
    } finally {
      setBusy(false);
    }
  };

  const pieceById = (id: string) => pieces.find((p) => p.id === id);

  return (
    <div className="space-y-16">
      {/* 1 · Upload */}
      <section aria-labelledby="remix-upload">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs tracking-[0.2em] text-ink-muted">VV / 01</p>
            <h2 id="remix-upload" className="display-sm mt-2">{t("upload")}</h2>
            <p className="mt-2 text-sm text-ink-muted">{signedIn ? t("fullMode") : t("quickMode")}</p>
          </div>
          <span className="font-display text-sm tabular-nums text-ink-muted">
            {pieces.length} / {limit}
          </span>
        </div>
        <Checkbox checked={consent} onChange={(e) => setConsent(e.target.checked)} label={t("consent")} className="mt-5" />
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void onFiles(e.dataTransfer.files);
          }}
          className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5"
        >
          <AnimatePresence>
            {pieces.map((p) => (
              <motion.button
                key={p.id}
                type="button"
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                onClick={() => setEditing(p.id)}
                className={cn("group relative aspect-[4/5] overflow-hidden border bg-porcelain text-left", editing === p.id ? "border-mulberry" : "border-line hover:border-ink")}
                aria-label={`${p.name ?? p.category} · ${t("attributes")}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview} alt="" className="h-full w-full object-contain p-2" />
                <span className="absolute inset-x-0 bottom-0 bg-ivory/90 px-2 py-1.5 text-[0.625rem] uppercase tracking-[0.12em] text-ink">
                  {p.name ?? p.category} {p.colour ? `· ${p.colour}` : ""}
                </span>
                {p.detected ? <span className="absolute left-2 top-2 bg-mulberry px-1.5 py-0.5 text-[0.5625rem] uppercase tracking-[0.12em] text-porcelain">{tc("edit")}</span> : null}
              </motion.button>
            ))}
          </AnimatePresence>
          {Array.from({ length: uploading }).map((_, i) => (
            <div key={`u${i}`} className="skeleton aspect-[4/5]" aria-label={t("detecting")} />
          ))}
          {pieces.length < limit ? (
            <label className="flex aspect-[4/5] cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-line-strong bg-porcelain text-center hover:border-ink">
              <Camera className="size-6 text-mulberry" strokeWidth={1.25} aria-hidden />
              <span className="px-3 text-xs text-ink-muted">{t("dropHint")}</span>
              <input ref={inputRef} type="file" accept="image/*" multiple capture="environment" className="sr-only" onChange={(e) => void onFiles(e.target.files)} />
            </label>
          ) : null}
        </div>
        {error ? <Notice tone="error" className="mt-4">{error}</Notice> : null}

        <AnimatePresence>
          {editing && pieceById(editing) ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 border border-line bg-porcelain p-5 md:p-7"
            >
              <PieceEditor piece={pieceById(editing)!} onChange={(patch) => update(editing, { ...patch, detected: false })} onRemove={() => { remove(editing); setEditing(null); }} onClose={() => setEditing(null)} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      {/* 2 · Context */}
      <section aria-labelledby="remix-context">
        <p className="font-display text-xs tracking-[0.2em] text-ink-muted">VV / 02</p>
        <h2 id="remix-context" className="display-sm mt-2">{t("dressingFor")}</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {OCCASIONS.map((o) => (
            <ChoiceChip key={o} selected={ctx.occasion === o} onClick={() => setCtx((c) => ({ ...c, occasion: o }))}>
              {t(`occasions.${o}`)}
            </ChoiceChip>
          ))}
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label={t("climate")} htmlFor="ctx-climate">
            <Select id="ctx-climate" value={ctx.climate} onChange={(e) => setCtx((c) => ({ ...c, climate: e.target.value as RemixContext["climate"] }))}>
              <option value="hot">28°C+</option>
              <option value="warm">22–28°C</option>
              <option value="mild">15–22°C</option>
              <option value="cool">&lt; 15°C</option>
            </Select>
          </Field>
          <Field label={t("timeOfDay")} htmlFor="ctx-time">
            <Select id="ctx-time" value={ctx.timeOfDay} onChange={(e) => setCtx((c) => ({ ...c, timeOfDay: e.target.value as RemixContext["timeOfDay"] }))}>
              <option value="day">{locale === "fr" ? "Jour" : "Day"}</option>
              <option value="evening">{locale === "fr" ? "Soir" : "Evening"}</option>
            </Select>
          </Field>
          <Field label={t("venue")} htmlFor="ctx-venue">
            <Input id="ctx-venue" value={ctx.venue ?? ""} maxLength={80} onChange={(e) => setCtx((c) => ({ ...c, venue: e.target.value }))} />
          </Field>
          <Field label={t("dressCode")} htmlFor="ctx-code">
            <Select id="ctx-code" value={ctx.dressCode} onChange={(e) => setCtx((c) => ({ ...c, dressCode: e.target.value as RemixContext["dressCode"] }))}>
              {(["none", "casual", "smart_casual", "business", "formal", "black_tie"] as const).map((v) => (
                <option key={v} value={v}>{v.replace("_", " ")}</option>
              ))}
            </Select>
          </Field>
          <Field label={t("modesty")} htmlFor="ctx-modesty">
            <Select id="ctx-modesty" value={ctx.modesty} onChange={(e) => setCtx((c) => ({ ...c, modesty: e.target.value as RemixContext["modesty"] }))}>
              {(["full", "mostly", "balanced", "relaxed"] as const).map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>
          </Field>
          <Field label={t("shoe")} htmlFor="ctx-shoe">
            <Select id="ctx-shoe" value={ctx.shoes} onChange={(e) => setCtx((c) => ({ ...c, shoes: e.target.value as RemixContext["shoes"] }))}>
              {(["any", "flat", "heel", "sandal", "sneaker"] as const).map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="mt-8">
          <Button size="lg" onClick={generate} loading={busy} disabled={busy || pieces.length < 3}>
            {busy ? t("generating") : t("generate")}
          </Button>
        </div>
      </section>

      {/* 3 · Results */}
      {outfits ? (
        <section id="remix-results" aria-labelledby="remix-looks" className="scroll-mt-24">
          <p className="font-display text-xs tracking-[0.2em] text-ink-muted">VV / 03</p>
          <h2 id="remix-looks" className="display-sm mt-2">{t("useWhatYouOwn")}</h2>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            {outfits.map((o, i) => (
              <OutfitCard
                key={o.id}
                index={i}
                outfit={o}
                pieceById={pieceById}
                ctx={ctx}
                signedIn={signedIn}
                onAsk={() => setAsk(o)}
                L={L}
              />
            ))}
          </div>
        </section>
      ) : null}

      <AnimatePresence>
        {ask ? <AskDialog outfit={ask} ctx={ctx} signedIn={signedIn} onClose={() => setAsk(null)} /> : null}
      </AnimatePresence>
    </div>
  );
}

function PieceEditor({ piece, onChange, onRemove, onClose }: { piece: Piece; onChange: (p: Partial<Piece>) => void; onRemove: () => void; onClose: () => void }) {
  const t = useTranslations("studio.remix");
  const tc = useTranslations("common");
  return (
    <div className="grid gap-6 md:grid-cols-12">
      <div className="md:col-span-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={piece.preview} alt="" className="aspect-[4/5] w-full object-contain bg-ivory p-2" />
        {piece.detected ? <p className="mt-2 text-xs text-ink-muted">{t("detected")}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:col-span-9 lg:grid-cols-3">
        <Field label={t("category")} htmlFor={`cat-${piece.id}`}>
          <Select id={`cat-${piece.id}`} value={piece.category} onChange={(e) => onChange({ category: e.target.value as RemixItem["category"] })}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
        <Field label={t("subcategory")} htmlFor={`sub-${piece.id}`}>
          <Input id={`sub-${piece.id}`} value={piece.subcategory ?? ""} maxLength={40} placeholder="blouse, trouser, loafer…" onChange={(e) => onChange({ subcategory: e.target.value })} />
        </Field>
        <Field label={t("colour")} htmlFor={`col-${piece.id}`}>
          <Select id={`col-${piece.id}`} value={piece.colour ?? ""} onChange={(e) => onChange({ colour: e.target.value })}>
            <option value="">—</option>
            {COLOURS.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
        <Field label={t("pattern")} htmlFor={`pat-${piece.id}`}>
          <Select id={`pat-${piece.id}`} value={piece.pattern ?? "plain"} onChange={(e) => onChange({ pattern: e.target.value as RemixItem["pattern"] })}>
            {PATTERNS.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
        <Field label={t("fit")} htmlFor={`fit-${piece.id}`}>
          <Select id={`fit-${piece.id}`} value={piece.fit ?? "regular"} onChange={(e) => onChange({ fit: e.target.value as RemixItem["fit"] })}>
            {FITS.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
        <Field label={t("modesty")} htmlFor={`cov-${piece.id}`}>
          <Select id={`cov-${piece.id}`} value={piece.coverage ?? "mostly"} onChange={(e) => onChange({ coverage: e.target.value as RemixItem["coverage"] })}>
            {COVERAGE.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
        <Field label={t("fabric")} htmlFor={`fab-${piece.id}`}>
          <Input id={`fab-${piece.id}`} value={piece.fabric ?? ""} maxLength={40} onChange={(e) => onChange({ fabric: e.target.value })} />
        </Field>
        <Field label={t("brand")} htmlFor={`brand-${piece.id}`}>
          <Input id={`brand-${piece.id}`} value={(piece as Piece & { brand?: string }).brand ?? ""} maxLength={60} onChange={(e) => onChange({ brand: e.target.value } as Partial<Piece>)} />
        </Field>
        <Field label={t("notes")} htmlFor={`notes-${piece.id}`} className="sm:col-span-2 lg:col-span-1">
          <Input id={`notes-${piece.id}`} value={(piece as Piece & { notes?: string }).notes ?? ""} maxLength={300} onChange={(e) => onChange({ notes: e.target.value } as Partial<Piece>)} />
        </Field>
        <div className="flex items-end gap-4 sm:col-span-2 lg:col-span-3">
          <Checkbox checked={Boolean(piece.favourite)} onChange={(e) => onChange({ favourite: e.target.checked })} label={t("favourite")} />
          <div className="ml-auto flex gap-2">
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <Trash2 className="size-4" aria-hidden /> {tc("remove")}
            </Button>
            <Button variant="secondary" size="sm" onClick={onClose}>
              {tc("done")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OutfitCard({ outfit, index, pieceById, ctx, signedIn, onAsk, L }: { outfit: Outfit; index: number; pieceById: (id: string) => Piece | undefined; ctx: RemixContext; signedIn: boolean; onAsk: () => void; L: (v: { en: string; fr: string }) => string }) {
  const t = useTranslations("studio.remix");
  const locale = useLocale();
  const [hearted, setHearted] = React.useState(false);
  const [name, setName] = React.useState("");
  const [saved, setSaved] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [date, setDate] = React.useState("");

  const persist = async (extra?: { scheduledFor?: string }) => {
    if (!signedIn) return;
    setSaving(true);
    const res = await saveOutfit({ outfit, context: ctx, name: name || undefined, hearted, scheduledFor: extra?.scheduledFor, locale });
    setSaving(false);
    if (res.ok) {
      setSaved(res.id);
      track("remix_outfit_saved");
    }
  };

  return (
    <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05, duration: 0.6 }} className="border border-line bg-porcelain">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="font-display text-xs tracking-[0.2em] text-ink-muted">VV / {String(index + 1).padStart(2, "0")} · {t("useWhatYouOwn")}</span>
        <button type="button" onClick={() => setHearted((h) => !h)} aria-pressed={hearted} aria-label={t("heart")} className="text-mulberry">
          <motion.span animate={hearted ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.35 }} className="inline-block">
            <Heart className={cn("size-5", hearted && "fill-mulberry")} aria-hidden />
          </motion.span>
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 p-4 sm:grid-cols-4">
        {outfit.items.map((p) => {
          const piece = pieceById(p.item.id);
          return (
            <figure key={p.slot + p.item.id} className="aspect-[4/5] bg-ivory">
              {piece ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={piece.preview} alt={`${p.slot}: ${p.item.name ?? p.item.category}`} className="h-full w-full object-contain p-1.5" />
              ) : null}
              <figcaption className="sr-only">{p.slot}</figcaption>
            </figure>
          );
        })}
      </div>
      <div className="px-5 pb-5">
        <p className="eyebrow text-ink-muted">{t("why")}</p>
        <ul className="mt-2 space-y-1.5 font-serif text-sm text-ink-soft">
          {outfit.reasons.map((r, i) => (
            <li key={i}>{L(r)}</li>
          ))}
        </ul>
        {outfit.gap ? (
          <div className="mt-4 border-l-2 border-satin pl-3">
            <p className="eyebrow text-satin-deep">{t("optionalAddition")} · {t("gapTitle")}</p>
            <p className="mt-1 text-sm text-ink-soft">{L(outfit.gap.suggestion)}</p>
          </div>
        ) : (
          <p className="mt-4 eyebrow text-success">{t("noGap")}</p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
          {signedIn ? (
            <>
              <Input aria-label={t("name")} placeholder={t("name")} value={name} maxLength={80} onChange={(e) => setName(e.target.value)} className="max-w-[12rem] py-1.5 text-sm" />
              <Button size="sm" variant="secondary" onClick={() => persist()} loading={saving} disabled={saving || Boolean(saved)}>
                <Bookmark className="size-4" aria-hidden /> {saved ? t("lookbook") : t("save")}
              </Button>
              <label className="inline-flex items-center gap-2 text-xs text-ink-muted">
                <CalendarDays className="size-4" aria-hidden />
                <input type="date" aria-label={t("schedule")} value={date} onChange={(e) => setDate(e.target.value)} onBlur={() => date && persist({ scheduledFor: date })} className="border-b border-line bg-transparent py-1 text-xs" />
              </label>
            </>
          ) : (
            <Button size="sm" variant="secondary" href="/signup?next=/studio/closet-remix">
              {t("save")}
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onAsk}>
            <MessageCircle className="size-4" aria-hidden /> {t("askStylist")}
          </Button>
          <Button size="sm" variant="link" href={`/book?service=style-clarity&occasion=${ctx.occasion}`}>
            {t("bookFromLook")}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

function AskDialog({ outfit, ctx, signedIn, onClose }: { outfit: Outfit; ctx: RemixContext; signedIn: boolean; onClose: () => void }) {
  const t = useTranslations("studio.remix");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [question, setQuestion] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [state, setState] = React.useState<"idle" | "sending" | "sent" | "error">("idle");
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    ref.current?.querySelector<HTMLElement>("textarea")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const send = async () => {
    setState("sending");
    const res = await askVirtuousVogue({ question, email: signedIn ? undefined : email, name: signedIn ? undefined : name, outfit, context: ctx, locale });
    if (res.ok) {
      setState("sent");
      track("ask_vv", { source: "remix" });
    } else setState("error");
  };

  return (
    <motion.div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/60 p-0 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ask-title"
        className="w-full max-w-lg bg-ivory p-6 sm:p-8"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-mulberry">{t("askStylist")}</p>
            <h3 id="ask-title" className="display-sm mt-2">{t("askTitle")}</h3>
            <p className="mt-2 text-sm text-ink-muted">{t("askBody")}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={tc("close")} className="p-1">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        {state === "sent" ? (
          <Notice tone="success" className="mt-6">{t("askSent")}</Notice>
        ) : (
          <div className="mt-6 space-y-4">
            {!signedIn ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={tc("required") === "required" ? "Name" : "Nom"} htmlFor="ask-name">
                  <Input id="ask-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
                </Field>
                <Field label="Email" htmlFor="ask-email" required>
                  <Input id="ask-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Field>
              </div>
            ) : null}
            <Field label={t("askQuestion")} htmlFor="ask-q" required>
              <Textarea id="ask-q" value={question} onChange={(e) => setQuestion(e.target.value)} maxLength={1000} />
            </Field>
            {state === "error" ? <Notice tone="error">{tc("errorBody")}</Notice> : null}
            <Button onClick={send} loading={state === "sending"} disabled={state === "sending" || question.trim().length < 5 || (!signedIn && !email)}>
              <Plus className="size-4" aria-hidden /> {t("askSend")}
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
