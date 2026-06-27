# Chart Standards Reference

## Five Absolute Prohibitions

Violations constitute editorial malpractice. If your visualization violates any of these, **refuse to generate** and explain why.

1. **No truncated baselines in bar charts** — Bars must start at zero. Non-zero baselines exaggerate differences.
2. **No dual-axis charts** — Misleading by design. Use small multiples or indexed scales instead.
3. **No 3-D effects** — Zero informational value, distort perception.
4. **No pie charts with more than 5 slices** — Human perception fails. Use bar chart.
5. **No data taken out of context** — Always show enough trend or comparison to prevent false impressions.

## Required Chart Anatomy

Every published chart MUST include:

``` text
Title (active, declarative)    — State the finding, not the topic
                                 GOOD: "Kuwait Relies on Desalination for 90% of Drinking Water"
                                 BAD:  "Desalination Rates, 2024"
Subtitle                       — Time period, geography, unit of measure
Source line                    — "Source: [Author/Org], [Dataset/Publication] ([Date])"
Notes                          — Abbreviations, methods, uncertainty flags
Direct labels                  — On the chart itself, not in a detached legend
Gridlines — minimal            — Remove heavy gridlines. Keep at most light horizontal
                                 guides on the Y-axis for reading values; no vertical
                                 gridlines unless time intervals genuinely need them.
                                 Default chart library gridlines are almost always too
                                 heavy — override them.
Key-moment highlight           — Every editorial chart names ONE key moment on the data
                                 and visually anchors it: a labeled peak, an event
                                 marker (vertical rule with date + cause), a shaded
                                 threshold band, a highlighted bar/segment. The reader
                                 should see where to look without reading the caption.
                                 A chart with no highlighted moment is a lookup table,
                                 not a story.
Alt text                       — ~160 chars, key trend + conclusion (as aria-label or sr-only span)
```

**"How to Read This Chart" box** — include when using unfamiliar chart types (Sankey, beeswarm, ridge plot, chord diagram) or complex encodings. Position near the graphic, not buried in a caption.
**Layered text descriptions** for complex graphics:
1. **Alt text** (~150 chars): Chart type + key finding, for screen readers
2. **Caption** (1-2 sentences): Main finding + methodology note, visible to all readers
3. **Long description** (for complex graphics): Expandable section describing trends, outliers, and patterns in prose. Provide a data table as alternative for screen reader users.
## LLM-default rejection test — if ANY apply, rebuild

Every editorial chart is the sum of decisions _against_ library defaults. Default palettes, legends, axis titles, and fonts are what make a chart look generated rather than edited. Override every one.

1. **Default color palette** — Plotly `qualitative.Plotly`, D3 `schemeCategory10`, matplotlib default. Override: custom palette, one accent with an editorial job.
2. **Detached legend in a box** — direct inline labels on the data. If the label doesn't fit inline, you have too many series. (Carve-out: continuous/sequential/diverging color scales — heatmaps, choropleths, color ramps — use a compact scale legend, since you can't inline a gradient onto the data. The rule is for categorical series.)
3. **Column-name axis titles** — "revenue_usd" is the data. Axis titles must be editorial ("Billions of dollars," "Barrels per day, Gulf-origin").
4. **Zero editorial annotations** — ≥2 annotations per chart that interpret specific data points, not data labels describing values.
5. **No highlighted key moment** — shaded period, labeled peak, vertical event rule, threshold band, or callout marker. A neutral timeline with nothing anchored is a lookup table.
6. **Default chart-library fonts** — chart text uses the piece's display/body fonts via CSS overrides.
7. **All series equal visual weight** — one primary series, others muted. Every editorial chart has a protagonist. (Carve-out: small multiples — each panel is its own protagonist, so uniform styling across panels is correct.)
8. **Flat white background** — off-white / warm neutral / subtle texture / grid-backdrop / rule at top. Pure `#FFFFFF` is the signature of a default export.
**Scratchpad before any chart — one line each:**
``` text
Palette:       [hex values + accent's job]
Legend:        [inline label placement]
Axis titles:   [editorial phrasing + units]
Annotations:   [≥2 editorial sentences]
Key moment:    [what / how anchored]
Fonts:         [display / body / CSS application]
Visual weight: [primary + muting approach]
Surface:       [specific treatment]
```

Any entry blank or "default" = chart is a reject.
## Chart-Specific Guidance

