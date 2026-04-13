<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import {
  VcDialogContent,
  VcDialogContentTransition,
  VcDialogDescription,
  VcDialogOverlay,
  VcDialogOverlayTransition,
  VcDialogRoot,
  VcDialogTitle,
} from '@wisemen/vue-core-components'
import { Motion } from 'motion-v'
import { useI18n } from 'vue-i18n'

import { useProvideSettingsDialogContext } from '@/modules/settings/settingsDialog.context'

const isExpanded = useLocalStorage<boolean>('is-dialog-expanded', false)

const {
  t,
} = useI18n()

useProvideSettingsDialogContext({
  isExpanded,
})
</script>

<template>
  <VcDialogRoot>
    <VcDialogContent>
      <VcDialogContentTransition>
        <Motion
          :initial="{
            // Setting the initial state to `initial: false` breaks Motion animations inside the dialog
            width: isExpanded ? '97dvw' : '60rem',
            height: isExpanded ? '95dvh' : '40rem',
          }"
          :animate="{
            width: isExpanded ? '97dvw' : '60rem',
            height: isExpanded ? '95dvh' : '40rem',
          }"
          :transition="{
            duration: 0.4,
            type: 'spring',
            bounce: 0,
          }"
          class="
            max-h-[calc(100dvh-2rem)] min-h-[calc(100dvh-2rem)]
            max-w-[calc(100dvw-2rem)] min-w-[calc(100dvw-2rem)]
            md:min-h-full md:min-w-full
          "
        >
          <VcDialogTitle class="sr-only">
            <h1>
              {{ t('module.settings.title') }}
            </h1>
          </VcDialogTitle>

          <VcDialogDescription class="sr-only">
            <p>
              {{ t('module.settings.description') }}
            </p>
          </VcDialogDescription>

          <slot />
        </Motion>
      </VcDialogContentTransition>
    </VcDialogContent>

    <VcDialogOverlay>
      <VcDialogOverlayTransition />
    </VcDialogOverlay>
  </VcDialogRoot>
</template>
