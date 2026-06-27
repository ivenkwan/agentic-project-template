# Interaction Design & Accessibility Reference

## Interaction Design

Not every graphic needs interactivity. But when it does:

1. **The default view must already tell a story.** The first screen communicates a clear insight with zero interaction.
2. **Maximum 2-3 interactive controls per piece.** Simple toggles or hover states outperform complex dashboards for news audiences.
3. **Personalization via light input.** Asking for a ZIP code, age, or salary and contextualizing it in the broader dataset is one of the most powerful patterns.
4. **Time scrubbers**: For temporal data, a draggable slider with clear start/end labels.
5. **Filters**: 2-4 toggles maximum. Show count of items when a filter is active.
6. **Details on demand**: Click/tap to reveal precise values — not hover-only. Hover-triggered content is invisible to touch devices, screen readers, and users with motor impairments.
7. **Keyboard navigation**: All interactive features must work via keyboard alone. Tab moves between elements, Enter/Space activates, Arrow keys navigate within components, Escape closes modals/tooltips. Provide visible focus indicators.
8. **Encode affordances visually.** Subtle hover states, clear buttons, visible hints.
9. **Design mobile-first.** Tall, thumb-friendly interfaces.
10. **Animation caveats**: Racing bar charts and animated transitions can mislead — they emphasize fast changes and hide slow trends. Always provide a static end-state comparison alongside any animation.

## Scrollytelling Structure

For multi-beat stories, scrollytelling is the default narrative spine:

- **Sticky graphic panel** stays fixed while text cards scroll alongside
- Each scroll step changes **exactly one thing**: a viewport shift, a time increment, a data subset highlighted, or an annotation added
- **Guided tour first**: Users see the curated narrative before any free exploration
- **Progressive disclosure**: Start simple, layer complexity with each beat
- The first frame must tell a complete story on its own
- **Graceful degradation**: If JavaScript fails, the content still reads as static frames with captions

## Inclusive Design Review

1. People-first language
2. No default orderings implying hierarchy — order by data value or alphabetically
3. Explain all "Other" groupings explicitly
4. Audit icons for stereotypes
5. Small multiples over grouped bars for demographic comparisons
6. Note missing populations transparently
7. Audit color choices for political/cultural weight

## Accessibility Requirements

- Colorblind-safe (not color-only encoding)
- WCAG AA contrast ratios (4.5:1 normal text, 3:1 large text and graphical elements)
- Alt text written for every graphic (~160 chars, key trend + conclusion)
- 16px minimum font on mobile (14px acceptable for axis labels and source lines only)
- Mobile-legible
- All interactive features work via keyboard alone

## Bounds & Clipping

- Every text label, annotation box, and data marker fits within the viewport
- For Canvas: verify `x + width < canvasWidth` and `x > 0`, same for y
- For SVG: verify all elements fall within the viewBox
- Run a mental "edge walk": check the four edges of the viewport
- If annotations overlap each other or key labels, reposition