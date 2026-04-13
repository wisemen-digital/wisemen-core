<script setup lang="ts">
import {
  TabsIndicator as RekaTabsIndicator,
  TabsList as RekaTabsList,
} from 'reka-ui'
import {
  onMounted,
  ref,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { UIAdaptiveContent } from '@/ui/adaptive-content/index'
import { useInjectTabsContext } from '@/ui/tabs/tabs.context'
import TabsAdaptiveContentDropdown from '@/ui/tabs/TabsAdaptiveContentDropdown.vue'
import TabsIndicator from '@/ui/tabs/TabsIndicator.vue'

const i18n = useI18n()
const scrollContainerRef = ref<HTMLElement | null>(null)

const {
  hasHorizontalOverflow,
  hasReachedHorizontalEnd,
  isScrolledHorizontally,
  isTouchDevice,
  orientation,
  scrollToLeft,
  scrollToRight,
  setScrollContainerRef,
  tabs,
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
      v-if="isTouchDevice && isScrolledHorizontally && hasHorizontalOverflow && orientation === 'horizontal'"
      class="
        absolute top-0 left-0 z-20 flex h-full items-center bg-linear-to-r
        from-primary to-transparent
      "
    >
      <button
        :aria-label="i18n.t('component.tabs.scroll_left')"
        class="
          flex size-7 items-center justify-center rounded-md bg-primary
          text-secondary
          hover:bg-primary-hover
        "
        tabindex="-1"
        type="button"
        @click="scrollToLeft"
      >
        <svg
          aria-hidden="true"
          class="size-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
    </div>

    <div
      ref="scrollContainerRef"
      :class="variants.scrollContainer()"
      :data-orientation="orientation"
    >
      <UIAdaptiveContent v-if="!isTouchDevice">
        <template #default="{ hiddenBlockCount }">
          <div class="h-full">
            <RekaTabsList
              :class="variants.list()"
            >
              <slot />

              <TabsIndicator
                :hidden-tabs-count="hiddenBlockCount"
                :tabs="tabs"
              />
              <TabsAdaptiveContentDropdown
                v-if="hiddenBlockCount > 0"
                :hidden-tabs-count="hiddenBlockCount"
                :tabs="tabs"
              />
            </RekaTabsList>
          </div>
        </template>
      </UIAdaptiveContent>

      <RekaTabsList
        v-else
        :class="variants.list()"
      >
        <slot />

        <RekaTabsIndicator :class="variants.indicator()">
          <div :class="variants.indicatorInner()" />
        </RekaTabsIndicator>
      </RekaTabsList>
    </div>

    <div
      v-if="isTouchDevice && !hasReachedHorizontalEnd && hasHorizontalOverflow && orientation === 'horizontal'"
      class="
        absolute top-0 right-0 z-20 flex h-full items-center bg-linear-to-l
        from-primary to-transparent
      "
    >
      <button
        :aria-label="i18n.t('component.tabs.scroll_right')"
        class="
          flex size-7 items-center justify-center rounded-md bg-primary
          text-secondary
          hover:bg-primary-hover
        "
        tabindex="-1"
        type="button"
        @click="scrollToRight"
      >
        <svg
          aria-hidden="true"
          class="size-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  </div>
</template>
