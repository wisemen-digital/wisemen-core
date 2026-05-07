<script setup lang="ts">
import {
  AnimatePresence,
  Motion,
  useReducedMotion,
} from 'motion-v'
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'

import MainSidebarContent from '@/ui/sidebar/components/MainSidebarContent.vue'
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
const isReduceMotionEnabledOnDevice = useReducedMotion()

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
        @open-auto-focus.prevent
      >
        <MainSidebarTransition
          class="absolute z-6 h-full w-64 p-md outline-none"
        >
          <div
            class="
              size-full rounded-xl border border-secondary bg-secondary
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
      class="absolute h-full"
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
    class="absolute h-full overflow-hidden"
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
  </Motion>
</template>
