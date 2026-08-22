---
name: dataviz
description: Load when creating editorial data visualizations for a publication — charts, maps, statistical graphics, and visual story arcs. Accepts article, event cluster, or data release as input. Do NOT load for simple one-off exploratory charts (matplotlib, seaborn, plotly defaults).
---

# Editorial Data Visualization

## Scope

**In scope:** Editorial data visualizations with narrative structure, journalistic rigor, and publication-quality design. Visual journalism that tells a story — cinematic features, data briefings, tactical maps, market terminals, fact-checks, timeline investigations.

**Out of scope:** Simple exploratory charts (matplotlib/seaborn defaults), dashboards with multiple independent controls, illustrated articles without a single anchoring visual, infographics that duplicate the article text.

**Reference material** lives in `references/`. Consult these when building:

- [[Chart-Standards]] — chart anatomy, typography, color system, prohibitions, proportionality, common errors
- [[map-standards]] — map types, verification protocol, boundary styling, choropleth integrity
- [[interaction-and-accessibility]]  — interaction design, scrollytelling, inclusive design, WCAG
- [[format-templates]] — HTML skeletons + layout rules for all six format families
- [[output-contract.md]] — full structured result JSON + field rules (consult during Step 7 Output)

---

## Step 0: Hard Gates — reject the output if any of these fail

Three rules. Miss any of them and your output must be rebuilt. The entire rest of this skill is in service of these three.
**Quality over quantity — but "quality" means richly layered, not stripped-bare.** Each gate is a ceiling, not a target. One hero, richly executed, is the goal. A minimal hero with no annotations, a bare title, and no supporting data is not "clean" — it's anemic
### Gate 1 — ONE hero visual carries the story
A single anchoring visual does the work: one editorial photograph, one data chart, one annotated map, one cutaway diagram, one 3D object. **Not** a scrollable essay with figures sprinkled in. **Not** a dashboard with multiple panels. **Not** an illustrated article.

Two specific validations for this gate:

- `hero_asset_url` must be a real http(s) URL to the anchoring visual.
- `format_family` must be one of the six allowlist formats — `interactive_dashboard` is structurally incompatible with ONE hero visual.

**One focal point. Density depends on format.**

|Format family|Hero density target|Reason|
|---|---|---|
|**Cinematic feature**|Image carries the story. Title + short dek (≤15 words) + 1–2 small annotations max. Poster-like composition is correct — the photo does the work.|Conflict, crisis, human drama — the reader feels it before they read it.|
|**Tactical map**|2–4 annotations anchored to named geographic features. 15–30 word dek. Source line required.|Geography carries the story; annotations name the specific beats.|
|**Timeline investigation**|2–4 event markers on the hero screen. 15–30 word dek.|Chronology is the spine; each marker names a moment.|
|**Data-first briefing / market terminal / fact-check**|Rich: 3–6 annotations interpreting data points, 30–60 word dek, axis/legend/source labels. Supporting inset if it reinforces the focal point.|Data carries the story; annotation is the editorial layer that turns the chart into journalism.|

**Ceiling across all formats:** `hero_word_count` ≤150 (agent target varies by format above). Count title + dek + any on-hero annotations and callouts.

The busyness rule is about **competing focal points**, not element count. Two charts of equal visual weight = two focal points = reject. A main chart with 5 annotations, a legend, and a small locator inset that all point at the same story = one focal point = fine.

Other structural rules:

- The whole page contains at most 3 sections: hero, one body section, source/footer.
- Any single chart or data element contains at most 4 distinct categories. Annotations don't count against this — they are labels on the categories, not additional categories.
### Gate 2 — Map accuracy: real tile + sourced overlays, or no map

If the visualization is a map:

