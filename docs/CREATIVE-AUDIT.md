# Creative and performance audit

Reviewed as a senior fashion creative director after integration, against the brief's ten questions.

## Does the website feel like one cohesive fashion brand?

Yes. Every photograph was generated from one art-direction sheet: natural skin, tailored or fluid silhouettes, limewashed and travertine interiors, warm late light, mulberry used as the single recurring signature. The homepage opens on the staircase campaign: a floor-length mulberry gown in a single shaft of light, filmed as a slow push-in that loops without a cut. The approved VV lockup is on every published image and all hero videos, and the identity kit (header lockup, stacked wordmark, two-tone monogram, mulberry app icon) is used verbatim in the header, footer, auth pages, PWA icons and favicon.

## Are the women depicted authentic and diverse?

Deep, medium-deep and medium skin tones appear across hero, services, magazine and studio imagery; hair ranges from natural crops and afros to braids, locs and sleek buns. Expressions are calm or genuinely joyful, never performed. Two generations with exaggerated or off-palette results were rejected. In the second hero round, every frame with baked-in lettering or an uncovered shoulder was rejected and logged, including two otherwise spectacular rooftop frames.

## Does the visual direction communicate intentional elegance rather than status anxiety?

The library contains no logos, no shopping bags, no status signifiers. The strongest frames are quiet: a woman alone in a travertine atrium, two chairs by a window, a hand on a folded knit. Copy throughout uses discover / refine / express, never fix / hide / flaw.

## Do the visuals support the messaging?

Each section's image was chosen for its sentence: "Inside out, not outside in" sits beside a woman reading her own wardrobe; "You may not need more clothes" beside a flat-lay of pieces already owned; "A stylist can understand" beside two empty chairs waiting for a conversation.

## Does the magazine feel like a serious editorial publication?

Issue numbering, category navigation, a featured spread, editor's selection, reading time, bylines, pull quotes, reading-progress hairline, related stories, author pages and full-text search. Commerce appears only as three restrained callouts per story. All headlines remain live HTML.

## Does the booking journey remain clearly visible?

Primary CTA in the header on every page, a dedicated section on the homepage, per-service booking links, booking from a Compass result, from a saved look and from every landing page. Different intents get different CTAs (Discover, Remix, Explore, Ask, Book).

## Are animations refined rather than distracting?

Masked image reveals, line-by-line text reveals, slow parallax, a single hover treatment ("fabric" sheen + 3.5% zoom), palette swatches that lift. Nothing bounces. Every motion primitive checks `prefers-reduced-motion`; the custom cursor only appears on fine pointers.

## Does everything look believable and professionally art-directed?

The review rejected 25 generations for lettering, printed-spread framing, nudity, bare shoulders, invented monograms or off-palette walls. What remains passes a close read: fabric drape, seams, hands and skin texture are credible at 1920 px.

## Is the mobile experience equally beautiful?

Dedicated 9:16 hero stills and a 9:16 hero video, a bottom navigation for signed-in clients, one-handed booking steps, camera upload in Closet Remix and Colour Lens, and a service worker that keeps saved stories and Style Passport pages available offline.

## Known gaps and next steps

- **Founder photograph**: placeholder until the real, approved image is provided (`NEXT_PUBLIC_FOUNDER_PHOTO`). No generated stand-in is used, by design.
- **Testimonials**: honest empty state until the first consented client story is published from the cockpit.
- **Vector logo**: the approved kit is raster; commission vector artwork before large-format print.
- **Lookbook PDF export**: data model and builder are in place; rendering to PDF is a later step.
- **Group consultations and curated retail** are feature-flagged off until the business is ready.

## Performance notes

- Committed imagery totals ~24 MB for 41 stills and 4 videos (two retired); `next/image` serves AVIF/WebP at device size with blur placeholders, and the hero poster is the only `priority` image above the fold.
- Hero video is attached client-side only when `navigator.connection` reports a fast connection without data-saver and reduced-motion is off; mobile uses a 720p/480p vertical clip. No autoplay download happens on 2G/3G.
- Fonts are self-hosted via `next/font` (Bodoni Moda, Manrope, Source Serif 4) with `display: swap`.
- Marketing routes are statically rendered; motion components are small client islands.
- Run Lighthouse on the deployed URL after setting the production domain; target LCP < 2.5 s on 4G with the hero poster, CLS ≈ 0 (all images have intrinsic aspect ratios), INP < 200 ms.
