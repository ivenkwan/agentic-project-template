# Output Contract Reference

What to emit as a structured result block at Step 7. Consult this file when you're ready to output the final result. Your publication's backend or delivery pipeline parses this JSON — every field listed here MUST be included. Do not put any of these fields only in chat text.

The `html_file` field MUST be the **deployed URL** (starts with `https://`). Never use local workspace paths, temporary internal URLs, or placeholder values.

## The JSON block

Emit as JSON (in whatever structured output format your environment requires):

```json
{
  "title": "The dataviz headline — poetic, reframing, works standalone if screenshotted",
  "summary": "1-2 sentence description of what the visualization shows",
  "html_file": "https://...the deployed URL...",
  "cover_image": "https://...direct URL to hero image used in the dataviz (REQUIRED)",
  "thumbnail": "https://...direct URL to sharp, clean story card image (REQUIRED)",
  "sources": ["Full citation 1", "Full citation 2"],
  "editorial_rationale": "Why these graphics, what they add to the article",
  "alt_text": "Screen-reader description of the primary visualization"
}
```

The gate fields (`format_family`, `hero_asset_url`, `base_map_source`, `map_overlays_source`, `total_word_count`, `hero_word_count`) also go in this JSON block — see SKILL.md Step 0 Declaring the gates for those field rules.

## Field guidelines

## title

The headline the reader sees next to the thumbnail in your publication's feed or story card. Use sentence case (only first word and proper nouns capitalized). A poetic noun phrase, not an action verb.

- **Hard limits: ≤40 characters, ≤6 words, one line.** Story cards wrap to a second line; going over looks broken. If you're over, cut — don't abbreviate, rewrite.
- **Good (all ≤40 chars, one line, sentence case):** "The twenty-one-mile toll" (24), "The pivot away from Hormuz" (26), "The long way round" (18), "The strait that rewrote gas prices" (34).
- **Bad (too long — wrap to two lines):** "Long-Range Sanctions: Kyiv Says Drones Cost Moscow $2.3B in One Month" (69), "21 Miles — Inside the Strait Where Europe Is Drawing a New Line" (62). Numbers, colons, and em-dashes aren't shortcuts to compression; they're the telltale sign the compression hasn't happened.
- Never a CTA ("Navigate the 21 miles…", "See how M&A cratered…").
- **Must be unique to the specific story** — not a generic thematic label that could headline any article on the topic.
- **Must contain at least one concrete anchor** — a named place, named person, number, named organization, or physical object the reader can identify without reading the subtitle. Pure wordplay on an abstract concept is a reject: a reader who doesn't already know the story has no way to tell what it's about.
    - **Bad (abstract wordplay):** "The line beyond the line" — requires decoder-ring knowledge to make sense.
    - **Better:** "Israel's line around Qana" (names the country and the gas field) or "The yellow line at sea" (names the specific line and setting).
    - Tip: if you delete the subtitle and the title no longer communicates what the piece is about, the title is too abstract.
- Works standalone if screenshotted. No verbs, no imperatives, no "how to" framings.
## thumbnail (REQUIRED — null only as last resort)

The image that sells the dataviz on the story card. Think magazine cover crop, not stock photo. Sharp, clean, eye-grabbing, editorially correct.

**URL requirements:** The thumbnail must be a direct image URL (ending in `.jpg`, `.png`, `.webp`, or served as an image content type). Use source URLs from your image search results — licensed editorial photography, government agencies, public domain. Do NOT use deployed HTML page URLs, local workspace file paths, or temporary internal URLs — these are HTML pages, not images.

**Watermarked images — NEVER ship a watermarked thumbnail.** Watermarked preview images from licensed image libraries carry visible text burned into the pixels. Shipping them as a story card thumbnail shows the watermark. Rules:

- The `thumbnail` field MUST NOT be a watermarked preview URL.
- If the licensed image is the right editorial choice, use it INSIDE the HTML body (composited with data annotations, fair-use transformative) — but pick a public-domain source for the story card thumbnail: government agencies, CC0/CC-BY Wikimedia, or first-party organization photos.
- Self-check: before emitting the thumbnail, verify the URL resolves to a clean image without watermarks.

**Thumbnail sourcing fallback chain — try in order, stop at the first that works:**

1. **Public-domain or CC-licensed photo** — government agencies (.gov), Wikimedia CC0/CC-BY, or first-party organization product/facility/event photo.
2. **AI-generated cover image** — create an atmospheric cover specific to the story (mood, subject matter, setting). No watermark, always available. Constraints: no real people (generate types/roles, not named individuals), named places must be generic (a city skyline, not the specific named landmark), no logos.
3. **Null fallback** — if neither option works, emit `thumbnail: null` and let your publication's backend substitute. Prefer AI-generated cover over hitting null.

**Never acceptable as a fallback, at any step:** Watermarked preview images. If all three steps fail, let the piece hard-reject rather than ship a watermark.

**The "one thing" rule:** Single, bold focal point filling 60-70% of the frame. One face, one object, one close crop.

**What fails:** Wide-angle scenes, dark-on-dark, any text/data overlays, busy compositions, low-res images, generic stock feel, screenshots of UIs/chat interfaces/dashboards.

## cover_image

The hero image used inside the HTML body (composited with data annotations, the visual the story is built around). This field can be a watermarked preview URL from a licensed library because the HTML body composites data on top — the editorial overlay makes the preview acceptable here (fair-use transformative) even though the same URL is banned as a standalone `thumbnail`. Watermark visibility is significantly reduced under the data overlay; the story card thumbnail has no such overlay.

The watermark ban above applies ONLY to the `thumbnail` field, not to `cover_image`.
## sources

Full citations for every data point used in the visualization.
## editorial_rationale

Why these graphics, what they add to the article.
## alt_text

Screen-reader description of the primary visualization (~160 chars, key trend + conclusion).