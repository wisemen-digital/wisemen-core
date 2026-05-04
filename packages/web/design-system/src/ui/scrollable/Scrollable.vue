<script setup lang="ts">
import {
  useInfiniteScroll,
  useMutationObserver,
} from '@vueuse/core'
import { Primitive } from 'reka-ui'
import type { Component } from 'vue'
import {
  computed,
  ref,
  useTemplateRef,
  watch,
} from 'vue'

const props = withDefaults(defineProps<{
  as?: string | Component
  distance?: number
  onNext?: () => Promise<void> | void
}>(), {
  as: 'div',
  distance: 250,
})

const scrollableRef = useTemplateRef('scrollable')

const hasScrolledFromTop = ref<boolean>(false)
const hasScrolledFromBottom = ref<boolean>(false)

useInfiniteScroll(
  computed<HTMLElement | null>(() => scrollableRef.value?.$el ?? null),
  async () => {
    await props.onNext?.()
  },
  {
    distance: props.distance,
  },
)

useMutationObserver(
  computed<HTMLElement | null>(() => scrollableRef.value?.$el ?? null),
  updateScrollStates,
  {
    childList: true,
    subtree: true,
  },
)

function updateScrollStates(): void {
  const el = scrollableRef.value?.$el ?? null

  if (el === null) {
    hasScrolledFromTop.value = false
    hasScrolledFromBottom.value = false

    return
  }

  hasScrolledFromTop.value = el.scrollTop > 0
  hasScrolledFromBottom.value = el.scrollHeight - el.clientHeight - el.scrollTop > 0
}

watch(
  () => scrollableRef.value?.$el ?? null,
  (el) => {
    if (el !== null) {
      requestAnimationFrame(updateScrollStates)
    }
  },
  {
    immediate: true,
  },
)

function onScroll(): void {
  updateScrollStates()
}
</script>

<template>
  <div class="relative flex size-full flex-col overflow-hidden">
    <div
      v-if="hasScrolledFromTop"
      class="
        pointer-events-none absolute top-0 z-1 h-8 w-full bg-linear-to-b
        from-primary to-transparent
      "
    />

    <div
      v-if="hasScrolledFromBottom"
      class="
        pointer-events-none absolute bottom-0 z-1 h-8 w-full bg-linear-to-t
        from-primary to-transparent
      "
    />

    <Primitive
      ref="scrollable"
      :as="props.as"
      class="overflow-auto"
      @scroll="onScroll"
    >
      <slot />
    </Primitive>
  </div>
</template>
