/**
 * Colour Lens · deterministic image analysis.
 *
 * Reads skin-tone pixels from a face/neck region, estimates undertone
 * tendency (warm / cool / neutral / uncertain), overall contrast, and the
 * quality of the capture (exposure, colour cast, resolution). The maths is
 * tone-agnostic: it works on hue/chroma relationships, not on lightness, so
 * deep, medium and light skin are read on the same footing. When the capture
 * is unreliable it says so rather than guessing.
 */
import sharp from "sharp";

export type Undertone = "warm" | "cool" | "neutral" | "uncertain";
export type Contrast = "low" | "medium" | "high" | "uncertain";

export type ColourReading = {
  undertone: Undertone;
  contrast: Contrast;
  confidence: number; // 0..1
  quality: { exposure: "ok" | "dark" | "bright"; cast: "ok" | "warm_cast" | "cool_cast" | "colour_cast"; resolution: "ok" | "low"; skinCoverage: number };
  skin: { hex: string; lab: [number, number, number]; hueAngle: number; chroma: number };
  reasons: string[];
};

function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  const lin = (c: number) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const R = lin(r), G = lin(g), B = lin(b);
  const X = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
  const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const Z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}

function isSkinCandidate(r: number, g: number, b: number) {
  // Broad, tone-inclusive skin gate in YCbCr space (covers deep to light skin).
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  return y > 25 && cr > 133 && cr < 180 && cb > 77 && cb < 130 && r > g && g >= b * 0.85;
}

export async function analyseColourImage(buffer: Buffer): Promise<ColourReading> {
  const img = sharp(buffer).rotate();
  const meta = await img.metadata();
  const reasons: string[] = [];
  const width = 320;
  const { data, info } = await img.resize({ width, withoutEnlargement: true }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = info.width * info.height;

  // Global stats: exposure and colour cast on the whole frame
  let sumL = 0, sumA = 0, sumB = 0, dark = 0, bright = 0;
  const labs: [number, number, number][] = [];
  const skinLab: [number, number, number][] = [];
  const skinRgb: [number, number, number][] = [];
  // Sample the central 60% region where a face/neck usually sits
  const x0 = Math.floor(info.width * 0.2), x1 = Math.floor(info.width * 0.8);
  const y0 = Math.floor(info.height * 0.15), y1 = Math.floor(info.height * 0.85);
  for (let y = 0; y < info.height; y += 2) {
    for (let x = 0; x < info.width; x += 2) {
      const i = (y * info.width + x) * 3;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const lab = rgbToLab(r, g, b);
      labs.push(lab);
      sumL += lab[0]; sumA += lab[1]; sumB += lab[2];
      if (lab[0] < 12) dark++;
      if (lab[0] > 95) bright++;
      if (x >= x0 && x < x1 && y >= y0 && y < y1 && isSkinCandidate(r, g, b)) {
        skinLab.push(lab);
        skinRgb.push([r, g, b]);
      }
    }
  }
  const n = labs.length || 1;
  const meanL = sumL / n, meanA = sumA / n, meanB = sumB / n;
  const exposure: ColourReading["quality"]["exposure"] = dark / n > 0.55 ? "dark" : bright / n > 0.45 ? "bright" : "ok";
  let cast: ColourReading["quality"]["cast"] = "ok";
  if (Math.abs(meanA) > 14 || Math.abs(meanB) > 18) cast = meanB > 18 ? "warm_cast" : meanB < -12 ? "cool_cast" : "colour_cast";
  const resolution: ColourReading["quality"]["resolution"] = (meta.width ?? 0) < 480 || (meta.height ?? 0) < 480 ? "low" : "ok";
  const skinCoverage = skinLab.length / ((x1 - x0) * (y1 - y0) / 4 || 1);

  if (exposure !== "ok") reasons.push(`exposure:${exposure}`);
  if (cast !== "ok") reasons.push(`cast:${cast}`);
  if (resolution === "low") reasons.push("resolution:low");
  if (skinCoverage < 0.06) reasons.push("skin:insufficient");

  let confidence = 1;
  if (exposure !== "ok") confidence -= 0.35;
  if (cast !== "ok") confidence -= 0.35;
  if (resolution === "low") confidence -= 0.2;
  if (skinCoverage < 0.06) confidence -= 0.5;
  else if (skinCoverage < 0.12) confidence -= 0.15;
  confidence = Math.max(0, Math.min(1, confidence));

  if (skinLab.length === 0 || confidence < 0.35) {
    return {
      undertone: "uncertain",
      contrast: "uncertain",
      confidence,
      quality: { exposure, cast, resolution, skinCoverage },
      skin: { hex: "#000000", lab: [0, 0, 0], hueAngle: 0, chroma: 0 },
      reasons,
    };
  }

  // Robust skin estimate: median of candidate pixels
  const med = (arr: number[]) => {
    const s = [...arr].sort((a, b) => a - b);
    return s[Math.floor(s.length / 2)];
  };
  const L = med(skinLab.map((l) => l[0]));
  const A = med(skinLab.map((l) => l[1]));
  const Bv = med(skinLab.map((l) => l[2]));
  const hue = (Math.atan2(Bv, A) * 180) / Math.PI; // 0..90 for skin; higher = more yellow (warm), lower = more red/pink (cool)
  const chroma = Math.hypot(A, Bv);
  const rgb = [med(skinRgb.map((p) => p[0])), med(skinRgb.map((p) => p[1])), med(skinRgb.map((p) => p[2]))];
  const hex = `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;

  // Undertone: hue angle is lightness-independent, so deep and light skin are judged alike.
  let undertone: Undertone = "neutral";
  if (hue >= 58) undertone = "warm";
  else if (hue <= 44) undertone = "cool";
  if (chroma < 8) undertone = "uncertain";

  // Contrast: spread between skin lightness and darkest/lightest significant features (hair, eyes, teeth)
  const Ls = labs.map((l) => l[0]).sort((a, b) => a - b);
  const p5 = Ls[Math.floor(Ls.length * 0.05)], p95 = Ls[Math.floor(Ls.length * 0.95)];
  const spread = Math.max(Math.abs(L - p5), Math.abs(p95 - L));
  const contrast: Contrast = spread > 55 ? "high" : spread > 32 ? "medium" : "low";

  return { undertone, contrast, confidence, quality: { exposure, cast, resolution, skinCoverage }, skin: { hex, lab: [L, A, Bv], hueAngle: hue, chroma }, reasons };
}