- **Base tile** must come from a cleared source with attribution rights. The three categories:
    | Source | How to use | Good for |
    |---|---|---|
    |**NASA GIBS / Earth Observatory** (public domain)|`https://gibs.earthdata.nasa.gov/wmts/...` or `https://eoimages.gsfc.nasa.gov/...` | Satellite imagery — coastlines, storms, fires, land use, night lights |
    |**OpenStreetMap** (free with attribution)|`https://tile.openstreetmap.org/{z}/{x}/{y}.png` (include OSM attribution in the rendered footer)|Vector street/terrain maps|
    |**Licensed satellite images** (per-image license)|Single image URL from your licensed provider; not a tile layer|Single-frame hero shots — one satellite crop, not a scroll-and-zoom map|
- **Every overlay** (lines, polygons, annotated zones, boundaries) must cite authoritative source coordinates: GeoJSON from a named body (UN, USGS, EIA, national petroleum authority), or published lat/lon. **No "reconstructed from screenshot." No "simplified from."** Declare each overlay's source URL in `map_overlays_source`.
- If an overlay can't be sourced, drop it or switch format.
- Hand-drawn SVG coastlines, country outlines, or polygon approximations of real geography are **always** a reject. There is no artistic exception.
- **Hand-placed text labels on satellite imagery** require the full four-step verification in `references/map-standards.md`. If any step can't be completed confidently, strip the labels and ship the satellite image with a caption below instead.

### Gate 3 — ≤400 words total across the page

Count every reader-facing word: title + dek + annotations + body + captions + legends. Declare it in `total_word_count`. Agent target ≤400; hard reject >600.

This is the busyness cap, not an anti-copy rule. **The 400-word target is for data-led formats** where 400 words is the difference between a rich editorial graphic and a bare poster. **Cinematic features and tactical maps should aim much lower** — 100–250 words is correct for image-led formats; the photograph carries the story. Use the Gate 1 density table to set your in-format target.

#### Declaring the gates in your result

Your structured result JSON must include:

```text
"format_family": "...",           // enum — see Step 1b
"hero_asset_url": "https://...",  // URL to the ONE visual that carries the story
"base_map_source": "https://...", // required if format_family is a map; else null
"map_overlays_source": [...],     // list of source URLs for each overlay; empty if no map
"total_word_count": 0,            // integer — all reader-facing words. Agent target ≤400, hard reject >600
"hero_word_count": 0              // integer — title + dek + on-hero annotations. Agent target ≤50, hard reject >150
```

---

## Rendering & Image Licensing

This HTML renders in a webview on both mobile and desktop — mobile is the primary audience. Design mobile-first, ensure it scales up to desktop gracefully.

**Mobile:** `<meta name="viewport">` required. Use `<img>` tags (not CSS `background-image`) for photos. Add `loading="lazy"` on all images except the hero. Minimum 16px text on mobile.

**Image licensing — binary lookup, not guesswork:**

|Source|Allowed?|How to find|
|---|---|---|
|Licensed editorial photography (wire services, licensed archives)|**Yes — preferred**|Your publication's licensed image library|
|US government (`.gov` domains)|**Yes — public domain by law**|Add `site:gov` to image queries|
|NASA Media Library|**Yes — all public domain**|Search `nasa.gov [subject]`|
|Wikimedia Commons|**Yes — if CC0 or CC BY**|Check license on the specific file page|
|Subject organization's own website|**Yes — product/facility photos only**|Must be from their domain. **NEVER use logos, OG/social-meta images, brand assets, or press kit graphics** — these are marketing materials.|
|Fair use (transformative)|**Yes — if all 3 conditions met**|(1) Image is annotated/composited with data, (2) used as evidence not decoration, (3) attributed clearly|
|News outlets (Reuters, AP, Bloomberg, NYT)|**No — never**|Copyrighted editorial content|
|Stock sites (Shutterstock, Alamy, iStock)|**No — never**|Licensed content without rights|
|Unknown/unverifiable source|**No — never**|If you can't confirm the license from the domain, don't use it|

