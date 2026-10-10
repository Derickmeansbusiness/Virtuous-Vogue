// Outlines the Virtuous Vogue wordmark into SVG paths (font-independent)
// and writes the brand lockups used by the site and the asset pipeline.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import opentype from "opentype.js";

const out = "public/assets/virtuous-vogue/brand";
mkdirSync(out, { recursive: true });

const bodoni = opentype.parse(
  toArrayBuffer(readFileSync("node_modules/@fontsource/bodoni-moda/files/bodoni-moda-latin-400-normal.woff")),
);
const bodoniItalic = opentype.parse(
  toArrayBuffer(readFileSync("node_modules/@fontsource/bodoni-moda/files/bodoni-moda-latin-400-italic.woff")),
);
const manrope = opentype.parse(
  toArrayBuffer(readFileSync("node_modules/@fontsource/manrope/files/manrope-latin-600-normal.woff")),
);

function toArrayBuffer(buf) {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

function textPath(font, text, x, y, size, letterSpacing = 0) {
  const path = font.getPath(text, x, y, size, { kerning: true, letterSpacing });
  const bb = path.getBoundingBox();
  return { d: path.toPathData(3), width: bb.x2 - bb.x1, bb };
}

// Monogram (two overlapping V forms), mulberry + satin
const monogram = (ids = "") => `
  <defs><linearGradient id="satin${ids}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D7C3B1"/><stop offset="1" stop-color="#A88D72"/></linearGradient></defs>
  <path d="M6 8h18l22 60 8-22-14-38h18l20 60L96 8h18L84 92H66L56 64 46 92H28z" fill="#672F40"/>
  <path d="M58 8h18l20 60L114 8h-18L78 68z" fill="url(#satin${ids})"/>`;

writeFileSync(`${out}/vv-monogram.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100">${monogram()}</svg>`);

// Stacked wordmark: VIRTUOUS / VOGUE (right-aligned second line), descriptor below
// Bodoni glyph outlines above ~80px trip librsvg, so everything is drawn at 72px and scaled.
function stackedWordmark(color, withDescriptor, withTagline) {
  const size = 72;
  const k = 100 / 72;
  const l1 = textPath(bodoni, "VIRTUOUS", 0, 92 / k, size, 0.02);
  const l2 = textPath(bodoni, "VOGUE", 0, 176 / k, size, 0.02);
  const offset2 = l1.width - l2.width;
  const l2b = textPath(bodoni, "VOGUE", offset2, 176 / k, size, 0.02);
  const parts = [`<path d="${l1.d}" fill="${color}"/>`, `<path d="${l2b.d}" fill="${color}"/>`];
  let height = 196;
  if (withDescriptor) {
    const desc = textPath(manrope, "FASHION STYLING & LIFESTYLE CONSULTANCY", 0, 230 / k, 15.5 / k, 0.28);
    const dx = (l1.width - desc.width) / 2;
    const d2 = textPath(manrope, "FASHION STYLING & LIFESTYLE CONSULTANCY", dx, 230 / k, 15.5 / k, 0.28);
    parts.push(`<path d="${d2.d}" fill="${color}" opacity="0.85"/>`);
    height = 242;
  }
  if (withTagline) {
    const tg = textPath(bodoniItalic, "Virtue Never Goes Out of Style.", 0, 290 / k, 30 / k, 0.01);
    const tx = (l1.width - tg.width) / 2;
    const tg2 = textPath(bodoniItalic, "Virtue Never Goes Out of Style.", tx, 290 / k, 30 / k, 0.01);
    parts.push(`<path d="${tg2.d}" fill="${color}"/>`);
    height = 304;
  }
  return { svg: `<g transform="scale(${k.toFixed(5)})">${parts.join("\n")}</g>`, width: Math.ceil(l1.width * k), height };
}

for (const [name, color] of [["ink", "#191816"], ["ivory", "#F4EFE7"], ["mulberry", "#672F40"]]) {
  const w = stackedWordmark(color, true, false);
  writeFileSync(
    `${out}/vv-wordmark-${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w.width} ${w.height}">${w.svg}</svg>`,
  );
  const full = stackedWordmark(color, true, true);
  writeFileSync(
    `${out}/vv-wordmark-tagline-${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${full.width} ${full.height}">${full.svg}</svg>`,
  );
  // Horizontal lockup: monogram + single-line wordmark (used as the image stamp)
  const line = textPath(bodoni, "VIRTUOUS VOGUE", 140, 76, 72, 0.04);
  const lockW = Math.ceil(150 + line.width + 8);
  writeFileSync(
    `${out}/vv-lockup-${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lockW} 100"><g transform="translate(0 0)">${monogram(name)}</g><path d="${line.d}" fill="${color}"/></svg>`,
  );
}
console.log("brand files written");
