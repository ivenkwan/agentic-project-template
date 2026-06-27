# Map Standards Reference

## Type Selection

- **Choropleth**: Rates and proportions only (NOT raw counts — large areas dominate visually)
- **Proportional symbol/bubble**: Raw counts — size by area, never radius
- **Pin/dot map**: Specific locations, discrete events. Cluster or heatmap at zoomed-out scales
- **Cartogram**: Label the distortion in title/subtitle

## Requirements

- Equal-Area projections (Albers, Lambert) for choropleth; Web Mercator only for interactive tiles
- Insets for non-contiguous regions
- Scale bars when distance matters
- Cite data source AND basemap: `Data: [source]; Basemap: © OpenStreetMap contributors`
- Text callouts on map for key features; bold cities, italic rivers, CAPS countries
- Limit to 5-10 labels to prevent crowding
- Consider whether the phenomenon should even be mapped — cybercrime, financial crime, etc. can be poorly served by maps

## Choropleth Integrity

- **Classification scheme bias**: Equal interval, quantile, natural breaks, and manual breaks all tell different stories from the same data. Label break points clearly in the legend. Consider showing the distribution (histogram) alongside the map.
- **MAUP caveat**: Aggregating data to ZIP codes vs. counties vs. states changes apparent patterns. When boundary choice affects the story, note: "Patterns depend on boundary choices. Finer-grained data may show different results."
- **The Alaska problem**: Large geographic units dominate visual attention but may have tiny populations. Use cartograms (size by population), inset maps, or switch to proportional symbols.

## Boundary & Coastline Styling

Borders must carry real information but never overpower the data.

1. **De-emphasize borders, emphasize data.** Use light, thin strokes for country lines.
2. **Line hierarchy by importance:**
    - Strongest stroke: international borders (solid, ~1.5px)
    - Lighter stroke: internal admin boundaries (solid, ~0.8px)
    - Dashed: disputed borders, with legend explanation
3. **Simplify coastlines at small scales.** Intricate wiggles become fuzz at article sizes.
4. **Make land-water instantly legible.** Distinct land fill vs. water tone.
5. **Neutral, non-politicized boundary colors.** Default to muted gray for borders, never flag colors.
6. **Contested areas:** Distinct dashed style, clearly explained in legend and notes.
7. **Label anchor geography.** Always label a few anchor countries/cities plus familiar features.
8. **Legibility check at actual size.**

## Geographic Accuracy — HARD REQUIREMENT

**Every coastline, border, and geographic shape must come from real geographic data. NEVER draw geography freehand as SVG paths.** Hand-drawn maps get borders wrong, coastlines wrong, and relative positions wrong. This is a factual error equivalent to publishing wrong numbers.

**How to get accurate geography:**
1. **Use D3.js with real GeoJSON.** Fetch country outlines from Natural Earth: `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson`. Filter to the country you need. Use `d3.geoMercator().fitSize()` to project correctly.
2. **Use Leaflet with real tile layers** for interactive maps. OpenStreetMap, Stamen, or CartoDB tiles.
3. **Plot locations using real coordinates.** Look up lat/lon from OpenStreetMap or Global Energy Monitor. Use the D3 projection to convert coordinates to screen position. Never estimate or approximate positions.

**If any map in your output has SVG paths drawn from approximate coordinates or "eyeballed" positions instead of real GeoJSON data, the map is wrong.** The Cuba test proved this: a hand-drawn SVG outline of Cuba was visibly incorrect and plant locations didn't align with the coastline. The fix was real GeoJSON + verified coordinates.

**Schematic / "simplified diagram" carve-out — NONE.** There is no artistic exception for hand-drawn country shapes or coastlines, regardless of labeling. Captioning something as "Simplified diagram" does not fix an approximated Malaysia or an invented Sumatra — readers see the shape at face value. If you want a schematic-style illustration, build it on real GeoJSON with stylized rendering (no labels, muted colors, reduced detail), or use a shipping-lane overlay on a real OSM/satellite tile. Pure hand-drawn geographic silhouettes, no matter how editorial the styling, are a reject.

## Satellite imagery — labels require full verification, else strip back

**The failure class:** agent hand-places text labels on satellite imagery ("IRAN," "STRAIT OF HORMUZ," "QATAR · RAS LAFFAN") and gets the geography wrong. Peninsulas labeled as the wrong country, strait markers placed over land, facility labels on the wrong coast. Orbital imagery is ambiguous — coastlines look different from space than they do on a reference map — and the agent does not reliably identify specific features without external verification. Wrong labels on a satellite image are among the highest-damage outputs we ship: a reader takes placement at face value.

