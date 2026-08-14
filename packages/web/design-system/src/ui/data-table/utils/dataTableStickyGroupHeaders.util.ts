/**
 * Sticky group headers, per group, via native CSS `position: sticky` — see
 * `chunkVirtualRowEntriesByGroup` below for the entry point.
 *
 * The depth-0 header (e.g. a department) and a nested depth-1 header (e.g. a status within
 * that department) need DIFFERENT `position: sticky` containing-block scopes, not the same
 * one — this is the key fact that makes the whole scheme work, discovered only after several
 * single-scope structures each failed a different way:
 *
 * - Depth-0's containing block must span its ENTIRE top-level group (every subgroup inside
 *   it), so there is only ever one depth-0 element for that whole group. It can neither be
 *   duplicated (two sticky containers can't both claim to be "the" depth-0 for the same
 *   group) nor disappear-and-reappear (its containing block never ends until the group itself
 *   does, so it's always available to re-pin).
 * - Depth-1's containing block must span only ITS OWN subgroup — this is what lets it release
 *   cleanly the instant its subgroup ends and hand off to the next subgroup's own depth-1,
 *   exactly like ordinary sequential sticky section headers already do. Giving depth-1 the
 *   SAME (department-wide) scope as depth-0 was tried and rejected: it kept an
 *   already-finished subgroup's header eligible to stay pinned far past its own content,
 *   producing the same duplicate-header symptom this scheme exists to avoid.
 *
 * ```
 * virtualizer's visible rows
 *        │
 *        ▼
 * groupEntriesIntoTopLevelChunks   — bucket consecutive rows into one chunk per top-level
 *        │                           group (e.g. one chunk per department) — this chunk is
 *        │                           depth-0's containing block
 *        ▼
 * each top-level chunk's own entries are further split into sub-chunks by deepest active
 * group (e.g. one sub-chunk per status within that department) — each sub-chunk is depth-1's
 * containing block
 *        │
 *        ▼
 * withMissingHeaderEntriesRestored   — is the top-level chunk's own depth-0 header, or a
 *        │                             sub-chunk's own depth-1 header, missing (scrolled out
 *        │                             of the virtualizer's render window)? if so, look it up
 *        │                             directly (not limited by the virtualizer) and restore it
 *        ▼
 * chunks, each guaranteed to contain its own depth-0 header and every sub-chunk's own depth-1
 * header
 *        │
 *        ▼
 * template renders one <div> per top-level chunk (depth-0's sticky container), containing one
 * <div> per sub-chunk (depth-1's sticky container)
 * ```
 */
export interface ChunkableRowEntry {
  topLevelGroupRowId: string
  index: number
}

export interface RowSubChunk<TEntry extends ChunkableRowEntry> {
  entries: TEntry[]
  key: string
}

export interface RowChunk<TEntry extends ChunkableRowEntry> {
  key: string
  subChunks: RowSubChunk<TEntry>[]
}

function groupEntriesByKey<TEntry>(
  entries: TEntry[],
  getKey: (entry: TEntry) => string,
): {
  entries: TEntry[]
  key: string
}[] {
  const groups: {
    entries: TEntry[]
    key: string
  }[] = []

  for (const entry of entries) {
    const lastGroup = groups.at(-1)
    const key = getKey(entry)
    const canAppendToLastGroup = lastGroup !== undefined && lastGroup.key === key

    if (canAppendToLastGroup) {
      lastGroup.entries.push(entry)
    }
    else {
      groups.push({
        entries: [
          entry,
        ],
        key,
      })
    }
  }

  return groups
}

export function groupEntriesIntoChunks<TEntry extends ChunkableRowEntry>(
  entries: TEntry[],
  getDeepestActiveGroupRowId: (entry: TEntry) => string,
): RowChunk<TEntry>[] {
  const topLevelGroups = groupEntriesByKey(entries, (entry) => entry.topLevelGroupRowId)

  return topLevelGroups.map((topLevelGroup) => ({
    key: topLevelGroup.key,
    subChunks: groupEntriesByKey(topLevelGroup.entries, getDeepestActiveGroupRowId),
  }))
}

