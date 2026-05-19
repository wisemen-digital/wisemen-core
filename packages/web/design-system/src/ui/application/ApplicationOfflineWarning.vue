<script setup lang="ts">
import { useNetwork } from '@vueuse/core'
import { WifiOffIcon } from '@wisemen/vue-core-icons'
import {
  AnimatePresence,
  Motion,
} from 'motion-v'
import {
  computed,
  ref,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { useIsReducedMotion } from '@/composables/useIsReducedMotion.composable'
import { UIClickableElement } from '@/ui/clickable-element'
import { UIText } from '@/ui/text'

const i18n = useI18n()

const {
  isOnline,
} = useNetwork()
const isDismissed = ref<boolean>(false)

const isOffline = computed<boolean>(() => !isOnline.value)

function onDismiss(): void {
  isDismissed.value = true
}

watch(isOffline, (isOffline) => {
  if (isOffline) {
    isDismissed.value = false
  }
})

const isReducedMotion = useIsReducedMotion()
</script>

<template>
  <AnimatePresence>
    <Motion
      v-if="isOffline && !isDismissed"
      :initial="{
        opacity: 0,
        y: -20,
      }"
      :animate="{
        opacity: 1,
        y: 0,
      }"
      :exit="{
        opacity: 0,
        y: -40,
      }"
      :as-child="true"
      :transition="{
        type: 'spring',
        bounce: 0,
        duration: isReducedMotion ? 0 : 0.3,
      }"
      while-hover="hovered"
    >
      <UIClickableElement>
        <button
          class="group absolute top-4 left-1/2 z-10 -translate-x-1/2"
          @click="onDismiss"
        >
          <div
            class="
              rounded-2xl border border-secondary bg-secondary px-lg py-sm
              shadow-lg duration-200 ease-in-out
              group-hover:translate-y-0.5 group-hover:scale-102
            "
          >
            <div
              class="
                grid grid-cols-[auto_auto] items-center gap-x-md gap-y-none
              "
            >
              <WifiOffIcon class="size-3 text-tertiary" />

              <UIText
                :text="i18n.t('component.offline_warning.title')"
                class="text-xs text-primary"
              />

              <span />

              <Motion
                :variants="{
                  hovered: {
                    height: 'auto',
                    opacity: 1,
                    y: 0,
                  },
                }"
                :initial="{
                  height: '0px',
                  y: -8,
                  opacity: 0,
                }"
                :transition="{
                  type: 'spring',
                  bounce: 0,
                  duration: 0.3,
                }"
                class="will-change-transform"
              >
                <div class="flex">
                  <UIText
                    :text="i18n.t('component.offline_warning.dismiss')"
                    class="text-xs text-disabled"
                  />
                </div>
              </Motion>
            </div>
          </div>
        </button>
      </UIClickableElement>
    </Motion>
  </AnimatePresence>
</template>