**Security:** No localStorage/cookies/IndexedDB. No external API calls from the HTML.

---

## Your Input

Your input will be one of:

- **An article** — extend the journalism, don't duplicate the headline or bullet points.
- **An event cluster** — synthesize multiple sources into one visual.
- **A data release** — the data IS the story. A study, report, or dataset.

Read your input. Then go to Step 1.

---

## Step 1: Story, Art Direction, and Hero Asset

## 1a. Find the story

**Find the reader's question.** Read the article's key claims and ask: what would a curious reader pause on? "They lost comms for 40 minutes" → the reader wonders _why 40 minutes?_ "Tariffs raised prices 12%" → the reader wonders _on what, and who pays?_ That question is almost always a better thesis than the fact itself — and it's the thesis only a graphic can answer.

**State your thesis**: "After seeing this graphic, the reader will understand that _."

## 1b. Art direction — HARD GATE

Before choosing layout, typography, imagery, or any HTML, define the visual idea for THIS specific story. Every story demands its own art direction.

**Answer in your scratchpad:**

- **Topic:** What is this story actually about? Name the specific subject — not the news hook, the editorial subject.
- **Audience:** Who is this for, and what do they already know? Name the reader in one phrase.
- **Mood:** What should this feel like? (urgent, analytical, investigative, human, clinical, triumphant, ominous)
- **Primary evidence:** What type of visual carries the story? (photo, chart, map, timeline, claim vs evidence, diagram, 3D object)
- **Format family:** Which fits? (see table below)
- **Visual language:** Type system, color direction, density, motion, imagery style — each story has its own. Name all five explicitly.
- **Color direction:** What palette fits the mood? (restrained neutrals + one accent is the default — earn every additional color)
- **What to avoid:** What clichés or generic visuals would weaken this?

**Format families — each has its own visual language:**

| Format                     | When to use                                                             | Visual character                                                                      |
| -------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Cinematic feature**      | Stories where image and atmosphere lead — conflict, crisis, human drama | Full-bleed photography, serif headlines, restrained data, emotional weight            |
| **Data-first briefing**    | Macro, markets, population, policy, metrics — the data IS the story     | Chart-led opening, key number rail, designed chart containers, clean light background |
| **Tactical map**           | Conflict, shipping, infrastructure, climate, geography                  | Satellite/map imagery, annotated routes, position markers, geographic precision       |
| **Market terminal**        | Bonds, FX, oil, equities, commodities                                   | Dark bg, monospace type, tickers, grids, live-feel data density                       |
| **Fact-check**             | Claims, politics, misinformation, public statements                     | Claim/correction mechanic, side-by-side evidence, verdict panels, cutout imagery      |
| **Timeline investigation** | Incidents, policy changes, conflicts, sequences                         | Chronological spine, progressive disclosure, event cards                              |

**Format selection — image search is a BLOCKING scratchpad gate before FORMAT can be filled.**
**Required scratchpad block — fill BEFORE picking FORMAT:**

``` text
IMAGE SEARCH (BLOCKING — must be filled before FORMAT field)
  Editorial photo queries run:    [list every query you ran]
  Public domain queries run:      [list every .gov/NASA/CC0 query, or "n/a — editorial results sufficient"]
  TOP RESULTS (best 3 by editorial fit):
    1. [URL or descriptor] — [why this is/isn't a strong editorial photo for THIS story]
    2. ...
    3. ...
  STRONG PHOTO AVAILABLE:         [yes / no]
  IF NO — JUSTIFICATION:          [why the searches returned nothing usable. "Generic stock results only." / "Subject is abstract macro data with no named entity to search." Be specific.]
```

**Then pick FORMAT — and the FORMAT must follow from the IMAGE SEARCH result:**

