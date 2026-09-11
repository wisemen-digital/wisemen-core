import type {
  ComputedRef,
  Ref,
} from 'vue'
import { computed } from 'vue'

import type { CalendarSegment } from '@/ui/calendar-week-view/types/calendarSegment.type'

export interface CalendarSegmentLayout<TMeta = Record<string, unknown>> {
  columnCount: number
  columnIndex: number
  segment: CalendarSegment<TMeta>
}

function segmentsOverlap(
  a: Pick<CalendarSegment, 'endMin' | 'startMin'>,
  b: Pick<CalendarSegment, 'endMin' | 'startMin'>,
): boolean {
  return a.startMin < b.endMin && b.startMin < a.endMin
}

/**
 * ADR 0005: a fresh, deliberately simple greedy layout — not the
 * taxi-hendriks algorithm. Segments are grouped into overlap clusters
 * (connected via any pairwise time overlap), then each cluster is split
 * into equal-width columns via first-fit-by-start-time column assignment.
 *
 * Operates on segments rather than events so a cross-midnight event packs
 * against its neighbours on each day independently.
 */
export function layoutOverlappingSegments<TMeta = Record<string, unknown>>(
  segments: CalendarSegment<TMeta>[],
): CalendarSegmentLayout<TMeta>[] {
  const sortedSegments = [
    ...segments,
  ].sort((a, b) => a.startMin - b.startMin)

  const clusters: CalendarSegment<TMeta>[][] = []

  for (const segment of sortedSegments) {
    const overlappingCluster = clusters.find((cluster) => cluster.some(
      (clusterSegment) => segmentsOverlap(clusterSegment, segment),
    ))

    if (overlappingCluster !== undefined) {
      overlappingCluster.push(segment)
    }
    else {
      clusters.push([
        segment,
      ])
    }
  }

  const layouts: CalendarSegmentLayout<TMeta>[] = []

  for (const cluster of clusters) {
    const columnEndMinutes: number[] = []
    const segmentColumnIndices = new Map<CalendarSegment<TMeta>, number>()

    for (const segment of cluster) {
      const freeColumnIndex = columnEndMinutes.findIndex(
        (columnEndMin) => columnEndMin <= segment.startMin,
      )

      if (freeColumnIndex === -1) {
        columnEndMinutes.push(segment.endMin)
        segmentColumnIndices.set(segment, columnEndMinutes.length - 1)
      }
      else {
        columnEndMinutes[freeColumnIndex] = segment.endMin
        segmentColumnIndices.set(segment, freeColumnIndex)
      }
    }

    const columnCount = columnEndMinutes.length

    for (const segment of cluster) {
      layouts.push({
        columnCount,
        columnIndex: segmentColumnIndices.get(segment)!,
        segment,
      })
    }
  }

  return layouts
}

export function useCalendarEventOverlap<TMeta = Record<string, unknown>>(
  daySegments: Ref<CalendarSegment<TMeta>[]>,
): {
  layouts: ComputedRef<CalendarSegmentLayout<TMeta>[]>
} {
  const layouts = computed<CalendarSegmentLayout<TMeta>[]>(
    () => layoutOverlappingSegments(daySegments.value),
  )

  return {
    layouts,
  }
}
