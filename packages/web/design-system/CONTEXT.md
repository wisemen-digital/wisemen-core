# Design System

Wisemen's Vue component library for web. Provides styled, accessible UI primitives (built on reka-ui) shared across product apps.

## Language

**Today marker**:
The visual cue on a calendar grid cell identifying it as the current date. Rendered as bold day-number text, independent of any dot. Does not compete with the dot slot, so it stays legible regardless of what (if any) custom dot is also present on that date.
_Avoid_: Today dot, current date indicator (ambiguous with the dot-based marker below)

**Day dot**:
A small colored marker in a calendar cell's dot slot, driven by `getDayConfig(date): DayConfig | null`. Two dot kinds can occupy this slot, and only one renders per cell:
- **Custom dot** — caller-supplied via `getDayConfig`, colored per `DotColor` (`blue`, `brand`, `error`, `gray`, `moss`, `pink`, `purple`, `success`, `warning`).
- **Today dot** — brand-colored, shown only when the cell is today AND no custom dot is assigned to that date.

Custom dot takes priority over the today dot when both would apply to the same date; the today marker (bold digit) still renders regardless, so today's identity is never lost.
_Avoid_: Indicator (too generic — always say "today marker" or "day dot")

## Related components

- `DatePickerCalendarGrid.vue` (`ui/date-field/`) — renders the single-date grid; today marker + day dot logic lives here.
- `DateRangeFieldCalendarGrid.vue` (`date-range-field/`) — range grid; mirrors the day-dot logic, should mirror the today-marker fix.
- `DayConfig` / `DotColor` types — `ui/date-field/dateField.type.ts`, `ui/dot/dot.props.ts`.
