# Visual asset library

Source: Higgsfield Soul 2.0 (stills, 2k) and Seedance 2.5 (video), generated under the account owner's subscription, art-directed and individually reviewed. 38 approved assets (36 stills, 2 videos); 25 generations rejected during review.

**Rights.** Generated for Virtuous Vogue. The women depicted are synthetic and are not clients; the footer and Terms say so. No third-party photography is used anywhere. The founder's photograph is deliberately absent until her approved image is supplied.

**Standards applied to every asset**
- No exposed skin beyond face, neck, hands and forearms. No suggestive posing. Fully clothed, covered shoulders.
- No baked-in lettering, logos or captions in the source image; the Virtuous Vogue lockup is applied by the pipeline.
- No invented clients, testimonials, press or awards.
- Diverse African and global skin tones rendered with faithful undertones and natural texture.

## Pipeline

`assets-src/manifest.json` → `scripts/assets/build.mjs` → `public/assets/virtuous-vogue/<section>/<id>-<width>.jpg` + `src/lib/assets/manifest.generated.json` (dimensions, blur placeholder, dominant colour).

- Sources are fetched by job id from Higgsfield (`FETCH=1`), never committed; a JPEG master is kept as a local build cache in `assets-src/masters/` (git-ignored).
- Every published still and video frame carries the approved Virtuous Vogue lockup (`assets-src/brand-kit`), composited bottom-right at 14% of the image width (12% for video) with a soft contrast halo. Tone (ink or white) is set per asset in the manifest.
- Outputs are JPEG at two widths (1200/1920 wide, 900/1400 portrait, 800/1200 square); `next/image` serves AVIF/WebP and exact device sizes at request time, so nothing heavier is committed. Total library: ~19 MB.
- Video: H.264 (CRF 24/26, slow preset, faststart) and VP9 WebM at 1080p and 720p (mobile: 720p/480p), muted, loopable, with a stamped poster frame. Entries with `loop: "crossfade"` are made seamless first: the opening `loopFade` seconds are dropped and the tail is dissolved into them, so the last frame equals the first and the browser's native loop shows no jump. The hero only attaches video on fast connections without data-saver or reduced-motion; the poster always renders first.
- The GitHub Actions workflow `.github/workflows/assets.yml` rebuilds everything on demand and commits the results, so the library can be regenerated or extended from any machine.

## To replace or add an asset

1. Generate or photograph the new image (follow the standards above; no lettering, fully clothed).
2. Add or edit its entry in `assets-src/manifest.json` (id, section, source URL or path, alt text, usage, `logoTone`, optional `logoCorner`/`logoScale`/`logoInsetX` (wider side margin for portrait assets that phones crop)/`crop`).
3. Run `FETCH=1 ONLY=<id> pnpm assets:build` locally, or dispatch the workflow with the id in the `only` input.
4. Reference it in code with `<EditorialImage id="<id>" />`.

## Inventory

