import {
  useDebounceFn,
  useResizeObserver,
} from '@vueuse/core'
import type {
  Action,
  ActionGroup,
} from '@wisemen/vue-core-actions'
import {
  createAction,
  useTemporaryActions,
} from '@wisemen/vue-core-actions'
import { SpacingWidth01Icon } from '@wisemen/vue-core-icons'
import type { ComputedRef } from 'vue'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'

import type { TableColumnSize } from '@/ui/table/types/table.type'
import {
  CHECKBOX_COLUMN_WIDTH,
  TableUtil,
} from '@/ui/table/utils/table.util'

function sizeToPixels(size: TableColumnSize['max'] | TableColumnSize['min'], role: 'max' | 'min'): number {
  if (size === 'min-content' || size === 'auto') {
    return role === 'min' ? 0 : Infinity
  }

  if (size.endsWith('rem')) {
    return Number.parseFloat(size) * Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
  }

  return role === 'min' ? 0 : Infinity
}

function buildManualTemplate(widths: number[], fittingIndex: number | null, hasCheckboxColumn: boolean): string {
  const columns = widths
    .map((w, i) => (i === fittingIndex ? 'max-content' : `${w}px`))
    .join(' ')

  const base = `${columns} minmax(min-content, auto) min-content`

  return hasCheckboxColumn ? `${CHECKBOX_COLUMN_WIDTH} ${base}` : base
}

