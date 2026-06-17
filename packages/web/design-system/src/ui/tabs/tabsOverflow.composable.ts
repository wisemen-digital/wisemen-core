import {
  useDebounceFn,
  useElementSize,
  useResizeObserver,
} from '@vueuse/core'
import type {
  ComputedRef,
  Ref,
} from 'vue'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
} from 'vue'

import type { TabsOverflowTabData } from '@/ui/tabs/tabs.context'

type TabsOverflowInput = Omit<TabsOverflowTabData, 'order'>

interface UseTabsOverflowOptions {
  isEnabled: ComputedRef<boolean> | Ref<boolean>
  activeValue: ComputedRef<string | null> | Ref<string | null>
}

interface UseTabsOverflow {
  isTabVisible: (tabId: string) => boolean
  overflowTabs: ComputedRef<TabsOverflowTabData[]>
  registeredTabs: ComputedRef<TabsOverflowTabData[]>
  registerTab: (tab: TabsOverflowInput) => void
  setOverflowContainerRef: (ref: HTMLElement | null) => void
  setOverflowMeasurementDropdownTriggerRef: (ref: HTMLElement | null) => void
  setOverflowMeasurementListRef: (ref: HTMLElement | null) => void
  setOverflowMeasurementTabRef: (tabId: string, ref: HTMLElement | null) => void
  unregisterTab: (tabId: string) => void
  updateTab: (tab: TabsOverflowInput) => void
}

const MIN_OVERFLOW_TRIGGER_BUFFER_PX = 8

function getVisibleIndexesForWidth(
  widths: number[],
  availableWidth: number,
  gap: number,
): number[] {
  const visibleIndexes: number[] = []
  let usedWidth = 0

  for (const [
    index,
    width,
  ] of widths.entries()) {
    const nextWidth = width + (visibleIndexes.length > 0 ? gap : 0)

    if (usedWidth + nextWidth <= availableWidth) {
      usedWidth += nextWidth
      visibleIndexes.push(index)

      continue
    }

    break
  }

  return visibleIndexes
}

function getWidthForIndexes(
  widths: number[],
  indexes: number[],
  gap: number,
): number {
  return indexes.reduce((sum, index, currentIndex) => {
    return sum + widths[index]! + (currentIndex > 0 ? gap : 0)
  }, 0)
}

