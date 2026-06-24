<script setup lang="ts">
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@wisemen/vue-core-icons'
import { TabsList as RekaTabsList } from 'reka-ui'
import {
  onMounted,
  ref,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { useInjectTabsContext } from '@/ui/tabs/tabs.context'
import TabsIndicator from '@/ui/tabs/TabsIndicator.vue'

const i18n = useI18n()
const scrollContainerRef = ref<HTMLElement | null>(null)

const {
  hasHorizontalOverflow,
  hasReachedHorizontalEnd,
  isScrolledHorizontally,
  orientation,
  scrollToLeft,
  scrollToRight,
  setScrollContainerRef,
  variants,
} = useInjectTabsContext()

onMounted(() => {
  if (scrollContainerRef.value === null) {
    throw new Error('scrollContainerRef is null')
  }

  setScrollContainerRef(scrollContainerRef.value)
})
</script>

<template>
  <div :class="variants.base()">
    <div
      v-if="isScrolledHorizontally && hasHorizontalOverflow && orientation === 'horizontal'"
      :class="variants.scrollEdge()"
      class="left-0 justify-start bg-linear-to-r from-50%"
    >
      <button
        :aria-label="i18n.t('component.tabs.scroll_left')"
        :class="variants.scrollButton()"
        tabindex="-1"
        type="button"
        @click="scrollToLeft"
      >
        <ChevronLeftIcon class="size-3" />
      </button>
    </div>

    <div
      ref="scrollContainerRef"
      :class="variants.scrollContainer()"
      :data-orientation="orientation"
    >
      <RekaTabsList :class="variants.list()">
        <slot />

        <TabsIndicator />
      </RekaTabsList>
    </div>

    <div
      v-if="!hasReachedHorizontalEnd && hasHorizontalOverflow && orientation === 'horizontal'"
      :class="variants.scrollEdge()"
      class="right-0 justify-end bg-linear-to-l from-50%"
    >
      <button
        :aria-label="i18n.t('component.tabs.scroll_right')"
        :class="variants.scrollButton()"
        tabindex="-1"
        type="button"
        @click="scrollToRight"
      >
        <ChevronRightIcon class="size-3" />
      </button>
    </div>
  </div>
</template>