| id | kind | section | aspect | source size | outputs | assigned usage | job |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `hero-01-woman-before-wardrobe` | image | hero | 16:9 | 2048×1152 | 1200w, 1920w | Homepage hero concept 1 (desktop), Open Graph image | `7a80a939` |
| `hero-01-woman-before-wardrobe-mobile` | image | mobile | 9:16 | 1152×2048 | 900w | Homepage hero concept 1 (mobile) | `beab0b52` |
| `hero-02-style-in-motion` | image | hero | 16:9 | 2048×1152 | 1200w, 1920w | Homepage hero concept 2 (desktop), video poster fallback | `0840e029` |
| `hero-02-style-in-motion-mobile` | image | mobile | 9:16 | 1152×2048 | 900w | Homepage hero concept 2 (mobile) | `a5ceba35` |
| `hero-03-intentional-elegance` | image | hero | 16:9 | 2048×1152 | 1200w, 1920w | Homepage hero concept 3, About page | `98db4786` |
| `hero-03-intentional-elegance-portrait` | image | hero | 3:4 | 1536×2048 | 900w, 1400w | Hero concept 3 portrait crop, About page, social | `62d026ea` |
| `hero-04-column-dress` | image | hero | 16:9 | 2048×1152 | 1200w, 1920w | Services index hero, SEO landing pages | `270d1a6f` |
| `hero-05-colonnade` | image | campaigns | 16:9 | 2048×1152 | 1200w, 1920w | Magazine index hero, Culture category | `9a30be11` |
| `hero-06-staircase` | image | hero | 16:9 | 2048×1152 | 1200w, 1920w | Homepage hero (desktop poster and reduced-motion still), Open Graph candidate | `7e09c085` |
| `hero-06-staircase-mobile` | image | mobile | 9:16 | 1152×2048 | 900w | Homepage hero (mobile poster and reduced-motion still) | `1d93661f` |
| `hero-07-trench-monolith` | image | hero | 16:9 | 2048×1152 | 1200w, 1920w | Alternate hero, Private Consultation section, Signature service | `96f6b456` |
| `hero-07-trench-monolith-mobile` | image | mobile | 9:16 | 1152×2048 | 900w | Alternate hero (mobile) | `532e44d9` |
| `hero-08-rooftop-cape-mobile` | image | mobile | 9:16 | 1152×2048 | 900w | Alternate hero (mobile), social | `ad6721ad` |
| `philosophy-wardrobe` | image | philosophy | 3:4 | 1536×2048 | 900w, 1400w | Homepage philosophy series | `a9826b33` |
| `philosophy-mirror` | image | philosophy | 4:3 | 2048×1536 | 1200w, 1920w | Homepage philosophy series, About page | `355cee78` |
| `philosophy-hands` | image | philosophy | 1:1 | 2048×2048 | 800w, 1200w | Homepage philosophy series, Wardrobe Edit | `31272d11` |
| `philosophy-city-walk` | image | philosophy | 3:2 | 2016×1344 | 1200w, 1920w | Homepage philosophy series, Executive styling landing | `fe73e38b` |
| `service-style-clarity` | image | services | 3:4 | 1536×2048 | 900w, 1400w | Style Clarity Consultation | `ccd82d34` |
| `service-colour-harmony` | image | services | 3:4 | 1536×2048 | 900w, 1400w | Colour & Harmony Consultation | `c4af596c` |
| `service-wardrobe-edit` | image | services | 3:4 | 1536×2048 | 900w, 1400w | Wardrobe Edit | `68fd9d9a` |
| `service-occasion-styling` | image | services | 3:4 | 1536×2048 | 900w, 1400w | Occasion Styling | `4aca2ad7` |
| `service-personal-shopping` | image | services | 3:4 | 1536×2048 | 900w, 1400w | Personal Shopping | `221e0ca3` |
| `service-signature-private` | image | services | 3:4 | 1536×2048 | 900w, 1400w | Signature Private Styling | `0cbf22f8` |
| `studio-compass` | image | style-studio | 4:3 | 2048×1536 | 1200w, 1920w | Style Compass card and page | `e9dd4013` |
| `studio-colour-lens` | image | style-studio | 4:3 | 2048×1536 | 1200w, 1920w | Colour Lens card and page | `187af45a` |
| `studio-closet-remix` | image | style-studio | 4:3 | 2048×1536 | 1200w, 1920w | Closet Remix card, Shop Your Closet section | `3440526a` |
| `studio-passport` | image | style-studio | 4:3 | 2048×1536 | 1200w, 1920w | Style Passport promotion, account empty states | `c460d3ff` |
| `mag-edited-rail` | image | magazine | 3:2 | 2016×1344 | 1200w, 1920w | Article: Why More Clothes Don't Always Mean More Style | `6de42225` |
| `mag-swatch-wall` | image | magazine | 3:2 | 2016×1344 | 1200w, 1920w | Article: How to Discover Your Style Without Copying Someone Else | `e7e19c6a` |
| `mag-rework-shirt` | image | magazine | 3:2 | 2016×1344 | 1200w, 1920w | Article: 7 Ways to Rework Pieces You Already Own | `d99c1344` |
| `mag-planned-wardrobe` | image | magazine | 3:2 | 2016×1344 | 1200w, 1920w | Article: The Quiet Power of a Well-Planned Wardrobe | `a133c919` |
| `mag-modest-elegance` | image | magazine | 3:2 | 2016×1344 | 1200w, 1920w | Article: What Does Modest Elegance Actually Mean? | `5c44b0c4` |
| `mag-real-life` | image | magazine | 3:2 | 2016×1344 | 1200w, 1920w | Article: Dressing for the Life You Actually Live | `b223915a` |
| `mag-colour-joy` | image | magazine | 3:2 | 2016×1344 | 1200w, 1920w | Article: Colour Without Rules | `5290a4ee` |
| `mag-inspiration-desk` | image | magazine | 3:2 | 2016×1344 | 1200w, 1920w | Article: From Inspiration to Identity | `4968616b` |
| `mag-city-douala` | image | magazine | 3:2 | 2016×1344 | 1200w, 1920w | Article: City Style Douala | `2227162e` |
| `brand-seal-card` | image | brand | 3:2 | 2016×1344 | 1200w, 1920w | About page, policies, brand moments | `6255f7d4` |
| `brand-newsletter-letter` | image | brand | 3:2 | 2016×1344 | 1200w, 1920w | The Virtuous Edit newsletter section and page | `61040292` |
| `about-woman-before-wardrobe` | image | campaigns | 3:4 | 1536×2048 | 900w, 1400w | About page: The Woman Before the Wardrobe | `185cb8ea` |
| `consultation-chairs` | image | campaigns | 16:9 | 2048×1152 | 1200w, 1920w | Homepage private consultation section, booking flow | `f10e5fc1` |
| `empty-hanger` | image | campaigns | 16:9 | 2048×1152 | 1200w, 1920w | 404 page and empty states | `35eabd9e` |
| `founder-kimbi-rosa` | image | about | 3:4 | 1086×1448 | 900w | About page: Meet the Founder; magazine author page (real photograph supplied by the founder, not generated) | supplied |
| `collection-vv01-ivory-testament` | image | collection | 3:4 | 1536×2048 | 900w, 1400w | Our Collection: VV01 catalogue hero | `7fe9cbf0` |
| `collection-vv03-soft-sovereign` | image | collection | 3:4 | 1536×2048 | 900w, 1400w | Our Collection: VV03 catalogue hero | `195420f5` |
| `collection-vv04-champagne-reverie` | image | collection | 3:4 | 1536×2048 | 900w, 1400w | Our Collection: VV04 catalogue hero | `2d43ba55` |
| `collection-vv05-sunday-heirloom` | image | collection | 3:4 | 1536×2048 | 900w, 1400w | Our Collection: VV05 catalogue hero | `df86edf8` |
| `collection-vv06-city-devotion` | image | collection | 3:4 | 1536×2048 | 900w, 1400w | Our Collection: VV06 catalogue hero | `6b0c28e2` |
| `collection-vv09-pearl-discipline` | image | collection | 3:4 | 1536×2048 | 900w, 1400w | Our Collection: VV09 catalogue hero | `b5209737` |
| `collection-vv10-evening-psalm` | image | collection | 3:4 | 1536×2048 | 900w, 1400w | Our Collection: VV10 catalogue hero | `3a17e7c1` |
| `collection-vv02-mulberry-muse` | image | collection | 3:4 | 1536×2048 | 900w, 1400w | Our Collection: VV02 catalogue hero | `8f1c0825` |
| `collection-vv07-linen-virtue` | image | collection | 3:4 | 1536×2048 | 900w, 1400w | Our Collection: VV07 catalogue hero | `04df1b59` |
| `collection-vv08-rosewood-poise` | image | collection | 3:4 | 1536×2048 | 900w, 1400w | Our Collection: VV08 catalogue hero | `34daafae` |
| `hero-video-staircase-wide` | video | motion |  | 1920×1080, 9 s after loop fade | 1080p mp4+webm, 720p mp4+webm | Homepage hero (desktop, seamless loop) | `f73dcd73` |
| `hero-video-staircase-mobile` | video | motion |  | 1080×1920, 7 s after loop fade | 720p mp4+webm, 480p mp4+webm | Homepage hero (mobile, seamless loop, fast connections only) | `5170f0ba` |
| `hero-video-wide` | video | motion |  | 1920×1080 | 1080p mp4+webm, 720p mp4+webm | Former homepage hero (retired, kept for reference) | `53c9ba2a` |
| `hero-video-mobile` | video | motion |  | 720×1280 | 720p mp4+webm, 480p mp4+webm | Former homepage hero (retired, kept for reference) | `b2f142f0` |

