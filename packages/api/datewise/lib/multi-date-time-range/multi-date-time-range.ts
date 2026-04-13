import { DateTimeRange } from '../date-time-range/date-time-range.js'

export class MultiDateTimeRange {
  ranges: DateTimeRange[] = []

  constructor (ranges: DateTimeRange[]) {
    for (const range of ranges) {
      this.add(range)
    }
  }

  get length (): number {
    return this.ranges.length
  }

  /**
   * Add a new range to the multi range. The new range will be merged with existing ranges
   * if any.
   */
  add (range: DateTimeRange): void {
    const newRanges: DateTimeRange[] = []

    for (let j = 0; j < this.ranges.length; j++) {
      const mergeCandidate = this.ranges[j]

      if (mergeCandidate.overlaps(range) || mergeCandidate.isAdjacentTo(range)) {
        range = range.merge(mergeCandidate)
      } else {
        newRanges.push(mergeCandidate)
      }
    }

    newRanges.push(range)
    this.ranges = newRanges
  }

  /**
   * Results in a multi range containing the ranges covered by this range but not covered
   * by the given range.
   */
  diff (multiRange: MultiDateTimeRange): MultiDateTimeRange {
    let results: DateTimeRange[] = [...this.ranges]

    for (const range of multiRange.ranges) {
      const newResults: DateTimeRange[] = []

      for (const result of results) {
        newResults.push(...result.diff(range).ranges)
      }

      results = newResults
    }

    return new MultiDateTimeRange(results)
  }

  /**
   * Validate whether a range is completely contained in any range that's part of this multi range
   */
  containsRange (range: DateTimeRange): boolean {
    return this.ranges.some(r => r.containsRange(range))
  }
}
