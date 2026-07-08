<script setup lang="ts">
import {
  AnimatePresence,
  Motion,
} from 'motion-v'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  isHoveringOverDropzone: boolean
  isHoveringOverPage: boolean
}>()

const i18n = useI18n()
</script>

<template>
  <AnimatePresence>
    <Motion
      v-if="props.isHoveringOverPage"
      :class="{
        'animate-pulse': !props.isHoveringOverDropzone,
      }"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      class="
        pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-xl
        border-[1.5px] border-dashed border-brand-500/50
      "
    >
      <AnimatePresence>
        <Motion
          v-if="props.isHoveringOverDropzone"
          :initial="{
            opacity: 0,
            scale: 1.01,
          }"
          :animate="{
            opacity: 1,
            scale: 1,
          }"
          :exit="{
            opacity: 0,
            scale: 1.01,
          }"
          class="
            absolute inset-0 flex items-center justify-center
            bg-brand-primary/90
          "
        >
          <p class="text-sm font-medium text-brand-secondary">
            {{ i18n.t('component.form_file_upload.dropzone_overlay.title') }}
          </p>
        </Motion>
      </AnimatePresence>
    </Motion>
  </AnimatePresence>
</template>
