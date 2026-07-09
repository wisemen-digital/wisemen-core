<script setup lang="ts">
import {
  AnimatePresence,
  Motion,
} from 'motion-v'
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useIsReducedMotion } from '@/composables/useIsReducedMotion.composable'
import { useInjectMainLayoutContext } from '@/ui/layout/mainLayout.context'
import MainSidebarContent from '@/ui/sidebar/components/MainSidebarContent.vue'
import MainSidebarNavigationLink from '@/ui/sidebar/components/MainSidebarNavigationLink.vue'
import MainSidebarTransition from '@/ui/sidebar/components/MainSidebarTransition.vue'
import { useMainSidebar } from '@/ui/sidebar/mainSidebar.composable'
import type { MainSidebarProps } from '@/ui/sidebar/mainSidebar.props'

const props = withDefaults(defineProps<MainSidebarProps>(), {
  collapsedVariant: 'hidden',
})

const {
  isFloatingSidebar,
  isSidebarOpen,
  setCollapsedVariant,
  sidebarWidth,
} = useMainSidebar()

const i18n = useI18n()
const isReduceMotionEnabledOnDevice = useIsReducedMotion()

const {
  isBrandedActive,
} = useInjectMainLayoutContext()

const brandedClass = computed<string[] | null>(() => isBrandedActive.value
  ? [
      'default',
      'branded',
    ]
  : null)

setCollapsedVariant(props.collapsedVariant)
</script>

<template>
  <DialogRoot
    v-if="isFloatingSidebar"
    v-model:open="isSidebarOpen"
  >
    <AnimatePresence :initial="false">
      <DialogContent
        v-if="isSidebarOpen"
        :as-child="true"
        :force-mount="true"
      >
        <MainSidebarNavigationLink />
        <MainSidebarTransition
          class="absolute z-6 h-full w-64 p-md outline-none"
        >
          <div
            :class="brandedClass"
            class="
              size-full rounded-xl border border-secondary bg-secondary py-md
              shadow-lg/5
            "
          >
            <DialogTitle
              as="h1"
              class="sr-only"
            >
              {{ i18n.t('components.sidebar.title') }}
            </DialogTitle>

            <DialogDescription
              class="sr-only"
              as="p"
            >
              {{ i18n.t('components.sidebar.description') }}
            </DialogDescription>

            <MainSidebarContent>
              <template #header>
                <slot name="header" />
              </template>
              <template #navigation>
                <slot name="navigation" />
              </template>
              <template #bottom-navigation>
                <slot name="bottom-navigation" />
              </template>
              <template #footer>
                <slot name="footer" />
              </template>
            </MainSidebarContent>
          </div>
        </MainSidebarTransition>
      </DialogContent>

      <DialogOverlay
        v-if="isSidebarOpen"
        :as-child="true"
      >
        <Motion
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{
            duration: isReduceMotionEnabledOnDevice ? 0 : 0.3,
          }"
          class="absolute inset-0 z-5 bg-black/10"
        />
      </DialogOverlay>
    </AnimatePresence>
  </DialogRoot>
  <AnimatePresence
    v-else-if="collapsedVariant === 'hidden'"
    :initial="false"
  >
    <MainSidebarTransition
      v-if="isSidebarOpen"
      :style="{
        width: sidebarWidth,
      }"
      class="absolute h-full pt-md"
    >
      <div
        :class="brandedClass"
        class="size-full"
      >
        <MainSidebarContent>
          <template #header>
            <slot name="header" />
          </template>
          <template #navigation>
            <slot name="navigation" />
          </template>
          <template #bottom-navigation>
            <slot name="bottom-navigation" />
          </template>
          <template #footer>
            <slot name="footer" />
          </template>
        </MainSidebarContent>
      </div>
    </MainSidebarTransition>
  </AnimatePresence>
  <Motion
    v-else
    :initial="false"
    :animate="{ width: sidebarWidth }"
    :transition="{
      duration: isReduceMotionEnabledOnDevice ? 0 : 0.3,
      type: 'spring',
      bounce: 0,
    }"
    :style="{ width: sidebarWidth }"
    class="absolute z-1 h-full overflow-hidden pt-[0.475rem]"
  >
    <div
      :class="brandedClass"
      class="size-full"
    >
      <MainSidebarContent>
        <template #header>
          <slot name="header" />
        </template>
        <template #navigation>
          <slot name="navigation" />
        </template>
        <template #bottom-navigation>
          <slot name="bottom-navigation" />
        </template>
        <template #footer>
          <slot name="footer" />
        </template>
      </MainSidebarContent>
    </div>
  </Motion>
</template>
