<script setup lang="ts">
import { AlertTriangleIcon } from '@wisemen/vue-core-icons'
import {
  AnimatePresence,
  Motion,
} from 'motion-v'

import { UIRowLayout } from '@/ui/row-layout/index'
import { UIText } from '@/ui/text/index'

const props = defineProps<{
  errorMessage: string | null
  for: string | null
}>()
</script>

<template>
  <AnimatePresence :initial="false">
    <Motion
      v-if="props.errorMessage !== null"
      :initial="{
        height: 0,
        opacity: 0,
        filter: 'blur(4px)',
      }"
      :animate="{
        height: 'auto',
        opacity: 1,
        filter: 'blur(0)',
      }"
      :exit="{
        height: 0,
        opacity: 0,
        filter: 'blur(4px)',
      }"
      :transition="{
        duration: 0.3,
        type: 'spring',
        bounce: 0,
      }"
    >
      <UIRowLayout
        class="pt-xs text-xs"
        align="start"
        gap="sm"
      >
        <div
          class="flex h-lh items-center"
        >
          <Component
            :is="AlertTriangleIcon"
            class="size-3.5 shrink-0 text-error-primary"
          />
        </div>

        <UIText
          :id="`${props.for}-error-message`"
          :text="props.errorMessage"
          :truncate="false"
          role="alert"
          aria-live="assertive"
          class="block text-error-primary"
        />
      </UIRowLayout>
    </Motion>
  </AnimatePresence>
</template>
