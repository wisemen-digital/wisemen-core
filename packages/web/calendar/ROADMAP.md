# Roadmap

Synthesized from two source documents: `REQUIREMENTS.md` (API-first spec: props/emits/slots, all four calendar views, drag & drop) and a board-summary doc (`reusable-calendar-timeline-summary.md`, foundation/architecture framing: item vs. occurrence model, dashboard timelines, accessibility/performance as non-negotiable). The two disagree in places — where they do, this roadmap says so rather than picking one silently. Both live in the planning context this roadmap was built from, not in this package.

Status legend: ✅ decided/in progress · 🔜 next · ⏸️ deferred, not yet scheduled · ❓ open question, needs a decision before it can be scheduled

---

## Phase 1 — Week view, read-only (current)

The current iteration. See [docs/adr/](docs/adr/) 0001–0005 for the decisions behind this scope.

- ✅ `CalendarEvent<TMeta>` data model (REQUIREMENTS.md naming, not taxi-hendriks' `CalendarItem`), with reserved-but-unused occurrence/item-identity fields
- ✅ Week view: time-grid rendering, hourly rows, basic side-by-side overlap columns
- ✅ Navigation: prev/next/today via `currentDate` v-model, driven by exported pure helpers `getNextWeekDate`/`getPreviousWeekDate`/`getTodayDate` (not component-instance methods — see below)
- ✅ Live current-time indicator
- ✅ Minimal prop surface: `events`, `currentDate`, `startHour`, `endHour`, `firstDayOfWeek`
- ✅ `event-click` emit, default event rendering + `#week-event` slot override
- ✅ Package scaffolding mirroring `packages/web/dates`; Storybook demo as the "done" deliverable
- Explicitly out of scope for this phase: drag/resize/create, Month/Day/Agenda views, timelines, virtualization, responsive/mobile switching, i18n prop, background events, deep keyboard-nav/a11y, recurring events, real consumer wiring (taxi-hendriks or otherwise)

## Phase 2 — Editing (🔜 next, unscheduled)

REQUIREMENTS.md's `editable`/`selectable` surface, deferred out of Phase 1 per [ADR 0002](docs/adr/0002-read-only-iteration-1.md).

- Drag-to-move → `event-drop`
- Resize via handle → `event-resize`
- Drag-on-empty-space create → `event-create` (`editable.create` / `selectable`)
- Snap-to-interval (`snapInterval`), edge auto-scroll while dragging
- Ghost preview during drag (`isGhost` in event slots)
- `revert()` escape hatch on drop/resize payloads
- Per-event `editable: false` opt-out
- Alt+drag duplicate (REQUIREMENTS.md only — not mentioned in the board doc; confirm still wanted before building)
- Live drag-validation gate (`canDropEvent`-style prop) called during drag to allow/block a drop target in real time — distinct from `revert()`, which only rejects after a drop already committed. Needed for rules like locked events or no-overlap policies to give feedback mid-drag rather than after. (Prior art: ReUI Event Calendar's `canDropEvent`.)

## Phase 3 — Remaining calendar views (⏸️ deferred)

- Month view: grid with overflow ("+N more"), multi-day event bars spanning week rows, neighboring-month day handling
- Day view: single-column case of the week time-grid
- Agenda/list view: chronological, grouped by day — named in both docs as desired but not committed to either's MVP; needs scheduling once Phase 1/2 land

## Phase 4 — Dashboard timelines (⏸️ deferred)

Board-summary doc only — not in REQUIREMENTS.md at all. Resource-oriented, distinct from the calendar views above.

- Week dashboard timeline: resources vertically, time horizontally, real bar positions/widths, >400 row virtualization, continuation indicators, stacking with hover-to-front
- Month dashboard timeline: one cell per resource per day, priority-color state, badges, empty/unscheduled/unknown distinction, collapsed-group priority rollups
- Day dashboard timeline: ❓ board doc explicitly flags this as "described but not committed to MVP" — needs a scope decision, including whether a dedicated day range is even necessary

## Phase 5 — Responsive / mobile (⏸️ deferred)

- Board doc's preferred direction: transform rather than fork — mini-month + shared day-list on narrow screens, not a separate mobile calendar
- Touch drag-and-drop, swipe navigation gesture
- `isResponsive` / `mobileBreakpoint` props from REQUIREMENTS.md
- Narrow-screen behavior for week/day (fewer columns vs. horizontal scroll) — ❓ open per board doc, no preferred answer given

## Phase 6 — Accessibility & resilience hardening (⏸️ deferred, but flagged non-negotiable by board doc)

Called out as a quality bar, not a feature — the board doc treats this as required before the package is production-ready, independent of which views/phases are done.

- One logical Tab stop per grid, arrow-key navigation inside it
- Distinguishable focused/selected/current-date states, never color-only
- Projectable screen-reader labels for domain-specific meaning
- Accessible list alternative for complex timelines
- Focus-return on dialog/popover close, reduced-motion support
- Loading skeletons matched to final layout, stale-data-visible-during-refresh, explicit error/empty states
- Performance targets: ~500-item week view layout/redraw under 16ms; smooth 400+ row timelines including on Windows; "now" indicator updates without full layout recalculation

## Later / not yet scoped into any phase

- Recurring events (`rrule` field) — ❓ open in both docs; REQUIREMENTS.md asks whether to accept pre-expanded events only or support `rrule` from the start. If `rrule` expansion is built, needs a hard occurrence cap to bound worst-case expansion (e.g. an unbounded `FREQ=DAILY` with no `UNTIL`/`COUNT`). (Prior art: ReUI Event Calendar's RFC 5545 subset expander.)
- External drag from sidebar (REQUIREMENTS.md, opt-in/v2)
- Resource / multi-column calendar views (REQUIREMENTS.md, explicitly out of scope v1) — note: board doc's week-calendar section asks whether calendar columns may represent resources, which edges toward this; not reconciled yet
- iCalendar import/export (REQUIREMENTS.md, explicitly out of scope)
- Overview navigator/strip, free-form timeline zoom, deeply nested resource groups (board doc, explicitly deferred)
- Offline support, broader public API surface (board doc, ❓ open — "interconnected" with recurrence decision, affects data model and sync)
- taxi-hendriks migration/compat layer — not scheduled; naming already diverges by deliberate choice, see [ADR 0003](docs/adr/0003-calendar-event-not-calendar-item-naming.md)

## Cross-cutting open questions (not yet assigned to a phase)

Carried over from the board doc's "Decisions still required," unresolved regardless of phasing:

- Fixed six-row vs. dynamic month-row counts
- Whether neighboring-month days show events or only date numbers
- Whether multi-day events can appear in the month overflow menu
- Whether repeated occurrences of the same item merge visually
- Equal-width vs. stacked overlap presentation (Phase 1 picked equal-width columns for Week specifically; not yet a package-wide decision — see [ADR 0005](docs/adr/0005-fresh-overlap-layout-not-ported.md))
- Cross-midnight event handling: split vs. move into an all-day area
- Whether month-timeline cells merge into visual runs or stay gutter-separated
- Maximum resource-group nesting depth; maximum totals rows
- What an overview strip would even visualize
- Whether cross-resource dragging/reassignment belongs in scope at all
- Data validation responsibility: server clamps, shared composable clamps, or an explicit split
- `#header` slot: full replacement or always-rendered-default-plus-`#header-actions`-only (REQUIREMENTS.md open question 4)