| IMAGE SEARCH outcome                                                                                        | Required FORMAT                                            |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Strong photo found, story has named place / event / person / physical subject                               | `cinematic_feature`                                        |
| Strong satellite / map imagery for a geography story                                                        | `tactical_map`                                             |
| Story is about a physical object/machine/structure + STRONG PHOTO = yes                                     | `cinematic_feature`                                        |
| Story is about a physical object/machine/structure + STRONG PHOTO = no                                      | Build a 3D render / isometric cutaway and use that as hero |
| Claim that needs verification                                                                               | `fact_check`                                               |
| Chronological / sequence story                                                                              | `timeline_investigation`                                   |
| **No strong photo, no physical subject, no map, no claim, no sequence** — and the IF NO justification holds | `data_first_briefing` or `market_terminal`                 |

**You cannot pick `data_first_briefing` without a written IF NO justification in scratchpad.**

## 1c. Hero asset — what is the ONE visual?

**What is the ONE image or visual that IS this story?** Not the hero photo of a scrolling essay — the single visual that carries the entire editorial idea.

**Always start from a real reference image — never build from scratch.** Maps: use satellite imagery or up-to-date map tiles. Products: grab a real photo and annotate/transform it. Objects: find a reference image and layer data onto it.

**Scratchpad checkpoint (required before proceeding):**

``` text
THESIS: "After seeing this, the reader will understand that ___"
TOPIC: [the specific editorial subject, not the news hook]
AUDIENCE: [who is this for, and what do they already know?]
MOOD: [one word]
PRIMARY EVIDENCE: [photo/chart/map/timeline/claim/diagram/3D object]

IMAGE SEARCH (BLOCKING — must be filled before FORMAT)
  Editorial photo queries run:    [...]
  Public domain queries run:      [...]
  TOP RESULTS (best 3 by editorial fit):
    1. [...] — [strong / not strong + reasoning]
    2. ...
    3. ...
  STRONG PHOTO AVAILABLE:         [yes / no]
  IF NO — JUSTIFICATION:          [specific reason]

FORMAT: [Cinematic feature / Data-first briefing / Tactical map / Market terminal / Fact-check / Timeline investigation]
  → If IMAGE SEARCH STRONG PHOTO = yes, FORMAT must be cinematic_feature OR tactical_map.
  → data_first_briefing requires a written IF NO justification.

HERO ASSET: [the ONE visual — what is it specifically?]
VISUAL LANGUAGE: [type system / color / density / motion / imagery style — all five]
COLOR: [palette direction]
AVOID: [specific clichés for this topic]
```

## 1d. Find the visual metaphor

Before choosing a chart type, ask:

- **What does this data look like in the real world?** Ship tracking data looks like glowing AIS dots on a dark ocean. Power grid data looks like lights switching off across a map. Find the real-world visual that IS the data.
- **What's the natural motion?** If the story is about disappearance, things should vanish. Acceleration → speed up. Accumulation → pile up. The animation should be the editorial thesis made visible.
- **What's the one-phrase title?** Compress the finding into a poetic phrase — a concrete noun that names the thing. "Going dark." / "The 21-mile toll." / "Lights out."
- **What's the right canvas?** Dark/void for darkness, absence, surveillance. Clean light for straightforward explainers. Editorial photography for stories grounded in a real place or event.

---

## Step 2: Source Imagery

**HARD GATE.** Source editorial photography before writing a single line of HTML. A dataviz with no real imagery is a report, not visual journalism.

**First: decide what the reader should SEE.** Before running any image search, answer these four questions in your scratchpad:

1. **What world is this story set in?** Name the physical place.
2. **What would a photojournalist shoot?** That's your search query. **If the story names real people**, search for editorial portraits of them.
3. **What is NOT the answer?** A company's website, their logo, their social card, their press kit — these are marketing materials.
4. **Does the image match the actual subject?** A story about a specific product must show that product, not a similar-looking substitute.

**Then search — in this order:**