## Brand kit (approved, raster)

`assets-src/brand-kit/` holds the approved PNG kit: website header lockups (ink/white), primary stacked wordmark (ink/white/mulberry), wordmark with tagline, two-tone and single-colour monograms, app icons and favicon. Trimmed, responsive PNG/WebP exports live in `public/assets/virtuous-vogue/brand/` and icons in `public/icons/`. The kit is raster; vector artwork should be commissioned for large-format print.

## Rejection log

Kept for transparency about the review standard.

| job | reason |
| --- | --- |
| `ba346dee` | Invented lettering in the negative space |
| `c8ba7aba` | Invented lettering |
| `f0e905f8` | Invented lettering |
| `c79bb72e` | Bare shoulders and fake swatch labels |
| `527fdb1d` | Camisole does not meet modesty standard |
| `6bf5a237` | Invented lettering |
| `067bcadd` | Rendered as a printed spread with captions |
| `1f470b1c` | Nudity: rejected outright |
| `9d0cb132` | Off-shoulder drape |
| `39ba45b8` | Monogram letters pressed into seal |
| `51a92634` | Fake titles on spines |
| `2fa5a0b5` | Printed text on a card |
| `8d95f78f` | Sleeveless sweetheart neckline |
| `73707686` | Bare shoulders |
| `06578bfc` | Fake swatch labels |
| `4a6ead8d` | Shirt open at the chest |
| `b56bd838` | Rendered as printed spread |
| `0249c486` | Rendered as printed spread |
| `3dfe20ff` | Midriff exposed, suggestive pose |
| `93e5388d` | Printed fan with lettering |
| `d8ae0dde` | Wide neckline, cluttered room |
| `6fb3a3ee` | Letters pressed into seal |
| `35175b86` | Fake titles on spines |
| `cc2e69e0` | Shirt open at the chest |
| `36fb2256` | Green wall off-palette; superseded |
| `fe0fd1a7` | Rooftop cape concept: invented lettering in the sky |
| `42bad687` | Rooftop cape concept, second pass: invented lettering in the sky |
| `59128041` | Headwrap portrait: sleeveless gown, shoulders uncovered |
| `b7c5fca8` | Headwrap portrait (mobile): sleeveless halter gown and invented lettering |
| `23d3f7d1` | Staircase (mobile), first pass: invented lettering at the bottom edge |
| `41b40b47` | Staircase (desktop), second pass: faint lettering at the bottom edge and flatter light than the approved frame |
| `72561ef9` | VV01 first pass: head cropped, neckline too deep |
| `34c7dd9d` | VV02 first pass: square neckline too low |
| `2d70cee6` | VV02 second pass: neckline still low |
| `af6def8e` | VV02 third pass: cut-out decolletage |
| `0c136fc6` | VV06 first pass: thigh-high slit and shop lettering in the background |
| `3f3f5a7f` | VV07 first pass: head cropped, bare midriff |
| `61fceab9` | VV07 second pass: crop top, bare midriff |
| `f3e428f1` | VV07 third pass: knotted tee, bare midriff, head cropped |
| `99a9ef68` | VV08 first pass: deep V neckline and thigh slit |
| `5eb1aa9b` | VV08 second pass: deep V neckline and slit |
| `6936e780` | VV08 third pass: V neckline with cleavage and slit |
