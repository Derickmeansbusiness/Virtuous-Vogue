#!/usr/bin/env node
/**
 * Virtuous Vogue asset pipeline.
 *
 *  node scripts/assets/build.mjs            # build from assets-src/masters
 *  FETCH=1 node scripts/assets/build.mjs    # first download sources listed in the manifest
 *
 * For every entry in assets-src/manifest.json:
 *  1. (optional) download the source still/video from Higgsfield
 *  2. keep a JPEG master in assets-src/masters (for future re-crops)
 *  3. write responsive AVIF + WebP + JPEG variants to public/assets/virtuous-vogue/<section>/
 *  4. stamp the Virtuous Vogue lockup on every published image/video
 *  5. write src/lib/assets/manifest.generated.json with dimensions + blur placeholders
 */
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { execFileSync } from "node:child_process";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const MANIFEST = path.join(ROOT, "assets-src/manifest.json");
const MASTERS = path.join(ROOT, "assets-src/masters");
const OUT = path.join(ROOT, "public/assets/virtuous-vogue");
const GENERATED = path.join(ROOT, "src/lib/assets/manifest.generated.json");
const BRAND = path.join(ROOT, "public/assets/virtuous-vogue/brand");
const FETCH = process.env.FETCH === "1";
const ONLY = process.env.ONLY ? process.env.ONLY.split(",") : null;

const WIDTHS = { wide: [640, 960, 1280, 1600, 1920, 2560], portrait: [480, 768, 1024, 1400], square: [480, 768, 1024] };
const QUALITY = { avif: 55, webp: 76, jpeg: 80 };

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
mkdirSync(MASTERS, { recursive: true });

async function download(url, dest) {
  if (existsSync(dest)) return;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url}: ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

async function lockupBuffer(tone, width) {
  const svg = path.join(BRAND, `vv-lockup-${tone}.svg`);
  return sharp(svg, { density: 300 }).resize({ width }).png().toBuffer();
}

/** Composite the brand lockup into the chosen corner with a soft shadow for legibility. */
async function stamp(image, meta, entry) {
  if (entry.logo === false) return image;
  const tone = entry.logoTone ?? "ivory";
  const corner = entry.logoCorner ?? "bottom-right";
  const w = Math.max(96, Math.round(meta.width * (entry.logoScale ?? 0.14)));
  const margin = Math.round(meta.width * 0.028);
  const logo = await lockupBuffer(tone, w);
  const lm = await sharp(logo).metadata();
  const shadow = await sharp(logo)
    .ensureAlpha()
    .tint(tone === "ivory" ? "#191816" : "#F4EFE7")
    .blur(3)
    .toBuffer();
  const pos = {
    "bottom-right": { left: meta.width - lm.width - margin, top: meta.height - lm.height - margin },
    "bottom-left": { left: margin, top: meta.height - lm.height - margin },
    "top-right": { left: meta.width - lm.width - margin, top: margin },
    "top-left": { left: margin, top: margin },
  }[corner];
  return image.composite([
    { input: shadow, left: pos.left, top: pos.top, blend: "over" },
    { input: logo, left: pos.left, top: pos.top, blend: "over" },
  ]);
}

async function buildImage(entry) {
  const ext = entry.source.split("?")[0].split(".").pop();
  const raw = path.join(MASTERS, `${entry.id}.source.${ext}`);
  const master = path.join(MASTERS, `${entry.id}.jpg`);
  if (FETCH) await download(entry.source, raw);
  if (!existsSync(master)) {
    if (!existsSync(raw)) throw new Error(`Missing source for ${entry.id}. Run with FETCH=1.`);
    let img = sharp(raw).rotate();
    if (entry.crop) img = img.extract(entry.crop);
    await img.jpeg({ quality: 92, mozjpeg: true }).toFile(master);
  }
  const meta = await sharp(master).metadata();
  const ratio = meta.width / meta.height;
  const kind = ratio > 1.2 ? "wide" : ratio < 0.85 ? "portrait" : "square";
  const widths = WIDTHS[kind].filter((w) => w <= meta.width);
  const dir = path.join(OUT, entry.section);
  mkdirSync(dir, { recursive: true });

  // Stamp once at master resolution, then derive every size from it so the mark scales consistently.
  const stamped = await (await stamp(sharp(master), meta, entry)).toBuffer();
  const variants = [];
  for (const w of widths) {
    for (const fmt of ["avif", "webp", "jpeg"]) {
      const file = path.join(dir, `${entry.id}-${w}.${fmt === "jpeg" ? "jpg" : fmt}`);
      let p = sharp(stamped).resize({ width: w, withoutEnlargement: true });
      p = fmt === "avif" ? p.avif({ quality: QUALITY.avif, effort: 4 }) : fmt === "webp" ? p.webp({ quality: QUALITY.webp }) : p.jpeg({ quality: QUALITY.jpeg, mozjpeg: true, progressive: true });
      await p.toFile(file);
      variants.push({ width: w, format: fmt, src: `/assets/virtuous-vogue/${entry.section}/${path.basename(file)}` });
    }
  }
  const blur = await sharp(master).resize(16).blur(2).webp({ quality: 40 }).toBuffer();
  return {
    id: entry.id,
    section: entry.section,
    width: meta.width,
    height: meta.height,
    aspect: Number((meta.width / meta.height).toFixed(4)),
    widths,
    base: `/assets/virtuous-vogue/${entry.section}/${entry.id}`,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    alt: entry.alt,
    usage: entry.usage,
    dominant: `#${(await sharp(master).resize(1, 1).raw().toBuffer()).toString("hex").slice(0, 6)}`,
  };
}