- Use your publication's licensed editorial photography first.
- Fall back to public domain (`.gov` / NASA / Wikimedia CC0) if licensed sources are insufficient.
- Use AI-generated imagery for atmospheric/conceptual environments.
- **You MUST have at least 2-3 images sourced before proceeding.** Exception: data-first briefing and market terminal formats don't require photography.

**Designate a thumbnail candidate** — a sharp, clean close crop, not a wide establishing shot. Source it now.

**Image validation — HARD GATE before every image is used:**

1. **Geography correct?** Right place?
2. **Subject correct?** Right person, product, company, or event?
3. **Emotional tone correct?** Matches the mood you named?
4. **Could this mislead?** Implies something the story doesn't support?
5. **Specific enough?** Swappable for a generic stock version? If yes, find a more specific one.

If any fails, replace it. Beautiful-but-wrong is worse than plain-but-accurate.

---

## Step 3: Research & Verify

**Research the data.** Use web search and URL fetching for primary data, historical context, comparables.

**Scoping rule:** Every fact must serve the thesis. Tangential context dilutes the story.

**Pull visuals from primary sources.** When the story is about a scientific study, government report, or dataset release, **always check the paper for usable figures first**. Use the paper URL or DOI and look for figure URLs and supplementary images. Primary source figures are fair use when composited with editorial annotation and attribution.

**Verify every data point — HARD GATE:**

1. **Trace to primary source**: Government data, peer-reviewed research, official reports. Not Wikipedia or aggregators.
2. **Cross-reference**: Minimum 2 independent sources for key claims.
3. **Check recency**: Most recent data. Note date in source line.
4. **Note uncertainty**: State ranges for varying estimates. Flag small samples (n < 30).
5. **Inflation-adjust**: Always for monetary values. Note base year.
6. **No cherry-picked date ranges**: Show full trend.
7. **Rates vs. counts**: Per capita for different-sized populations.
8. **Vendor claims**: Attribution language ("claims," "reports," "according to").
9. **Count what you claim**: Headline says "five" → body names five.
10. **Use primary source data, not secondary approximations.**

If data is insufficient for a sound chart, **return an error message** instead of generating a misleading visualization.

---

## Step 4: Build

## Narrative spine

**The narrative spine depends on your format family:**

**Cinematic feature:** Photograph (or 3D render / satellite crop) carries the story. 3–7 visual beats, IMAGE → OVERLAY → DATA pattern. 1–2 annotations max per beat — cinematic feel depends on trusting the photograph to do the work.

**Data-first briefing:** Lead with the key number or chart. Structure: "What changed" → key metric rail → 2-3 designed chart sections → source/methodology. At least one editorial image MUST appear — full-width, leading a scroll moment, with editorial caption. A ~50%-width inset between charts is a reject.

**Tactical map:** Overview map → zoom to key area → annotated detail → data overlay → context panel.

**Market terminal:** Headline ticker → key metrics grid → 1-2 charts → context strip. Dark background, monospace, high data density.

**Fact-check:** The claim (quoted, attributed) → what the data shows → side-by-side comparison → verdict panel.

**Timeline investigation:** Trigger event → escalation → turning point → current state → what's next. Progressive disclosure on scroll.

## Below-fold modules — the reusable vocabulary

Quality cannot peak at the hero. Pick from this inventory when building below-fold sections — each module has a specific job, and most pieces use 2–4 of them in a deliberate order.

|Module|What it does|When to reach for it|
|---|---|---|
|**Pull quote**|Surfaces a single voice with weight|When one person's words are the story beat|
|**"What changed" card**|Names the specific shift — before value, after value, delta, time window|Data-first briefings, anywhere the lede is a move|
|**"Why this matters" block**|Translates finding into consequence — 2–3 sentences max|When data is technical and stakes aren't self-evident|
|**Inline stat card**|One number + one label + one context line|Punctuating a chart section; never to repeat a number already shown|
|**Annotated chart**|Chart + inline editorial sentences anchored to specific data points|Every chart in the piece|
|**Timeline strip**|Chronological markers with event titles and dates|When sequence is a story beat but the whole piece isn't a timeline_investigation|
|**Comparison block**|Side-by-side (claim vs. evidence, before vs. after)|Fact-check pieces, corrective graphics|
|**Methodology footer**|Data sources, sample windows, uncertainty, what was excluded|Every data-first briefing, every piece with modeled estimates|
|**Source note**|Single-line attribution pinned to the chart or image it credits|Every chart and image|

