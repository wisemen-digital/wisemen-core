<script setup lang="ts">
import {
  Motion,
  useReducedMotion,
} from 'motion-v'
import type { Ref } from 'vue'
import {
  computed,
  ref,
  shallowRef,
} from 'vue'

import { useProvideMainContentDetailPaneContext } from '@/ui/layout/mainContentDetailPane.context'
import { useMainSidebar } from '@/ui/sidebar/mainSidebar.composable'
import TopBar from '@/ui/top-bar/TopBar.vue'

const {
  isFloatingSidebar,
  isSidebarOpen,
  collapsedVariant,
  sidebarWidth,
} = useMainSidebar()

const hasDetailPane = ref<boolean>(false)

const detailPaneState = shallowRef<{
  isOpen: Ref<boolean>
  toggle: () => void
} | null>(null)

const detailPaneIsOpen = computed<boolean>(() => detailPaneState.value?.isOpen.value ?? false)

function toggleDetailPane(): void {
  detailPaneState.value?.toggle()
}

function registerDetailPane(isOpen: Ref<boolean>, toggle: () => void): void {
  detailPaneState.value = {
    isOpen,
    toggle,
  }
  hasDetailPane.value = true
}

function unregisterDetailPane(): void {
  detailPaneState.value = null
  hasDetailPane.value = false
}

useProvideMainContentDetailPaneContext({
  hasDetailPane,
  isOpen: detailPaneIsOpen,
  registerDetailPane,
  toggle: toggleDetailPane,
  unregisterDetailPane,
})

const isReduceMotionEnabledOnDevice = useReducedMotion()

const contentPaddingLeft = computed<string>(() => {
  if (isFloatingSidebar.value) {
    return '0.5rem'
  }

  if (collapsedVariant.value === 'minified') {
    return sidebarWidth.value
  }

  if (isSidebarOpen.value) {
    return sidebarWidth.value
  }

  return '0.5rem'
})
</script>

<template>
  <Motion
    :initial="{
      paddingLeft: contentPaddingLeft,
    }"
    :animate="{
      paddingLeft: contentPaddingLeft,
    }"
    :transition="{
      duration: isReduceMotionEnabledOnDevice ? 0 : 0.3,
      type: 'spring',
      bounce: 0,
    }"
    class="flex size-full flex-col overflow-hidden bg-secondary p-md"
  >
    <TopBar>
      <template #actions>
        <slot name="top-bar-actions" />
      </template>
    </TopBar>
    <slot />
  </Motion>
</template>
