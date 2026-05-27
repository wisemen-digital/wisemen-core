import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
} from 'vue'

export function useTableColumnResize() {
  const fixedWidths = ref<number[] | null>(null)
  const contentFitColumnIndex = ref<number | null>(null)
  const resizingColumnIndex = ref<number | null>(null)
  const startX = ref<number>(0)
  const originalWidth = ref<number>(0)

  const isResizingColumn = computed<boolean>(() => resizingColumnIndex.value !== null)

  function startResize(columnIndex: number, mouseX: number, nonLastWidths: number[]): void {
    fixedWidths.value = nonLastWidths
    resizingColumnIndex.value = columnIndex
    startX.value = mouseX
    originalWidth.value = nonLastWidths[columnIndex]!
  }

  async function fitColumnToContent(
    columnIndex: number,
    cellEl: HTMLElement,
    initialWidths?: number[],
  ): Promise<void> {
    if (fixedWidths.value === null) {
      if (initialWidths === undefined) {
        return
      }

      fixedWidths.value = initialWidths
    }

    contentFitColumnIndex.value = columnIndex
    await nextTick()

    const measuredWidth = cellEl.getBoundingClientRect().width
    const updatedWidths = [
      ...fixedWidths.value,
    ]

    updatedWidths[columnIndex] = measuredWidth
    fixedWidths.value = updatedWidths
    contentFitColumnIndex.value = null
  }

  function fitAllColumnsToContent(resizableHeaderCells: HTMLElement[]): void {
    if (resizableHeaderCells.length === 0) {
      return
    }

    const headerSubgrid = resizableHeaderCells[0]!.parentElement
    const gridEl = headerSubgrid?.parentElement

    if (gridEl == null || headerSubgrid == null) {
      return
    }

    const totalHeaderCells = headerSubgrid.children.length

    gridEl.style.gridTemplateColumns = Array.from({
      length: totalHeaderCells,
    }).fill('max-content').join(' ')

    const measuredWidths = resizableHeaderCells.map((el) => el.getBoundingClientRect().width)

    const hasActionsColumn = totalHeaderCells > resizableHeaderCells.length + 1
    const fixedPart = measuredWidths.map((w) => `${w}px`).join(' ')

    gridEl.style.gridTemplateColumns = hasActionsColumn
      ? `${fixedPart} minmax(min-content, auto) min-content`
      : `${fixedPart} minmax(min-content, auto)`

    fixedWidths.value = measuredWidths
  }

  function resetWidths(): void {
    fixedWidths.value = null
    resizingColumnIndex.value = null
    contentFitColumnIndex.value = null
  }

  function onMouseMove(e: MouseEvent): void {
    if (resizingColumnIndex.value === null || fixedWidths.value === null) {
      return
    }
    const delta = e.clientX - startX.value
    const updatedWidth = Math.max(50, originalWidth.value + delta)
    const updatedWidths = [
      ...fixedWidths.value,
    ]

    updatedWidths[resizingColumnIndex.value] = updatedWidth
    fixedWidths.value = updatedWidths
  }

  function stopResize(): void {
    if (resizingColumnIndex.value !== null) {
      resizingColumnIndex.value = null
    }
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', stopResize)

  onBeforeUnmount(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', stopResize)
  })

  return {
    isResizingColumn,
    contentFitColumnIndex,
    fitAllColumnsToContent,
    fitColumnToContent,
    fixedWidths,
    resetWidths,
    startResize,
  }
}