## Visual grammar

Match visual form to story need. Consult `references/chart-standards.md` for the full decision matrix and color system. **Before building any chart, walk the LLM-default rejection test** in `chart-standards.md` and declare your overrides for all eight defaults in scratchpad.

|Story Need|Best Choices|
|---|---|
|Sequence / causality|Scrollytelling, annotated timeline, animated line on map|
|Geography / impact|Annotated map, choropleth, isochrone bands, 3D globe with data arcs|
|Physical infrastructure / how things work|Isometric/axonometric cutaway diagrams, exploded views, CSS 3D transforms|
|Spatial environment / "you are here"|3D globe (Three.js or CSS 3D), parallax depth layers, terrain with data overlaid|
|Distribution / inequality|Beeswarm, histogram, ridge plot|
|Network / system|Flow diagrams, Sankey, node-link, orbital/radial layouts|
|Investigative entity chain|Progressive entity map, document exhibits|
|Comparison / ranking|Horizontal bar, dot plot, lollipop|
|Change over time|Line chart, area chart, slope chart|

**Depth and dimension — first-class options, not edge cases.** When the story involves a physical object, a structural system, or terrain, 3D/depth treatments are usually the RIGHT answer.

- **Physical object / machine / structure** → **Isometric cutaway or 3D render.** Prompt AI image generation: _"[Object] isometric cutaway view, studio lighting, clean background, data labels on components"_; SVG connector lines annotate parts.
- **Spatial relationship / "you are here"** → **3D globe** or **parallax depth** layers.
- **Elevation / terrain / landscape** → **Terrain map** (Leaflet with terrain tiles or GIBS satellite where public-domain).

**Limit to 2-3 chart types per piece.** Repetition builds familiarity.

## Build as single-file HTML

Generate via code execution. Self-contained with embedded CSS and JS.

**Technology:** Plotly.js or D3.js for charts, Leaflet.js for maps, Intersection Observer for scrollytelling, pure HTML/CSS for simple bars.

**HARD requirement — open `references/format-templates.md` now.** It has the HTML skeleton + layout rules for your chosen format family, plus three cross-format rules (animation verification, image URL verification, IIIF URL sizing) you MUST apply before finalizing.

---
## Step 5: Creative Execution

## Editorial Voice (every word matters)

- **Headlines must reframe, not label.** "The Forecast Gap" not "AI Weather Models." If your headline could be a Wikipedia article title, rewrite it.
- **Subheads must provoke, not announce.** Every subhead earns its place by making the reader want to keep scrolling.
- **Annotations interpret, not describe.** "Wind pushed flames over the highway at 6:45 PM, trapping 200 residents" not "Map showing fire location."
- **Section labels are precise.** "The Blind Spot" not "Section 4." Labels frame what's coming — they're tiny headlines.
- **No filler text.** Cut "In this section we explore…" / "As we can see…" / "It's worth noting that…" Go straight to the insight.
- **Minimize visible text and credits.** Don't show internal licensing terms ("public domain") or methodology markers. Every visible word must earn its place.
- **Standard quotation marks.** Use quotation marks on both sides ("like this"), not a decorative open-quote mark alone.

## Typography

Every dataviz must have clear typographic hierarchy — not default browser styles.

