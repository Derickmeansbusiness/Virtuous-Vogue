#!/usr/bin/env node
/**
 * Visual QA: scrolls each key route to trigger reveals, then captures desktop,
 * mobile and reduced-motion screenshots and reports console/page errors.
 *   pnpm build && pnpm start &  then:  pnpm qa:shots [outDir] [baseUrl]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const out = process.argv[2] ?? ".qa/shots";
const base = process.argv[3] ?? "http://localhost:3000";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const pages = [["home", "/"], ["home-fr", "/fr"], ["studio", "/studio"], ["compass", "/studio/compass"], ["colour", "/studio/colour-lens"], ["remix", "/studio/closet-remix"], ["services", "/services"], ["service", "/services/colour-harmony"], ["book", "/book?service=style-clarity"], ["magazine", "/magazine"], ["article", "/magazine/what-does-modest-elegance-actually-mean"], ["about", "/about"], ["login", "/login"], ["notfound", "/nope"]];
let failed = false;
for (const [vp, w, h, rm] of [["desktop", 1440, 900, "no-preference"], ["mobile", 390, 844, "no-preference"], ["reduced", 1440, 900, "reduce"]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: rm });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 160)));
  page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("404")) errors.push(m.text().slice(0, 160)); });
  for (const [name, path] of pages) {
    if (vp === "reduced" && !["home", "about"].includes(name)) continue;
    await page.goto(`${base}${path}`, { waitUntil: "networkidle", timeout: 60000 });
    const total = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y <= total; y += 500) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(150); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${out}/${vp}-${name}.jpg`, fullPage: true, type: "jpeg", quality: 60 });
  }
  console.log(`${vp}: ${errors.length ? errors.join("\n  ") : "no errors"}`);
  if (errors.length) failed = true;
  await ctx.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