- **Bar charts**: Always start Y-axis at zero. Use horizontal bars for long labels or ranked comparisons.
- **Line charts**: Do NOT force zero baseline — it can hide meaningful variation. Emphasize rate of change.
- **Pie charts**: 3-5 slices maximum. Never for time series. Beyond 5, use bar chart.
- **Scatterplots**: Include trendline when correlation is the story. Always label outliers directly.
- **Small multiples**: Preferred over grouped/stacked when comparing many categories — reduces cognitive load.
- **Scrollytelling**: Default narrative spine for multi-beat stories. Sticky graphic panel stays fixed while text cards scroll alongside. Each scroll step changes exactly one thing.
## Typography

Chart typography is intentionally smaller than page-level display sizes — charts are inline components, not page headers.

``` text
Title:         18-20px, bold 700
Subtitle:      14px, secondary text color
Axis labels:   13px, regular weight
Data labels:   12-13px, bold
Source/Notes:   12px, tertiary color
```
Minimum 16px for body text on mobile. Axis labels, data labels, and source lines may go to 12-13px.
## Color System

This palette is designed for data visualization: higher-saturation blues for legibility at small sizes, sufficient contrast between categorical series, and WCAG AA compliance on both light and dark backgrounds. Adapt hues to your publication's brand while keeping the semantic roles.

**Example data visualization palette:**
``` css
:root {
  --color-primary: #1B6AC9;        /* main highlight, primary series */
  --color-primary-light: #E8F0FE;  /* callout backgrounds */
  --color-secondary: #D97706;      /* second series, annotations */
  --color-accent: #059669;         /* third series, positive change */
  --color-danger: #C53030;         /* alerts, decline, strike markers */
  --color-muted: #CBD5E0;          /* de-emphasized, comparison baseline */
  --color-text: #1A1A1A;
  --color-text-secondary: #5A5A5A;
  --color-text-tertiary: #8A8A8A;
  --color-bg: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-neutral-100: #F0F0F0;
  --color-neutral-200: #E2E2E2;
}
```

Always include `@media (prefers-color-scheme: dark)` with inverted equivalents:
``` css
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #5B9AE8;
    --color-secondary: #FBBF24;
    --color-accent: #34D399;
    --color-danger: #FC8181;
    --color-muted: #4A5568;
    --color-text: #F0F0F0;
    --color-text-secondary: #AAAAAA;
    --color-text-tertiary: #777777;
    --color-bg: #111111;
    --color-surface: #1A1A1A;
    --color-neutral-100: #222222;
    --color-neutral-200: #333333;
  }
}
```

**Mandatory color rules:**
1. Colorblind-safe — never rely on color alone; add labels, patterns, or texture
2. WCAG AA contrast: 4.5:1 normal text, 3:1 large text and graphical elements
3. Maximum 7 categorical colors — consolidate or use small multiples
4. Consistent encoding: once a color = a group, maintain across all charts in the piece
5. No blue/pink for gender; no red/green without texture; red connotes "bad" in Western contexts
6. Map ethics: no red arrows on migration maps; use neutral blues/grays for flows
7. **Perceptually uniform scales**: For sequential/diverging data, use Viridis, Plasma, or ColorBrewer ramps — never rainbow scales. For diverging scales, ensure both ends are distinguishable from the middle.
8. Every color shift must map to a data distinction — never use color differences arbitrarily
## Semantic Color

Use color that carries meaning:
- **Fire, conflict, danger**: Warm reds and oranges
- **Heat, temperature**: Yellow-red gradient
- **Economic increase/tariffs**: Red for increases, green for decreases (with texture for colorblind)
- **Water, calm, neutral**: Blues and cool grays
- **Dark backgrounds**: Use for dramatic subjects (night sky, space, conflict) — not as default.
## Proportionality

- Size circles by **area**, not radius (radius encoding overstates quadratically)
- Do not stretch/compress charts to manipulate perceived slope
- Never invert axes to make increases appear as decreases
- In small multiples, keep axes identical unless explicitly noted
## Ordering Principles

- Sort bar charts by value (highest to lowest or vice versa), not alphabetically
- Sort categories by natural sequence when one exists (age groups, months, stages)
- Sort alphabetically only for lookup-oriented graphics
- Maintain consistent order across small multiples
## Common Errors

**Technical errors** (never ship these):
- Truncated bar chart baselines
- Dual-axis charts
- 3-D effects
- Icons sized by radius instead of area
- Inconsistent scales in small multiples
- Missing source citations

**Editorial errors** (catch in self-review):
- Titles that describe topic instead of stating finding
- Cherry-picked date ranges
- Nominal dollars without inflation adjustment
- Rates/proportions without sample size or confidence intervals
- Log scales without clear labeling
- Color choices that fail colorblind or contrast tests

**Ethical errors** (audit before publish):
- Mapping individuals instead of aggregating
- Stereotypical icons or color choices
- Only dominant groups as baseline
- "Other" aggregating marginalized groups silently
- Alarmist colors (red/orange) for migration or demographic data