- **Two fonts**: one serif display (headings, titles, pull quotes) + one sans body (annotations, labels, source lines). Load via CDN from Fontshare or Google Fonts. System fonts = generic.
- **Type scale**: hero title 36-48px, section headings 24-28px, body 16-18px, captions/sources 12-14px. Never set display fonts below 24px.
- **Pull quotes** must have visual treatment — large quotation marks, a left border or card backdrop, display-size serif font, clear separation from body text.
- **Stat blocks / KPI cards**: numbers in display font (28-48px, `tabular-nums`), labels in small caps (11-13px).
- **Weight contrast**: use bold sparingly — hierarchy comes from size and font choice.

## Narrative Craft

- **Hero-first**: One primary visualization per story. Title alone must convey the takeaway if screenshotted.
- **Narrative rhythm**: Big scene → quiet chart → human moment → analytical insight. Never two big scenes back-to-back. Interleave a full-width editorial image with an editorial caption between chart sections.
- **Annotations are journalism**: Write sentences that interpret, not labels that describe.

---

## Gotchas

**Chart encoding errors:**

- Double-encoding the same variable with both color and length distorts comparison — pick one encoding per variable.
- Diverging color palettes need a meaningful zero. Using a diverging palette where the midpoint isn't a natural zero (e.g., 0°C, 0% change) creates a false story of "below average" vs "above average" where none exists.
- Area charts with multiple overlapping series create impossible-to-read color mixing below 70% opacity. Use line charts or small multiples instead.
- Sizing symbols by radius instead of area overstates quadratically. A circle with 2× the radius carries 4× the visual weight.

**Map errors:**

- Choropleths using raw counts instead of rates mislead — large geographic units dominate visually. Use rates, proportions, or switch to proportional symbols.
- GeoJSON from memory or approximate coordinates places facilities, cities, and borders wrong. Always look up lat/lon from an authoritative source (OpenStreetMap, USGS).
- A shipping lane drawn across a peninsula destroys credibility. Every flow line must trace through water.

**Typography collisions:**

- Hero title on unmodified mid-tone photography fails WCAG at 4.5:1. Apply one of: opaque container, gradient scrim, or confirmed solid image region. "It'll probably work" is not a mechanism.
- Colorful display italics on satellite tiles lose contrast. Reserve accent colors for data callouts, not titles over photography.

**Format selection errors:**

- Picking `data_first_briefing` for a story with strong editorial photography of the named subject. The photo wants to be the hero — switch to `cinematic_feature`.
- Adding a ~50%-width photo box between chart sections as a token to satisfy the imagery rule. That's the photo-as-afterthought anti-pattern. Either elevate the photo to full-width leading a scroll moment, or switch format so the photo IS the hero.

**Output errors:**

- The `thumbnail` field must be a direct image URL, not a deployed HTML page URL. HTML page URLs don't render as images in story cards.
- A watermarked preview image is worse than `null` for the thumbnail — ship null and let the backend fall back before shipping a watermark.

---

## Anti-patterns (DO NOT produce these)

- Charts on solid-color backgrounds with no photography (dark does not equal immersive)
- A long scrolling page of paragraphs with charts inserted between sections
- Part I → Part II → Part III report structure
- **CSS fade-ins as "animation"** — `opacity: 0 → 1` on scroll is an entrance transition, not data animation. Bars must grow, lines must draw, elements must appear/disappear to represent change.
- **Photos as wallpaper** — a full-bleed image with a generic data card floating on top is not compositing. The data must be anchored to what's visible in the image.
- **Overly dark hero images** — image + dark overlay = invisible on mobile. Test: can you clearly see what the photo depicts on a phone at normal brightness?
- **Company logos as imagery** — corporate OG images, brand marks, press kit graphics are NOT editorial photography.
- **Redundant data display** — never show the same number in a section heading, a subheading, AND a display element.
- **Text-on-text collisions** — never use a background image that already contains text and then layer your own text on top.
- **Wrong chart type for spatial data** — if the data IS about distance or distribution in space, show it spatially.
- **Text flush against edges** — all text overlaid on images MUST have minimum `padding: 16px 24px`.
- **Generic AI aesthetics** — BANNED. Particle-dot backgrounds, glowing orbs, AI gradients. Every visual must be specific to THIS story.
- **Photo-as-afterthought** — a small boxed image between chart sections with a plain attribution caption is a reject.
- **Flat when the story has depth** — bar charts about physical objects are under-executed when the subject has a spatial/physical dimension.
- **Approximated geopolitical overlays** — boundary lines sketched from a screenshot are a reject regardless of any "NOT TO SCALE" disclaimer.

