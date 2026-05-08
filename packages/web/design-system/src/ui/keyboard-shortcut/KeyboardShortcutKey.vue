<script setup lang="ts">
import type { IndividualKey } from '@tanstack/vue-hotkeys'
import { useKeyHold } from '@tanstack/vue-hotkeys'

const props = defineProps<{
  enableKeyHoldVisualization: boolean
  keyboardKey: string
  rawKey: IndividualKey
}>()

const isHeld = useKeyHold(props.rawKey)
</script>

<template>
  <kbd
    :class="{
      'text-tertiary dark:bg-secondary': !isHeld || !enableKeyHoldVisualization,
      'bg-secondary text-primary dark:bg-tertiary': isHeld && enableKeyHoldVisualization,
    }"
    class="
      flex h-4 min-w-4 items-center justify-center rounded-xs border
      border-secondary px-xxs text-center font-sans text-[0.6187rem] capitalize
    "
  >
    {{ props.keyboardKey }}
  </kbd>
</template>