export function useTabsOverflow(options: UseTabsOverflowOptions): UseTabsOverflow {
  let orderCounter = 0

  const overflowContainerRef = ref<HTMLElement | null>(null)
  const measurementDropdownTriggerRef = ref<HTMLElement | null>(null)
  const measurementListRef = ref<HTMLElement | null>(null)

  const measurementTabRefs = shallowRef<Map<string, HTMLElement>>(new Map())
  const registeredTabs = shallowRef<TabsOverflowTabData[]>([])
  const overflowTabs = shallowRef<TabsOverflowTabData[]>([])
  const visibleTabIds = shallowRef<Set<string>>(new Set())
  const hasResolvedVisibility = ref<boolean>(false)

  const {
    width: overflowContainerWidth,
  } = useElementSize(overflowContainerRef)

  const {
    width: dropdownTriggerWidth,
  } = useElementSize(measurementDropdownTriggerRef)

  function getOverflowTriggerBuffer(): number {
    const triggerEl = measurementDropdownTriggerRef.value

    if (triggerEl === null) {
      return MIN_OVERFLOW_TRIGGER_BUFFER_PX
    }

    const style = getComputedStyle(triggerEl)
    const paddingInlineStart = Number.parseFloat(style.paddingInlineStart)
    const paddingInlineEnd = Number.parseFloat(style.paddingInlineEnd)
    const borderInlineStartWidth = Number.parseFloat(style.borderInlineStartWidth)
    const borderInlineEndWidth = Number.parseFloat(style.borderInlineEndWidth)

    const horizontalPadding = [
      paddingInlineStart,
      paddingInlineEnd,
    ].reduce((sum, value) => {
      return sum + (Number.isFinite(value) ? value : 0)
    }, 0)

    const horizontalBorders = [
      borderInlineStartWidth,
      borderInlineEndWidth,
    ].reduce((sum, value) => {
      return sum + (Number.isFinite(value) ? value : 0)
    }, 0)

    return Math.max(
      MIN_OVERFLOW_TRIGGER_BUFFER_PX,
      Math.ceil(horizontalPadding + horizontalBorders),
    )
  }

  function getOrderedTabs(): TabsOverflowTabData[] {
    return [
      ...registeredTabs.value,
    ].toSorted((a, b) => a.order - b.order)
  }

  function applyAllVisibleState(): void {
    visibleTabIds.value = new Set(registeredTabs.value.map((tab) => tab.id))
    overflowTabs.value = []
    hasResolvedVisibility.value = false
  }

  function setOverflowContainerRef(el: HTMLElement | null): void {
    if (overflowContainerRef.value === el) {
      return
    }

    overflowContainerRef.value = el
    scheduleRecalculate()
  }

  function setOverflowMeasurementListRef(el: HTMLElement | null): void {
    if (measurementListRef.value === el) {
      return
    }

    measurementListRef.value = el
    scheduleRecalculate()
  }

  function setOverflowMeasurementDropdownTriggerRef(el: HTMLElement | null): void {
    if (measurementDropdownTriggerRef.value === el) {
      return
    }

    measurementDropdownTriggerRef.value = el
    scheduleRecalculate()
  }

  function setOverflowMeasurementTabRef(tabId: string, el: HTMLElement | null): void {
    const currentRef = measurementTabRefs.value.get(tabId) ?? null

    if (currentRef === el) {
      return
    }

    const nextRefs = new Map(measurementTabRefs.value)

    if (el === null) {
      nextRefs.delete(tabId)
    }
    else {
      nextRefs.set(tabId, el)
    }

    measurementTabRefs.value = nextRefs
    scheduleRecalculate()
  }

  function registerTab(tab: TabsOverflowInput): void {
    const existingTab = registeredTabs.value.find((registeredTab) => registeredTab.id === tab.id)

    if (existingTab != null) {
      updateTab(tab)

      return
    }

    registeredTabs.value = [
      ...registeredTabs.value,
      {
        ...tab,
        order: orderCounter++,
      },
    ]

    applyAllVisibleState()
    scheduleRecalculate()
  }

  function updateTab(tab: TabsOverflowInput): void {
    const existingTab = registeredTabs.value.find((registeredTab) => registeredTab.id === tab.id)

    if (existingTab == null) {
      registerTab(tab)

      return
    }

    registeredTabs.value = registeredTabs.value.map((registeredTab) => {
      if (registeredTab.id !== tab.id) {
        return registeredTab
      }

      return {
        ...registeredTab,
        ...tab,
      }
    })

    applyAllVisibleState()
    scheduleRecalculate()
  }

  function unregisterTab(tabId: string): void {
    registeredTabs.value = registeredTabs.value.filter((tab) => tab.id !== tabId)

    const nextRefs = new Map(measurementTabRefs.value)

    nextRefs.delete(tabId)
    measurementTabRefs.value = nextRefs

    applyAllVisibleState()
    scheduleRecalculate()
  }

  function getHorizontalGap(): number {
    const measurementListEl = measurementListRef.value

    if (measurementListEl === null) {
      return 0
    }

    const gap = Number.parseFloat(getComputedStyle(measurementListEl).columnGap)

    return Number.isFinite(gap) ? gap : 0
  }

  function getTabWidths(tabs: TabsOverflowTabData[]): number[] | null {
    const widths = tabs.map((tab) => measurementTabRefs.value.get(tab.id)?.offsetWidth ?? 0)

    if (widths.some((width) => width <= 0)) {
      return null
    }

    return widths
  }

  function recalculateVisibility(): void {
    const orderedTabs = getOrderedTabs()

    if (!options.isEnabled.value || orderedTabs.length === 0) {
      visibleTabIds.value = new Set(orderedTabs.map((tab) => tab.id))
      overflowTabs.value = []
      hasResolvedVisibility.value = true

      return
    }

    if (overflowContainerWidth.value <= 0 || measurementListRef.value === null) {
      applyAllVisibleState()

      return
    }

    const widths = getTabWidths(orderedTabs)

    if (widths === null) {
      applyAllVisibleState()

      return
    }

    const gap = getHorizontalGap()
    const initialVisibleIndexes = getVisibleIndexesForWidth(widths, overflowContainerWidth.value, gap)

    if (initialVisibleIndexes.length === orderedTabs.length) {
      visibleTabIds.value = new Set(orderedTabs.map((tab) => tab.id))
      overflowTabs.value = []
      hasResolvedVisibility.value = true

      return
    }

    const reservedDropdownWidth = dropdownTriggerWidth.value + gap + getOverflowTriggerBuffer()
    const availableWidth = Math.max(0, overflowContainerWidth.value - reservedDropdownWidth)
    const visibleIndexes = getVisibleIndexesForWidth(widths, availableWidth, gap)

    const activeTabIndex = orderedTabs.findIndex((tab) => tab.value === options.activeValue.value)

    if (activeTabIndex !== -1 && !visibleIndexes.includes(activeTabIndex)) {
      while (
        visibleIndexes.length > 0
        && getWidthForIndexes(
          widths,
          [
            ...visibleIndexes,
            activeTabIndex,
          ],
          gap,
        ) > availableWidth
      ) {
        visibleIndexes.pop()
      }

      visibleIndexes.push(activeTabIndex)
      visibleIndexes.sort((a, b) => a - b)
    }

    const nextVisibleTabIds = new Set(
      visibleIndexes.map((index) => orderedTabs[index]!.id),
    )

    visibleTabIds.value = nextVisibleTabIds
    overflowTabs.value = orderedTabs.filter((tab) => !nextVisibleTabIds.has(tab.id))
    hasResolvedVisibility.value = true
  }

  const debouncedRecalculateVisibility = useDebounceFn(recalculateVisibility, 16)

  function scheduleRecalculate(): void {
    void nextTick(() => {
      debouncedRecalculateVisibility()
    })
  }

  useResizeObserver(overflowContainerRef, scheduleRecalculate)
  useResizeObserver(measurementListRef, scheduleRecalculate)
  useResizeObserver(measurementDropdownTriggerRef, scheduleRecalculate)

  watch(registeredTabs, scheduleRecalculate)
  watch(options.activeValue, scheduleRecalculate)
  watch(options.isEnabled, () => {
    applyAllVisibleState()
    scheduleRecalculate()
  })
  watch(overflowContainerWidth, scheduleRecalculate)
  watch(dropdownTriggerWidth, scheduleRecalculate)

  function isTabVisible(tabId: string): boolean {
    if (!options.isEnabled.value || !hasResolvedVisibility.value) {
      return true
    }

    return visibleTabIds.value.has(tabId)
  }

  function onFontsReady(): void {
    scheduleRecalculate()
  }

  onMounted(() => {
    applyAllVisibleState()
    scheduleRecalculate()

    if (!('fonts' in document)) {
      return
    }

    void document.fonts.ready.then(onFontsReady)
    document.fonts.addEventListener('loadingdone', onFontsReady)
  })

  onBeforeUnmount(() => {
    if (!('fonts' in document)) {
      return
    }

    document.fonts.removeEventListener('loadingdone', onFontsReady)
  })

  return {
    isTabVisible,
    overflowTabs: computed(() => overflowTabs.value),
    registeredTabs: computed(() => getOrderedTabs()),
    registerTab,
    setOverflowContainerRef,
    setOverflowMeasurementDropdownTriggerRef,
    setOverflowMeasurementListRef,
    setOverflowMeasurementTabRef,
    unregisterTab,
    updateTab,
  }
}