/**
 * A chunk's header row can scroll further above the viewport than the virtualizer's `overscan`
 * setting keeps mounted in the DOM. Once that happens, `position: sticky` has nothing left to
 * hold onto, and the header disappears instead of staying pinned. This walks backward through
 * `getEntryAtIndex` (which must be backed by the complete, always-fully-populated row list —
 * unlike the virtualizer's render window, which only has a small window of rows) starting from
 * `startIndex`, to re-find the header row at `targetDepth` if it isn't already among
 * `alreadyPresentEntries`, so it can be added back in even though the virtualizer itself dropped
 * it.
 *
 * The walk stops once it crosses into a different top-level group (via `topLevelGroupRowId`) —
 * a depth-1 header's own missing-header walk must never cross into a sibling subgroup or a
 * different department, and a depth-0 header's walk never needs to look further back than its
 * own top-level group's first row anyway.
 */
function findMissingHeaderEntry<TEntry extends ChunkableRowEntry>(
  startIndex: number,
  topLevelGroupRowId: string,
  targetDepth: number,
  alreadyPresentEntries: TEntry[],
  getEntryAtIndex: (index: number) => TEntry,
  getHeaderRowDepth: (entry: TEntry) => number | null,
): TEntry | null {
  const alreadyPresent = alreadyPresentEntries.some((entry) => getHeaderRowDepth(entry) === targetDepth)

  if (alreadyPresent) {
    return null
  }

  for (let candidateIndex = startIndex; candidateIndex >= 0; candidateIndex--) {
    const candidateEntry = getEntryAtIndex(candidateIndex)

    if (candidateEntry.topLevelGroupRowId !== topLevelGroupRowId) {
      break
    }

    if (getHeaderRowDepth(candidateEntry) === targetDepth) {
      return candidateEntry
    }
  }

  return null
}

export function withMissingHeaderEntriesRestored<TEntry extends ChunkableRowEntry>(
  chunk: RowChunk<TEntry>,
  getEntryAtIndex: (index: number) => TEntry,
  getHeaderRowDepth: (entry: TEntry) => number | null,
): RowChunk<TEntry> {
  const firstSubChunk = chunk.subChunks[0]!
  const firstEntry = firstSubChunk.entries[0]!

  const missingDepth0Entry = findMissingHeaderEntry(
    firstEntry.index,
    chunk.key,
    0,
    firstSubChunk.entries,
    getEntryAtIndex,
    getHeaderRowDepth,
  )

  const restoredSubChunks = chunk.subChunks.map((subChunk) => {
    const subChunkFirstEntry = subChunk.entries[0]!
    const missingDepth1Entry = findMissingHeaderEntry(
      subChunkFirstEntry.index,
      chunk.key,
      1,
      subChunk.entries,
      getEntryAtIndex,
      getHeaderRowDepth,
    )

    return missingDepth1Entry === null
      ? subChunk
      : {
          ...subChunk,
          entries: [
            missingDepth1Entry,
            ...subChunk.entries,
          ],
        }
  })

  if (missingDepth0Entry === null) {
    return {
      ...chunk,
      subChunks: restoredSubChunks,
    }
  }

  const [
    firstRestoredSubChunk,
    ...restRestoredSubChunks
  ] = restoredSubChunks

  return {
    ...chunk,
    subChunks: [
      {
        ...firstRestoredSubChunk!,
        entries: [
          missingDepth0Entry,
          ...firstRestoredSubChunk!.entries,
        ],
      },
      ...restRestoredSubChunks,
    ],
  }
}

export function chunkVirtualRowEntriesByGroup<TEntry extends ChunkableRowEntry>(
  entries: TEntry[],
  getEntryAtIndex: (index: number) => TEntry,
  getHeaderRowDepth: (entry: TEntry) => number | null,
  getDeepestActiveGroupRowId: (entry: TEntry) => string,
): RowChunk<TEntry>[] {
  const chunksWithoutMissingHeaders = groupEntriesIntoChunks(entries, getDeepestActiveGroupRowId)

  return chunksWithoutMissingHeaders.map(
    (chunk) => withMissingHeaderEntriesRestored(chunk, getEntryAtIndex, getHeaderRowDepth),
  )
}
