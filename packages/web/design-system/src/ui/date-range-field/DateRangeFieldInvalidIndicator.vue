<script setup lang="ts">
import { AlertTriangleIcon } from '@wisemen/vue-core-icons'
import {
  AnimatePresence,
  Motion,
} from 'motion-v'
import { useI18n } from 'vue-i18n'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'

const props = defineProps<{
  isVisible: boolean
}>()

const i18n = useI18n()
</script>

<template>
  <AnimatePresence :initial="false">
    <Motion
      v-if="props.isVisible"
      :initial="{
        opacity: 0,
        filter: 'blur(4px)',
      }"
      :animate="{
        opacity: 1,
        filter: 'blur(0)',
      }"
      :exit="{
        opacity: 0,
        filter: 'blur(4px)',
      }"
      :transition="{
        duration: 0.3,
        type: 'spring',
        bounce: 0,
      }"
    >
      <ActionTooltip :label="i18n.t('component.date_range_picker.invalid_range')">
        <span class="flex items-center">
          <AlertTriangleIcon class="size-4 text-error-primary" />
        </span>
      </ActionTooltip>
    </Motion>
  </AnimatePresence>
</template>