**The principle:** when the ambitious craft version would fail verification, strip back to what the agent can do reliably. A satellite hero with a sharp caption is editorially sharper than a satellite hero with wrong labels — every time. The stripped version is not a compromise; it is the better output when verification fails.

## Default path — full four-step verification before any label is placed

Before adding ANY label to a satellite or labeled-map image, declare all four in scratchpad. If any step cannot be completed confidently, go to the fallback — do not label.

1. **Image orientation** — which way is north? Cite evidence (coastline direction, position of a known bright cluster, shadow direction).
2. **Three named anchor features with evidence in the image** — not "Iran is probably here." Name a feature you can see and say why. "Dubai: bright coastal cluster at lower-right, with the recognizable Palm Jumeirah crescent," "Tehran: dense inland cluster, north-central," "Strait of Hormuz: narrow water channel between two peninsula tips at east." If you cannot name three features with visible evidence, the image is too ambiguous — go to the fallback.
3. **Every label's position interpolated from the three step-2 anchors** — state the label's lat/lon and its position relative to the anchors: "IRAN label at ~28°N 53°E, placed by interpolating between Dubai (step-2 anchor, lower-right) and Tehran (step-2 anchor, north-central) — lands roughly 40% from left, 30% from top." The pixel coordinate is derived from the anchors, not computed independently. If you can't place a label by interpolating from named anchors, you don't have enough anchors — go back to step 2 or to the fallback.
4. **Cross-check against a labeled reference map** — pull a labeled reference via `get_url_content` (Wikipedia region map, Google Maps screenshot, official geographic reference). For each label, state the match explicitly: "QATAR peninsula shape matches Wikipedia reference map — verified." If the shapes don't match or you cannot locate the feature on the reference, go to the fallback.

## Fallback — ship the satellite image without labels

1. **No text labels on the image itself.** No "IRAN," no "STRAIT OF HORMUZ," no floating facility markers.
2. **Caption below the image** carries geographic context in prose: "The Persian Gulf at night. The corridor choking one-fifth of global LNG trade runs through the narrow water at right." The reader understands from caption + context, not from hand-placed text.
3. **Stat cards in a separate layout block beside or below** the image — never absolutely-positioned on top of it — carry quantitative beats: `STRAIT CLOSED · 21nm` / `SUPPLY LOST · 90%`. Put them in their own `<section>` or grid row adjacent to the image, not as `position: absolute` overlays. These cards do not require geographic positioning; they are data summaries, not map labels.
4. **If the story genuinely needs precise location callouts** (specific port, exact chokepoint coordinate, named facility pinpointed on a map), satellite imagery is the wrong tool — use a tactical map with OSM tiles where labels come from the map data itself, not from agent placement.
5. **Pre-annotated satellite imagery** (from licensed editorial sources or NASA) where labels are PART of the source image is fine — those labels are editorial decisions by the original source, not agent additions.

## Map Verification Protocol

Before shipping any map, verify every placed element against reality. Maps carry implicit authority.

**Study the real geography first:**
1. Before placing a single element, pull up a real reference — an AIS vessel tracking screenshot, an EIA chokepoint diagram, a satellite view, an official map. Trace real routes, real coastlines, real positions. Do NOT draw from memory.
2. **Label then route**: Place all geographic landmarks first. Confirm they are correct. Only then draw routes, flow lines, or movement paths.
**Coordinate Verification:**
3. Look up the actual latitude/longitude of every facility, city, or point you place on the map. Use authoritative sources.
4. For named facilities (plants, airports, bases), find the specific facility coordinates, not just the city center.
5. After placing all points, sanity-check relative positions against a real map.
**Viewport Completeness:**
6. List every country, facility, and entity mentioned in the article AND in the charts. Every one must either be visible on the map or noted as off-frame with a directional indicator.
7. If a stat callout mentions a place not on the map, that's an editorial failure.
**Route and Flow Verification:**
8. For every flow line or shipping route: does it cross land? Does it pass through an island? Trace each path segment. A shipping lane that cuts across a peninsula destroys credibility.
9. Reference real traffic separation schemes, official shipping lanes, or known transit corridors.
**Date & Attribution Accuracy:**
10. Cross-reference the exact date of every event marked on the map against at minimum 2 news sources.
11. If attribution is disputed, say so explicitly on the map — not just in body text.
**Terminology & Sensitivity:**
12. Check whether geographic names have politically sensitive variants (Persian Gulf / Arabian Gulf, Sea of Japan / East Sea). Note the choice if the audience may expect the alternative.
13. For conflict zones: verify current territorial control before drawing borders. Use dashed lines for disputed boundaries.
**Completeness Cross-Check:**
14. Read the graphic's title, subtitle, and all annotation text aloud. Ask: "Would someone who has never heard of this story understand what happened, where, and why it matters — from the map alone?"