import type { Row } from '@tanstack/vue-table'
import type { VirtualItem } from '@tanstack/vue-virtual'
import type { Ref } from 'vue'
import { computed } from 'vue'

import type { DataTableRowViewModel } from '@/ui/data-table/types/dataTableRowViewModel.type'
import type {
  RowChunk,
  RowSubChunk,
} from '@/ui/data-table/utils/dataTableStickyGroupHeaders.util'
import { chunkVirtualRowEntriesByGroup } from '@/ui/data-table/utils/dataTableStickyGroupHeaders.util'

export interface GroupChunkEntry<TItem> {
  topLevelGroupRowId: string
  index: number
  key: number | string
  viewModel: DataTableRowViewModel<TItem>
}

/**
 * Shared between desktop (`DataTable.vue`, rows come from `table.getRowModel().rows` directly)
 * and mobile (`DataTableMobileList.vue`, rows come wrapped inside `DataTableRowViewModel`) — both
 * need the exact same chunk/sub-chunk grouping and header-entry lookups, differing only in how a
 * `Row<TItem>` is reached from a given index and in the group header's own fixed height (desktop
 * and mobile group-header rows aren't the same height). See `dataTableStickyGroupHeaders.util.ts`
 * for why depth-0 and depth-1 need separate containing-block scopes in the first place.
 */
