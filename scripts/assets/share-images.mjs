/**
 * Composes the link-preview (Open Graph) images: an ivory panel carrying the
 * approved wordmark-with-tagline next to a campaign photograph, 1200×630,
 * kept under 300 KB so WhatsApp shows the large preview.
 *
 *   node scripts/assets/share-images.mjs
 */
import sharp from "sharp";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public/og");
const KIT = path.join(ROOT, "assets-src/brand-kit");
const W = 1200, H = 630, PANEL = 500;

async function compose({ photo, focusX = 0.5, focusY = 0.5, out, tone = "ivory" }) {
  const img = sharp(photo);
  const meta = await img.metadata();
  const photoW = W - PANEL;
  // Cover-fit the photograph into the right-hand area around a focus point.
  const scale = Math.max(photoW / meta.width, H / meta.height);
  const sw = Math.round(meta.width * scale), sh = Math.round(meta.height * scale);
  const left = Math.min(Math.max(Math.round(sw * focusX - photoW / 2), 0), sw - photoW);
  const top = Math.min(Math.max(Math.round(sh * focusY - H / 2), 0), sh - H);
  const photoBuf = await img.resize(sw, sh).extract({ left, top, width: photoW, height: H }).toBuffer();

  const panel = tone === "ivory" ? { r: 244, g: 239, b: 231 } : { r: 25, g: 24, b: 22 };
  const mark = tone === "ivory" ? "VV_Wordmark_With_Original_Tagline_ink_transparent.png" : "VV_Primary_Wordmark_white_transparent.png";
  const markW = 360;
  const markBuf = await sharp(path.join(KIT, mark)).trim().resize({ width: markW }).png().toBuffer();
  const markMeta = await sharp(markBuf).metadata();
  // A soft shadow bleeding from the panel into the photograph, so the seam reads as intentional.
  const seam = Buffer.from(`<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#191816" stop-opacity="0.35"/><stop offset="1" stop-color="#191816" stop-opacity="0"/></linearGradient></defs><rect x="${PANEL}" y="0" width="90" height="${H}" fill="url(#g)"/><rect x="${PANEL - 1}" y="0" width="2" height="${H}" fill="#C5AE96" fill-opacity="0.9"/></svg>`);

  await sharp({ create: { width: W, height: H, channels: 3, background: panel } })
    .composite([
      { input: photoBuf, left: PANEL, top: 0 },
      { input: seam, left: 0, top: 0 },
      { input: markBuf, left: Math.round((PANEL - markW) / 2), top: Math.round((H - markMeta.height) / 2) },
    ])
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(path.join(OUT, out));
  const size = (await sharp(path.join(OUT, out)).metadata()).size ?? 0;
  console.log(`✓ ${out} ${size ? `${Math.round(size / 1024)} KB` : ""}`);
}

await compose({ photo: "public/assets/virtuous-vogue/hero/hero-06-staircase-1920.jpg", focusX: 0.5, focusY: 0.5, out: "virtuous-vogue.jpg" });
await compose({ photo: "public/assets/virtuous-vogue/collection/collection-vv02-mulberry-muse-1400.jpg", focusX: 0.5, focusY: 0.22, out: "collection.jpg" });
await compose({ photo: "assets-src/raw/founder-kimbi-rosa.jpg", focusX: 0.5, focusY: 0.38, out: "about.jpg" });
await compose({ photo: "public/assets/virtuous-vogue/hero/hero-07-trench-monolith-1920.jpg", focusX: 0.5, focusY: 0.5, out: "consultations.jpg" });
