import {
  useBreakpoints,
  useLocalStorage,
} from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'
import type { Ref } from 'vue'
import {
  computed,
  ref,
} from 'vue'

import type {
  DetailPaneStorage,
  DetailPaneVariant,
} from '@/ui/page/detailPane.type'

const DEFAULT_WIDTH = '20rem'
const DEFAULT_MIN_WIDTH = '16rem'
const DEFAULT_MAX_WIDTH = '25rem'

interface UseDetailPaneOptions {
  isOpen: Ref<boolean>
  isResizable: boolean
  storage: DetailPaneStorage | null
  variant: DetailPaneVariant
}

function remToPx(rem: string): number {
  const remValue = Number.parseFloat(rem)
  const rootFontSize = typeof document !== 'undefined'
    ? Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    : 16

  return remValue * rootFontSize
}

export function useDetailPane(options: UseDetailPaneOptions) {
  const isResizable = options.isResizable ?? true
  const storage = options.storage
  const variant = options.variant

  const width = DEFAULT_WIDTH
  const minWidth = DEFAULT_MIN_WIDTH
  const maxWidth = DEFAULT_MAX_WIDTH

  const screen = useBreakpoints({
    xl: 960,
  })

  const isFloatingDetailPane = computed<boolean>(() => {
    if (variant === 'full-height-overlay' || variant === 'bordered-overlay') {
      return true
    }

    return screen.smaller('xl').value
  })

  const isFloatingOpen = ref<boolean>(false)
  const isResizing = ref<boolean>(false)

  const sidebarWidth = storage !== null && storage !== undefined
    ? useLocalStorage<string>(`${storage.key}-width`, width)
    : ref<string>(width)

  function getStorageRef(): Ref<boolean> {
    if (storage === null || storage === undefined) {
      return options.isOpen
    }

    if (storage.strategy === 'localStorage') {
      return useLocalStorage<boolean>(storage.key, options.isOpen.value)
    }

    if (storage.strategy === 'routeQuery') {
      const queryValue = useRouteQuery<string>(storage.key, String(options.isOpen.value))

      return computed<boolean>({
        get: () => queryValue.value === 'true',
        set: (value: boolean) => {
          queryValue.value = String(value)
        },
      })
    }

    return options.isOpen
  }

  const storageRef = getStorageRef()

  const isOpen = computed<boolean>({
    get: () => {
      if (isFloatingDetailPane.value) {
        return isFloatingOpen.value
      }

      return storageRef.value
    },
    set: (value: boolean) => {
      if (isFloatingDetailPane.value) {
        isFloatingOpen.value = value
      }
      else {
        storageRef.value = value
      }
    },
  })

  function toggleIsOpen(): void {
    isOpen.value = !isOpen.value
  }

  function onResizeStart(event: PointerEvent): void {
    event.preventDefault()
    isResizing.value = true

    const parentEl = (event.target as HTMLElement).closest('.relative')

    if (parentEl === null) {
      return
    }

    const containerRect = parentEl.getBoundingClientRect()
    const minPx = remToPx(minWidth)
    const maxPx = remToPx(maxWidth)

    function onPointerMove(moveEvent: PointerEvent): void {
      const resizedWidth = containerRect.right - moveEvent.clientX
      const clampedWidth = Math.min(Math.max(resizedWidth, minPx), maxPx)

      sidebarWidth.value = `${clampedWidth}px`
    }

    function onPointerUp(): void {
      isResizing.value = false
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
  }

  const RESIZE_STEP_PX = 16

  function onResizeKeyDown(event: KeyboardEvent): void {
    const minPx = remToPx(minWidth)
    const maxPx = remToPx(maxWidth)

    let delta = 0

    if (event.key === 'ArrowLeft') {
      delta = RESIZE_STEP_PX
    }
    else if (event.key === 'ArrowRight') {
      delta = -RESIZE_STEP_PX
    }

    if (delta === 0) {
      return
    }

    event.preventDefault()

    const currentPx = Number.parseFloat(sidebarWidth.value) || remToPx(width)
    const constrainedWidth = Math.min(Math.max(currentPx + delta, minPx), maxPx)

    sidebarWidth.value = `${constrainedWidth}px`
  }

  return {
    isFloatingDetailPane,
    isOpen,
    isResizable,
    isResizing,
    sidebarWidth,
    toggleIsOpen,
    variant,
    onResizeKeyDown,
    onResizeStart,
  }
}
