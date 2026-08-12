import type { VirtualItem } from '@tanstack/vue-virtual'

/**
 * Finds a row's "active ancestor chain": walking backward from `beforeIndex`, the nearest
 * group-header row at each depth (0, 1, ...) that the row at `beforeIndex` sits inside of.
 *
 * Why this works at all: the flattened+expanded row model always lists a group header
 * immediately before its own children, so scanning backward from any row and taking the first
 * group-header row you hit at each depth *is* that row's containing group at that depth —
 * depth 0 is the outermost group, depth 1 is the group nested one level inside it, and so on.
 * The scan stops as soon as it reaches a depth-0 header, since there's nothing shallower to find.
 *
 * Example: for a row list positioned as
 *   0: "Engineering" (group header, depth 0)
 *   1: "Inactive"    (group header, depth 1, nested inside Engineering)
 *   2: User 1
 *   3: User 5
 * calling this with `beforeIndex = 3` (User 5) returns `[1, 0]` — "Inactive" first (the
 * nearest one found), then "Engineering".
 *
 * Shared between desktop (`dataTableGroupedVirtualScroller.composable.ts`, rows are TanStack
 * `Row`s) and mobile (`dataTableMobileVirtualScroller.composable.ts`, rows are
 * `DataTableRowViewModel`s) — the two disagree on what a "row" object looks like, so this takes
 * a small `getGroupHeaderDepth` adapter instead of a row array directly: given an index, it
 * returns that row's depth if it's a group header, or `null` if it's an ordinary row.
 */
function findAncestorHeaderIndexes(
  beforeIndex: number,
  getGroupHeaderDepth: (index: number) => number | null,
): number[] {
  const ancestorIndexes: number[] = []
  const depthsAlreadyFound = new Set<number>()

  for (let candidateIndex = beforeIndex - 1; candidateIndex >= 0; candidateIndex--) {
    const candidateDepth = getGroupHeaderDepth(candidateIndex)

    if (candidateDepth === null) {
      continue
    }

    // Already have the nearest header for this depth — a shallower depth might still be
    // further back (e.g. we found depth 1 already, but still need depth 0), so keep scanning
    // rather than stopping here.
    if (depthsAlreadyFound.has(candidateDepth)) {
      continue
    }

    depthsAlreadyFound.add(candidateDepth)
    ancestorIndexes.push(candidateIndex)

    // Depth 0 is the outermost possible group — once found, there's nothing shallower left to
    // look for, so the scan can stop early instead of walking all the way back to index 0.
    if (candidateDepth === 0) {
      break
    }
  }

  return ancestorIndexes
}

/**
 * Real `position: sticky` needs a group header's own row to stay mounted in the DOM for as long
 * as it's the active ancestor of whatever's at the top of the viewport. Left to itself, the
 * virtualizer only keeps a small contiguous window of rows mounted (the visible ones plus a
 * handful as a buffer on each side) — a header scrolled further away than that gets unmounted,
 * and once it's gone there's nothing left for `sticky` to hold onto: it disappears instead of
 * staying pinned.
 *
 * This finds whichever ancestor headers (see `findAncestorHeaderIndexes` above) are missing
 * from the virtualizer's normal render window and returns them so they can be added back in,
 * using `getKnownPosition` to place them at their real, already-known position (not a
 * re-estimated guess) — it's the *same* row every time, never swapped for a separate copy, so
 * `sticky` engages exactly on time and transitions smoothly rather than popping/jumping.
 */
export function findMissingAncestorHeaderItems(
  normallyRenderedItems: VirtualItem[],
  getGroupHeaderDepth: (index: number) => number | null,
  getKnownPosition: (index: number) => VirtualItem | undefined,
): VirtualItem[] {
  const firstRenderedIndex = normallyRenderedItems.at(0)?.index

  // Nothing is rendered, or the very first row in the whole table is already visible — either
  // way there's no ancestor further up that could need injecting.
  if (firstRenderedIndex === undefined || firstRenderedIndex === 0) {
    return []
  }

  const alreadyRenderedIndexes = new Set(normallyRenderedItems.map((item) => item.index))
  const missingAncestorItems: VirtualItem[] = []

  for (const ancestorIndex of findAncestorHeaderIndexes(firstRenderedIndex, getGroupHeaderDepth)) {
    // This ancestor is already part of the virtualizer's normal render window (e.g. its header
    // row happens to still be nearby) — nothing to inject, it's already showing up.
    if (alreadyRenderedIndexes.has(ancestorIndex)) {
      continue
    }

    const knownPosition = getKnownPosition(ancestorIndex)

    if (knownPosition !== undefined) {
      missingAncestorItems.push(knownPosition)
    }
  }

  // Rendered in index order (shallower depth first) so they read top-to-bottom the same way
  // `findAncestorHeaderIndexes` conceptually nests them, even though it discovers them in the
  // opposite order (nearest/deepest first).
  return missingAncestorItems.sort((a, b) => a.index - b.index)
}

/**
 * The injected ancestor items above now occupy real flow space immediately before the first
 * normally-rendered row — space the padding-before spacer previously accounted for as if
 * nothing rendered there at all. Shrink it by exactly their combined height so the total flow
 * height (spacer + injected ancestors + rendered rows) still matches the list's real total size
 * and nothing shifts.
 */
export function getPaddingBeforePxWithInjectedAncestors(
  normallyRenderedItems: VirtualItem[],
  injectedAncestorItems: VirtualItem[],
): number {
  const basePaddingPx = normallyRenderedItems.at(0)?.start ?? 0
  const injectedHeightPx = injectedAncestorItems.reduce((sum, item) => sum + item.size, 0)

  return basePaddingPx - injectedHeightPx
}
