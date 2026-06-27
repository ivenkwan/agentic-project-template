# Format Templates Reference

HTML build patterns for the six format families. Consult this file during Step 4 Build after you have committed to a format_family in Step 1b. These are starting skeletons — your piece should extend, rework, and elaborate on them, not ship them as-is.

**Core pattern across all immersive formats: `IMAGE → OVERLAY → DATA`.** Every section: full-viewport image, semi-transparent overlay, data composited on top. The image is the WORLD. The data LIVES in that world.

**Mechanical check for immersive formats:** search your HTML for every `<section>`. Each one MUST contain an `<img>` tag with a full-bleed editorial photo or atmospheric image. If any section has a solid-color background (`background: #...` or `background-color`) instead of an image, it fails. This is the single most common failure — the agent sources one hero image, then builds everything else on dark backgrounds. Every screen needs its own image.

**Companion formats (Data-first briefing, Market terminal, Fact-check):** self-contained HTML page rendered in a webview alongside the article. Standard chart anatomy (title, subtitle, source, labels, alt text). Clean backgrounds are correct — no photography required for chart-led formats.

---
## Immersive format skeleton (Cinematic feature, Tactical map, Timeline investigation)

``` xml
<section style="height: 100vh; position: relative;">
  <img src="[image-url]" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
  <div style="position: absolute; inset: 0; background: linear-gradient(transparent 40%, rgba(0,0,0,0.7));">
    <div style="position: relative; z-index: 1; padding: 10vh 5%;">
      <svg><!-- Chart or data ON TOP of image --></svg>
      <p class="annotation">One sentence explaining the insight</p>
    </div>
  </div>
</section>
```
---
## Data-first briefing — charts lead, data IS the visual
``` xml
<article style="max-width: 900px; margin: 0 auto; padding: 24px; font-family: var(--font-body);">
  <header>
    <h1 style="font-size: 32px;">[Declarative insight title]</h1>
    <div class="key-numbers" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 24px 0;">
      <div class="stat"><span class="number">$4.11</span><span class="label">National avg/gal</span></div>
    </div>
  </header>
  <section class="chart-section"><!-- Designed chart with annotation --></section>
  <footer class="source">[Source + methodology]</footer>
</article>
```
- Clean light background — no hero photo needed. The data IS the visual.
- Key number rail at top, 2-3 designed chart sections, source/methodology footer
- Every chart: insight-led title, direct labels, custom palette, annotation layer, quiet source line
---
## Tactical map — geography carries the story
``` xml
<div style="position: relative; width: 100%; height: 100vh;">
  <img src="[satellite-or-map-image]" style="width: 100%; height: 100%; object-fit: cover;">
  <svg style="position: absolute; inset: 0; width: 100%; height: 100%;">
    <path d="[shipping-lane]" stroke="#FF6B35" fill="none" stroke-width="2"/>
    <circle cx="45%" cy="38%" r="6" fill="#FF6B35"/>
  </svg>
  <div class="annotation" style="position: absolute; bottom: 8%; left: 5%;">
    <h3>[Location name]</h3><p>[Key stat anchored to geography]</p>
  </div>
</div>
```
- Satellite/map imagery as the canvas — data overlaid on real geography
- Route lines, chokepoint markers, zone boundaries drawn via SVG
- Annotations anchored to specific geographic features, not floating generically
- Mobile: labels reflow below the map at `max-width: 600px`
---
## Market terminal — dense, data-forward, tool-like
``` xml
<div style="background: #0D1117; color: #E6EDF3; font-family: 'JetBrains Mono', monospace; padding: 24px;">
  <header style="border-bottom: 1px solid #30363D; padding-bottom: 16px;">
    <h1 style="font-size: 20px; font-weight: 600;">[Ticker-style headline]</h1>
    <div class="ticker-strip" style="display: flex; gap: 24px; font-size: 14px;">
      <span>WTI <span style="color: #3FB950;">+2.3%</span></span>
      <span>Brent <span style="color: #F85149;">-1.1%</span></span>
    </div>
  </header>
  <div class="grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px;">
    <!-- Dense metric cards + charts -->
  </div>
</div>
```
- Dark background, monospace type, tickers, dense grid layout
- High data density — more numbers per viewport than any other format
- Color semantics: green = up, red = down, neutral = unchanged
- Mobile: grid stacks to single column
---
## Fact-check — claim vs evidence vs verdict
``` xml
<article style="max-width: 800px; margin: 0 auto; padding: 24px;">
  <section class="claim" style="border-left: 4px solid #D94A2B; padding-left: 16px; margin: 24px 0;">
    <span class="label">THE CLAIM</span>
    <blockquote>"[Exact quote, attributed]"</blockquote>
  </section>
  <section class="evidence">
    <span class="label">THE EVIDENCE</span>
    <!-- Chart or data showing what actually happened -->
  </section>
  <section class="verdict" style="border-left: 4px solid #20808D; padding-left: 16px;">
    <span class="label">THE VERDICT</span>
    <p>[One-sentence ruling with key stat]</p>
  </section>
</article>
```
- Clear visual distinction between claim (red), evidence (neutral), verdict (teal)
- The claim is always quoted and attributed — never paraphrased
- Evidence section uses charts/data, not just counter-text
- Photo cutouts of speakers as graphic elements, not photos in rectangles
---
## Timeline investigation — chronological spine
``` xml
<div class="timeline" style="position: relative; max-width: 900px; margin: 0 auto;">
  <div class="spine" style="position: absolute; left: 50%; width: 2px; background: var(--border); top: 0; bottom: 0;"></div>
  <div class="event" style="position: relative; padding: 24px 0;">
    <div class="date">Mar 1, 2026</div>
    <div class="card" style="margin-left: 55%; padding: 16px; border: 1px solid var(--border);">
      <h3>[Event title]</h3>
      <p>[What happened + significance]</p>
    </div>
  </div>
</div>
```
- Central spine with events alternating left/right
- Progressive disclosure on scroll — events reveal in sequence
- Key turning points get larger cards or visual emphasis
- Mobile: spine shifts to left edge, all cards stack right
---
## Annotated object (reusable sub-pattern for any format)
- Use `generate_image` for renders: `"[Object] isometric/cutaway view, studio lighting, clean background"`
- Labels use `position: absolute` with percentage `top`/`left` anchored to object features
- SVG connector lines from labels to components
- Mobile: labels reflow to numbered legend below image at `max-width: 600px`
- **3D semantic tag**: STRUCTURE / SCALE / STATE / SPACE / METAPHOR — if you can't tag it, use 2D
---
## Animation verification (all formats)
Before finalizing, check every bar chart, line chart, and timeline in your HTML. If the data has a temporal or sequential dimension, it MUST animate (bars grow, lines draw, items appear in sequence) via Intersection Observer — not just CSS fade-in. Test: does the animation convey the data's story (growth, decline, spread), or is it just an entrance effect? If just entrance → rewrite with data-driven motion.
## Image URL verification
After building the HTML, check every `<img src="...">` URL. External URLs can be stale or broken. If you cannot verify the URL loads, replace it with a different image from your search results or use `generate_image` as a backup. A broken image (blank space with ? icon) is worse than no image.
## IIIF image URLs — request appropriate resolution
URLs from Library of Congress (`tile.loc.gov`), Smithsonian, or other IIIF-compatible sources use a size parameter in the path. For **images inside the HTML**, use `/full/!1200,/0/default.jpg` (max 1200px wide — sharp on any device without loading a 5000px original). For **thumbnail and cover_image URLs** in the structured result output, use `/full/full/0/default.jpg` (full resolution). Never use `/full/pct:25/` or `/full/pct:50/` — these are too small. If you see `pct:` in an image URL, replace it.