---

## Step 6: Pre-Publication Checklist

**Internal consistency check:** Scan your output for any number, date, or stat that appears in more than one place. Do they all agree?

**Data & Chart Integrity:** Source verified, bar charts at zero, no dual axes/3D effects, declarative title, source line with org+dataset+date. Bar chart alignment is non-negotiable — all bars must start from the same left edge.

**Accessibility:** Colorblind-safe, WCAG AA contrast, alt text, 16px minimum on mobile. (Full checklist in `references/interaction-and-accessibility.md`.)

**Technical:** Single-file HTML, CDN resources, no localStorage.

**Dark mode:** Every dataviz must support both light and dark themes via `@media (prefers-color-scheme: dark)`. Define a dark variant of your color palette. Ensure WCAG AA contrast in BOTH modes.

**Mobile rendering (HARD CHECK — 375px viewport):**

- Does text land on a busy region of the photo?
- Are data cards overlapping hero/title?
- Are chart labels truncated?
- Are gradient/spectrum legends legible?
- For annotated objects / tactical maps: all absolute-positioned labels MUST have a `@media (max-width: 600px)` rule that reflows them below the image as a numbered list.
- Every chart at 375px must be at least 280px tall. No chart at any viewport width may have a width-to-height aspect ratio wider than 2:1.

**Quality rubric — answer YES to all before shipping:**

1. **Topic fit** — does the design feel specific to this subject?
2. **First-screen idea** — is there a strong visual concept above the fold?
3. **Communication** — can the viewer understand the main point in 5 seconds?
4. **Imagery** — is every image accurate, specific, and non-misleading?
5. **Typography** — does the type system fit the topic and create clear hierarchy?
6. **Data design** — do charts feel authored and editorial, not default/exported?
7. **Accessibility** — contrast ≥4.5:1, colorblind-safe, mobile text ≥16px, alt text present?
8. **Originality** — does it avoid generic AI/template aesthetics?
9. **Full-page craft** — does quality continue below the hero?

---

## Step 7: Output

## File delivery (REQUIRED)

1. Build a single self-contained `.html` file (all CSS/JS inlined, no external dependencies except CDN libraries).
2. Deploy via your output pipeline to get a permanent shareable URL.
3. Use the returned URL as `html_file` in the result block.

## Visual QA — REVIEW YOUR OWN OUTPUT (REQUIRED)

After deploying, preview or screenshot your page. Check:

1. **Text readability** — any text on busy image regions or flush against edges?
2. **Mobile layout** — labels, chart text, or stat blocks colliding at narrow viewport?
3. **Hero focal point (Gate 1)** — ONE dominant focal point.
4. **Geographic accuracy (HARD GATE for maps)** — real tile or reject. No hand-drawn polygons.
5. **Image quality** — all images sharp and loaded?
6. **Below-fold craft** — quality holds past the hero?
7. **Dark-on-dark** — surface variety present?
8. **Data accuracy** — numbers match your sources?

**If ANY of these fail, fix and redeploy before proceeding.**
## Structured result (REQUIRED)

Emit a structured result block with all required fields. **Open `references/output-contract.md` now** for the full JSON schema and field rules before emitting.

---
## Brand Integration

Apply your publication's brand guidelines **after** editorial rigor. If brand guidelines conflict with WCAG AA or statistical integrity, **prioritize accessibility and data integrity**.