export function useTableColumnWidths(
  columnSizes: ComputedRef<TableColumnSize[]>,
  gridEl: ComputedRef<HTMLElement | null>,
  isInitialized: ComputedRef<boolean>,
  actionGroup: ComputedRef<ActionGroup | null>,
  isColumnResizeDisabled: ComputedRef<boolean>,
  isSelectable: ComputedRef<boolean>,
  hasActiveSearch: ComputedRef<boolean>,
  activeFilterCount: ComputedRef<number>,
) {
  const frozenTemplate = ref<string | null>(null)
  const manualWidths = ref<number[] | null>(null)
  const fittingColumnIndex = ref<number | null>(null)
  const resizingColumnIndex = ref<number | null>(null)
  const resizeStartX = ref(0)
  const resizeStartWidth = ref(0)

  const isResizing = computed<boolean>(() => resizingColumnIndex.value !== null)

  const gridTemplateColumns = computed<string>(() => {
    if (manualWidths.value !== null) {
      return buildManualTemplate(manualWidths.value, fittingColumnIndex.value, isSelectable.value)
    }

    return frozenTemplate.value ?? buildFluidTemplate()
  })

  function buildFluidTemplate(): string {
    return TableUtil.columnSizesToGridTemplateColumns(columnSizes.value, true, isSelectable.value)
  }

  watch([
    gridEl,
    isInitialized,
    columnSizes,
  ], ([
    el,
    initialized,
  ]) => {
    if (el === null || !initialized) {
      return
    }

    // Immediately apply max-content so the first render uses header widths instead
    // of the narrow fluid template, preventing the "truncated → expands" flash.
    const headerCells = getResizableHeaderCells()

    if (headerCells.length > 0) {
      const totalCells = headerCells.length + 2

      frozenTemplate.value = Array.from({
        length: totalCells,
      }).fill('max-content').join(' ')
    }

    // Defer the final measurement to the next macrotask so the virtual scroller's
    // ResizeObserver has time to measure the container and render visible rows.
    // The frozenTemplate above ensures no truncation during this brief wait.
    setTimeout(() => {
      if (isInitialized.value && gridEl.value !== null) {
        fitAllColumnsToContent(getResizableHeaderCells())
      }
    }, 0)
  }, {
    flush: 'post',
  })

  watch([
    hasActiveSearch,
    activeFilterCount,
  ], () => {
    manualWidths.value = null
    frozenTemplate.value = null
  })

  let lastContainerWidth = 0

  const debouncedCaptureTemplate = useDebounceFn((el: HTMLElement) => {
    captureComputedTemplate(el)
  }, 25)

  useResizeObserver(gridEl, (entries) => {
    const width = entries[0]?.borderBoxSize[0]?.inlineSize

    if (width === undefined || width === lastContainerWidth) {
      return
    }

    lastContainerWidth = width

    if (manualWidths.value === null && gridEl.value !== null) {
      debouncedCaptureTemplate(gridEl.value)
    }
  }, {
    box: 'border-box',
  })

  async function captureComputedTemplate(el: HTMLElement): Promise<void> {
    frozenTemplate.value = null
    await nextTick()
    frozenTemplate.value = getComputedStyle(el).gridTemplateColumns
  }

  watch(() => columnSizes.value.length, () => {
    manualWidths.value = null
    fittingColumnIndex.value = null
    resizingColumnIndex.value = null
  })

  function clampWidth(columnIndex: number, width: number): number {
    const size = columnSizes.value[columnIndex]

    if (size === undefined) {
      return width
    }

    const min = sizeToPixels(size.min, 'min')
    const max = sizeToPixels(size.max, 'max')

    return Math.min(max, Math.max(min, width))
  }

  function snapshotWidths(cellEl: HTMLElement): number[] {
    const siblings = Array.from(cellEl.parentElement?.children ?? []) as HTMLElement[]
    const start = isSelectable.value ? 1 : 0

    return siblings
      .slice(start, start + columnSizes.value.length - 1)
      .map((el) => el.getBoundingClientRect().width)
  }

  function startColumnResize(columnIndex: number, mouseX: number, cellEl: HTMLElement): void {
    const widths = snapshotWidths(cellEl)

    manualWidths.value = widths
    resizingColumnIndex.value = columnIndex
    resizeStartX.value = mouseX
    resizeStartWidth.value = widths[columnIndex]!
  }

  function onMouseMove(e: MouseEvent): void {
    if (resizingColumnIndex.value === null || manualWidths.value === null) {
      return
    }

    const delta = e.clientX - resizeStartX.value
    const updatedWidth = clampWidth(resizingColumnIndex.value, resizeStartWidth.value + delta)
    const updated = [
      ...manualWidths.value,
    ]

    updated[resizingColumnIndex.value] = updatedWidth
    manualWidths.value = updated
  }

  function stopResize(): void {
    resizingColumnIndex.value = null
  }

  async function fitColumnToContent(columnIndex: number, cellEl: HTMLElement): Promise<void> {
    if (manualWidths.value === null) {
      manualWidths.value = snapshotWidths(cellEl)
    }

    fittingColumnIndex.value = columnIndex
    await nextTick()

    const width = cellEl.getBoundingClientRect().width
    const updated = [
      ...manualWidths.value,
    ]

    updated[columnIndex] = clampWidth(columnIndex, width)
    manualWidths.value = updated
    fittingColumnIndex.value = null
  }

  function fitAllColumnsToContent(headerCells: HTMLElement[]): void {
    const el = gridEl.value

    if (headerCells.length === 0 || el === null) {
      return
    }

    const totalCells = headerCells.length + 2

    el.style.gridTemplateColumns = Array.from({
      length: totalCells,
    }).fill('max-content').join(' ')

    const measuredWidths = headerCells.map((cell, i) => clampWidth(i, cell.getBoundingClientRect().width))

    el.style.gridTemplateColumns = buildManualTemplate(measuredWidths, null, isSelectable.value)
    manualWidths.value = measuredWidths
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', stopResize)

  onBeforeUnmount(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', stopResize)
  })

  const i18n = useI18n()

  function getResizableHeaderCells(): HTMLElement[] {
    const headerRow = gridEl.value?.children[0] as HTMLElement | undefined

    if (headerRow === undefined) {
      return []
    }

    const start = isSelectable.value ? 1 : 0

    return Array.from(headerRow.children).slice(start, start + columnSizes.value.length - 1) as HTMLElement[]
  }

  const autoFitColumnsAction: Action = createAction({
    id: 'table-auto-fit-columns',
    isApplicable: () => !isColumnResizeDisabled.value,
    name: () => i18n.t('component.table.auto_fit_columns_action.name'),
    execute: () => fitAllColumnsToContent(getResizableHeaderCells()),
    group: actionGroup.value ?? undefined,
    icon: () => SpacingWidth01Icon,
    keyboardShortcut: {
      key: 'A',
      shift: true,
    },
  })

  useTemporaryActions(autoFitColumnsAction)

  return {
    isResizing,
    autoFitColumnsAction,
    fitColumnToContent,
    gridTemplateColumns,
    startColumnResize,
  }
}
