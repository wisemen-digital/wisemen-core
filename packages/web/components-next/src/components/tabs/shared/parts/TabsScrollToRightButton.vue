<script setup lang="ts">
import {
  AnimatePresence,
  Motion,
} from 'motion-v'
import { useI18n } from 'vue-i18n'

import IconButton from '@/components/button/icon-button/IconButton.vue'
import { useInjectTabsContext } from '@/components/tabs/shared/tabs.context'

const {
  hasHorizontalOverflow,
  hasReachedHorizontalEnd,
  classConfig,
  customClassConfig,
  orientation,
  scrollToRight,
} = useInjectTabsContext()

const {
  t,
} = useI18n()
</script>

<template>
  <AnimatePresence :initial="false">
    <Motion
      v-if="!hasReachedHorizontalEnd && hasHorizontalOverflow && orientation === 'horizontal'"
      :initial="{ opacity: 0,
                  x: 8 }"
      :animate="{ opacity: 1,
                  x: 0 }"
      :exit="{ opacity: 0,
               x: 8 }"
      :as-child="true"
      :transition="{
        duration: 0.1,
      }"
    >
      <div
        class="
          absolute top-0 right-0 z-20 flex h-full items-center bg-linear-to-l
          from-primary to-transparent px-md
        "
      >
        <IconButton
          :class-config="{
            root: 'bg-primary size-7',
            ...classConfig?.scrollButton,
            ...customClassConfig?.scrollButton,
          }"
          :label="t('component.tabs.scroll_to_right')"
          size="sm"
          icon="chevronRight"
          variant="secondary"
          tabindex="-1"
          @click="scrollToRight"
        />
      </div>
    </Motion>
  </AnimatePresence>
</template>
