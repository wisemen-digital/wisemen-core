<script setup lang="ts">
import type { IndividualKey } from '@tanstack/vue-hotkeys'
import { useKeyHold } from '@tanstack/vue-hotkeys'

const props = defineProps<{
  isKeyHoldVisualizationEnabled: boolean
  keyboardKey: string
  rawKey: IndividualKey
}>()

const isHeld = useKeyHold(props.rawKey)
</script>

<template>
  <kbd
    :class="{
      'bg-primary/75 text-tertiary dark:bg-secondary': !isHeld || !isKeyHoldVisualizationEnabled,
      'bg-tertiary/75 text-primary': isHeld && isKeyHoldVisualizationEnabled,
    }"
    class="
      flex h-4 min-w-4 items-center justify-center rounded-xs border
      border-secondary bg-primary px-xxs text-center font-sans text-[0.6187rem]
      capitalize
    "
  >
    {{ props.keyboardKey }}
  </kbd>
</template>