async function buildVideo(entry) {
  const raw = path.join(MASTERS, `${entry.id}.source.mp4`);
  if (FETCH) await download(entry.source, raw);
  if (!existsSync(raw)) throw new Error(`Missing source for ${entry.id}. Run with FETCH=1.`);
  const dir = path.join(OUT, entry.section);
  mkdirSync(dir, { recursive: true });
  const tone = entry.logoTone ?? "ivory";
  const logoPng = path.join(MASTERS, `${entry.id}.logo.png`);
  const scale = entry.logoScale ?? 0.12;
  const targetW = entry.width ?? 1920;
  await sharp(path.join(BRAND, `vv-lockup-${tone}.svg`), { density: 300 }).resize({ width: Math.round(targetW * scale) }).png().toFile(logoPng);
  const outputs = [];
  const variants = entry.variants ?? [{ suffix: "1080", width: targetW, crf: 24 }, { suffix: "720", width: Math.round(targetW * 0.667), crf: 26 }];
  for (const v of variants) {
    const mp4 = path.join(dir, `${entry.id}-${v.suffix}.mp4`);
    const webm = path.join(dir, `${entry.id}-${v.suffix}.webm`);
    const overlay = entry.logo === false ? "" : `[0:v][1:v]overlay=W-w-(W*0.028):H-h-(W*0.028)[v];[v]`;
    const filter = `${overlay}scale=${v.width}:-2:flags=lanczos,format=yuv420p`;
    const args = ["-y", "-i", raw, ...(entry.logo === false ? [] : ["-i", logoPng]), "-filter_complex", filter.replace(/\[v\]$/, ""), "-an", "-movflags", "+faststart"];
    execFileSync("ffmpeg", [...args, "-c:v", "libx264", "-preset", "slow", "-crf", String(v.crf), "-pix_fmt", "yuv420p", mp4], { stdio: "inherit" });
    execFileSync("ffmpeg", [...args, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", String(v.crf + 8), "-row-mt", "1", webm], { stdio: "inherit" });
    outputs.push({ suffix: v.suffix, width: v.width, mp4: `/assets/virtuous-vogue/${entry.section}/${path.basename(mp4)}`, webm: `/assets/virtuous-vogue/${entry.section}/${path.basename(webm)}` });
  }
  // Poster from the first frame, stamped like a still
  const posterRaw = path.join(MASTERS, `${entry.id}.poster.jpg`);
  execFileSync("ffmpeg", ["-y", "-i", raw, "-frames:v", "1", "-q:v", "2", posterRaw], { stdio: "inherit" });
  const posterEntry = { ...entry, id: `${entry.id}-poster`, source: posterRaw, section: entry.section };
  if (!existsSync(path.join(MASTERS, `${posterEntry.id}.jpg`))) {
    await sharp(posterRaw).jpeg({ quality: 92 }).toFile(path.join(MASTERS, `${posterEntry.id}.jpg`));
  }
  const poster = await buildImage({ ...posterEntry, source: `${posterEntry.id}.jpg` });
  return { id: entry.id, section: entry.section, kind: "video", width: targetW, height: entry.height ?? Math.round(targetW * 9 / 16), outputs, poster, alt: entry.alt, usage: entry.usage };
}

const generated = { images: {}, videos: {}, builtAt: new Date().toISOString() };
for (const entry of manifest.assets) {
  if (ONLY && !ONLY.includes(entry.id)) continue;
  if (entry.status && entry.status !== "approved") continue;
  console.log(`→ ${entry.kind} ${entry.id}`);
  if (entry.kind === "video") generated.videos[entry.id] = await buildVideo(entry);
  else generated.images[entry.id] = await buildImage(entry);
}
if (ONLY && existsSync(GENERATED)) {
  const prev = JSON.parse(readFileSync(GENERATED, "utf8"));
  generated.images = { ...prev.images, ...generated.images };
  generated.videos = { ...prev.videos, ...generated.videos };
}
mkdirSync(path.dirname(GENERATED), { recursive: true });
writeFileSync(GENERATED, JSON.stringify(generated, null, 2));
console.log(`✓ ${Object.keys(generated.images).length} images, ${Object.keys(generated.videos).length} videos`);