export function useDataTableStickyGroupChunks<TItem>(options: {
  getRowAtIndex: (index: number) => Row<TItem>
  getViewModelAtIndex: (index: number) => DataTableRowViewModel<TItem>
  groupHeaderHeightPx: number
  paddingBeforePxFromVirtualizer: Ref<number>
  virtualItems: Ref<VirtualItem[]>
}): {
  chunks: Readonly<Ref<RowChunk<GroupChunkEntry<TItem>>[]>>
  getChunkGroupHeaderEntry: (chunk: RowChunk<GroupChunkEntry<TItem>>) => GroupChunkEntry<TItem>[]
  getSubChunkDataRowEntries: (subChunk: RowSubChunk<GroupChunkEntry<TItem>>) => GroupChunkEntry<TItem>[]
  getSubChunkSubgroupHeaderEntry: (subChunk: RowSubChunk<GroupChunkEntry<TItem>>) => GroupChunkEntry<TItem>[]
  paddingBeforePx: Readonly<Ref<number>>
} {
  // A header row joins whichever sub-chunk its own first child row belongs to (walking forward
  // through consecutive header rows — depth 0 immediately followed by depth 1 — to reach the
  // first row that actually has data underneath it), rather than forming a sub-chunk of its own.
  // A collapsed header row has no children in the flattened row list at all, so it keeps its own
  // id and stays its own single-row sub-chunk instead of wrongly merging into the next, unrelated
  // group.
  function getDeepestActiveGroupRowId(index: number): string {
    const row = options.getRowAtIndex(index)

    if (!row.getIsGrouped()) {
      return row.getParentRows().at(-1)?.id ?? row.id
    }

    return row.getIsExpanded() ? getDeepestActiveGroupRowId(index + 1) : row.id
  }

  function getTopLevelGroupRowId(row: Row<TItem>): string {
    return row.getParentRows().at(0)?.id ?? row.id
  }

  function toGroupChunkEntry(index: number, key: number | string): GroupChunkEntry<TItem> {
    const viewModel = options.getViewModelAtIndex(index)

    return {
      topLevelGroupRowId: getTopLevelGroupRowId(viewModel.row),
      index,
      key,
      viewModel,
    }
  }

  const virtualRowEntries = computed<GroupChunkEntry<TItem>[]>(
    () => options.virtualItems.value.map(
      (virtualItem) => toGroupChunkEntry(virtualItem.index, String(virtualItem.key)),
    ),
  )

  function getGroupRowHeaderDepth(entry: GroupChunkEntry<TItem>): number | null {
    return entry.viewModel.isGrouped ? entry.viewModel.row.depth : null
  }

  // Depth-0 (e.g. a department) and depth-1 (e.g. a status within it) need different
  // `position: sticky` containing-block scopes, not the same one — see
  // `dataTableStickyGroupHeaders.util.ts` for the full reasoning. Each top-level chunk (one per
  // department) is depth-0's containing block; each of its sub-chunks (one per status) is
  // depth-1's own, narrower containing block. The template renders this as two nested sticky
  // levels, matching this chunk/sub-chunk nesting exactly.
  const chunks = computed<RowChunk<GroupChunkEntry<TItem>>[]>(
    () => chunkVirtualRowEntriesByGroup(
      virtualRowEntries.value,
      (index) => toGroupChunkEntry(index, options.getRowAtIndex(index).id),
      getGroupRowHeaderDepth,
      (entry) => getDeepestActiveGroupRowId(entry.index),
    ),
  )

  // A sub-chunk's header rows (its own leading run of grouped entries — depth 0, only present in
  // a top-level chunk's first sub-chunk, optionally followed by depth 1) render inside their own
  // sticky wrapper in the template. Everything after that leading run is the sub-chunk's own data
  // rows.
  function getSubChunkHeaderEntries(subChunk: RowSubChunk<GroupChunkEntry<TItem>>): GroupChunkEntry<TItem>[] {
    const headerEntries: GroupChunkEntry<TItem>[] = []

    for (const entry of subChunk.entries) {
      if (!entry.viewModel.isGrouped) {
        break
      }

      headerEntries.push(entry)
    }

    return headerEntries
  }

  function getSubChunkDataRowEntries(subChunk: RowSubChunk<GroupChunkEntry<TItem>>): GroupChunkEntry<TItem>[] {
    return subChunk.entries.slice(getSubChunkHeaderEntries(subChunk).length)
  }

  // The chunk's own top-level group header entry (e.g. "Engineering"), if its first sub-chunk has
  // one — every chunk has exactly one, always as the first sub-chunk's leading entry (see
  // `dataTableStickyGroupHeaders.util.ts`). Returned as a 0-or-1-item array so the template can
  // `v-for` over it directly instead of null-checking.
  function getChunkGroupHeaderEntry(chunk: RowChunk<GroupChunkEntry<TItem>>): GroupChunkEntry<TItem>[] {
    const firstHeaderEntry = getSubChunkHeaderEntries(chunk.subChunks[0]!)[0]

    return firstHeaderEntry?.viewModel.row.depth === 0
      ? [
          firstHeaderEntry,
        ]
      : []
  }

  // The sub-chunk's own nested subgroup header entry (e.g. "Active"), if it's nested — a chunk
  // without nested subgroups has no subgroup header at all, its top-level group header is enough.
  // Returned as a 0-or-1-item array so the template can `v-for` over it directly instead of
  // null-checking.
  function getSubChunkSubgroupHeaderEntry(
    subChunk: RowSubChunk<GroupChunkEntry<TItem>>,
  ): GroupChunkEntry<TItem>[] {
    const subgroupHeaderEntry = getSubChunkHeaderEntries(subChunk).find((entry) => entry.viewModel.row.depth > 0)

    return subgroupHeaderEntry === undefined
      ? []
      : [
          subgroupHeaderEntry,
        ]
  }

  // `paddingBeforePxFromVirtualizer` is computed from the virtualizer's raw, un-backfilled
  // output, with no knowledge that a chunk's own header row(s) can be backfilled (see
  // `dataTableStickyGroupHeaders.util.ts`) — a backfilled header row occupies real flow height
  // that the padding spacer doesn't yet account for, leaving every row after it rendered too low
  // by that much and visually overlapping the row(s) below it. A header entry counts as
  // backfilled when its index falls before the raw virtualizer window's own first index — header
  // rows are always exactly `groupHeaderHeightPx` tall, so their combined height is computed
  // directly rather than measured.
  const paddingBeforePx = computed<number>(() => {
    const firstChunk = chunks.value[0]
    const rawFirstIndex = virtualRowEntries.value[0]?.index

    if (firstChunk === undefined || rawFirstIndex === undefined) {
      return options.paddingBeforePxFromVirtualizer.value
    }

    const backfilledEntryCount = firstChunk.subChunks.flatMap(
      (subChunk) => getSubChunkHeaderEntries(subChunk),
    ).filter((entry) => entry.index < rawFirstIndex).length

    return options.paddingBeforePxFromVirtualizer.value - backfilledEntryCount * options.groupHeaderHeightPx
  })

  return {
    chunks,
    getChunkGroupHeaderEntry,
    getSubChunkDataRowEntries,
    getSubChunkSubgroupHeaderEntry,
    paddingBeforePx,
  }
}
