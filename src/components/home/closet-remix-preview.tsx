"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Section, Container } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { EditorialImage } from "@/components/media/editorial-image";
import { cn } from "@/lib/utils/cn";

/**
 * Interactive "Shop Your Closet" explainer. A small demo wardrobe of
 * seven pieces; tapping a slot cycles through what the client already
 * owns and the look caption updates. Everything here is illustrative
 * (colour blocks, not product photos) and clearly from the client's rail.
 */
type Piece = { id: string; label: { en: string; fr: string }; colour: string; texture?: "silk" | "wool" | "cotton" | "leather" };
type Slot = "top" | "bottom" | "layer" | "shoe";

const closet: Record<Slot, Piece[]> = {
  top: [
    { id: "ivory-knit", label: { en: "Ivory knit", fr: "Maille ivoire" }, colour: "#EFE6D6", texture: "wool" },
    { id: "white-shirt", label: { en: "White cotton shirt", fr: "Chemise blanche" }, colour: "#FAF8F2", texture: "cotton" },
    { id: "mulberry-blouse", label: { en: "Mulberry silk blouse", fr: "Blouse en soie mûre" }, colour: "#672F40", texture: "silk" },
  ],
  bottom: [
    { id: "black-wide", label: { en: "Black wide-leg trousers", fr: "Pantalon large noir" }, colour: "#1E1C1A", texture: "wool" },
    { id: "stone-skirt", label: { en: "Stone midi skirt", fr: "Jupe midi pierre" }, colour: "#C9BBA6", texture: "cotton" },
    { id: "camel-trouser", label: { en: "Camel trousers", fr: "Pantalon camel" }, colour: "#B48A5A", texture: "wool" },
  ],
  layer: [
    { id: "none", label: { en: "No layer", fr: "Sans superposition" }, colour: "transparent" },
    { id: "camel-coat", label: { en: "Camel wool coat", fr: "Manteau camel" }, colour: "#A8784C", texture: "wool" },
    { id: "navy-blazer", label: { en: "Navy blazer", fr: "Blazer marine" }, colour: "#1F2A44", texture: "wool" },
  ],
  shoe: [
    { id: "tan-loafer", label: { en: "Tan loafers", fr: "Mocassins fauve" }, colour: "#8B5A2B", texture: "leather" },
    { id: "black-flat", label: { en: "Black pointed flats", fr: "Ballerines noires" }, colour: "#121110", texture: "leather" },
  ],
};

const textures: Record<NonNullable<Piece["texture"]>, string> = {
  silk: "bg-[linear-gradient(120deg,rgba(255,255,255,0.35),rgba(255,255,255,0)_40%,rgba(0,0,0,0.08)_70%,rgba(255,255,255,0.2))]",
  wool: "bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.05)_0_2px,transparent_2px_6px)]",
  cotton: "bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.03)_0_1px,transparent_1px_4px)]",
  leather: "bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_55%)]",
};

export function ClosetRemixPreview({ locale }: { locale: string }) {
  const t = useTranslations("home.closet");
  const c = useTranslations("cta");
  const reduce = useReducedMotion();
  const [idx, setIdx] = React.useState<Record<Slot, number>>({ top: 0, bottom: 0, layer: 0, shoe: 0 });
  const [lookNo, setLookNo] = React.useState(1);

  const cycle = (slot: Slot) => {
    setIdx((prev) => ({ ...prev, [slot]: (prev[slot] + 1) % closet[slot].length }));
    setLookNo((n) => n + 1);
  };
  const pieceAt = (slot: Slot) => closet[slot][idx[slot]];
  const label = (p: Piece) => (locale === "fr" ? p.label.fr : p.label.en);
  const slots: { slot: Slot; className: string; shape: string }[] = [
    { slot: "layer", className: "left-[6%] top-[8%] h-[62%] w-[52%]", shape: "rounded-t-[42%]" },
    { slot: "top", className: "left-[22%] top-[12%] h-[34%] w-[40%]", shape: "rounded-t-[40%]" },
    { slot: "bottom", className: "left-[24%] top-[45%] h-[44%] w-[36%]", shape: "rounded-b-[8%]" },
    { slot: "shoe", className: "left-[30%] top-[88%] h-[7%] w-[24%]", shape: "rounded-full" },
  ];

  return (
    <Section tone="satin" id="shop-your-closet" className="overflow-hidden">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <Reveal>
              <Eyebrow>{t("eyebrow")}</Eyebrow>
              <h2 className="display-lg mt-5">
                {t("title1")} <span className="italic text-mulberry">{t("title2")}</span>
              </h2>
              <p className="mt-6 max-w-md font-serif text-lg text-ink-soft">{t("body")}</p>
            </Reveal>
            <Reveal delay={0.1} className="mt-8 border-t border-line-strong/60 pt-6">
              <p className="font-display text-xs tracking-[0.2em] text-ink-muted">
                {t("look")} {String(lookNo).padStart(2, "0")} · 4 {t("ofYours")}
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                {(["layer", "top", "bottom", "shoe"] as Slot[]).map((s) => {
                  const p = pieceAt(s);
                  return (
                    <li key={s} className="flex items-center gap-3">
                      <span aria-hidden className="size-3 border border-ink/10" style={{ background: p.colour === "transparent" ? "repeating-linear-gradient(45deg,#ddd 0 2px,#fff 2px 4px)" : p.colour }} />
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span key={p.id} initial={reduce ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }}>
                          {label(p)}
                        </motion.span>
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
              <p className="eyebrow mt-4 text-ink-muted">{t("swapHint")}</p>
            </Reveal>
            <Reveal delay={0.15} className="mt-10">
              <Button href="/studio/closet-remix" size="lg">
                {c("tryRemix")}
              </Button>
            </Reveal>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-7 col-start-1 md:col-span-6">
                <div className="relative aspect-[3/4] border border-ink/10 bg-porcelain">
                  <span className="absolute left-4 top-4 font-display text-xs tracking-[0.2em] text-ink-muted">VV / {t("look").toUpperCase()}</span>
                  {slots.map(({ slot, className, shape }) => {
                    const p = pieceAt(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => cycle(slot)}
                        aria-label={`${label(p)} — ${t("swapHint")}`}
                        className={cn("absolute group focus-visible:outline-2 focus-visible:outline-mulberry", className)}
                      >
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={p.id}
                            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 6 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -6 }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className={cn("block h-full w-full shadow-card", shape, p.texture ? textures[p.texture] : "", p.colour === "transparent" && "border border-dashed border-ink/20 shadow-none")}
                            style={{ backgroundColor: p.colour === "transparent" ? "transparent" : p.colour }}
                          />
                        </AnimatePresence>
                        <span className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full whitespace-nowrap bg-ink px-2 py-1 text-[0.625rem] uppercase tracking-[0.14em] text-ivory opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                          {label(p)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="col-span-5 col-start-8 mt-12 md:col-span-6 md:col-start-7">
                <div className="aspect-[4/3]">
                  <EditorialImage id="studio-closet-remix" className="h-full w-full" sizes="(min-width:1024px) 30vw, 45vw" />
                </div>
                <p className="mt-3 text-xs text-ink-muted">{t("ofYours")} · {t("optional").toLowerCase()} = 0</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
