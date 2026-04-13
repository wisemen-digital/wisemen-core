<script setup lang="ts">
import { ChevronDownIcon } from '@wisemen/vue-core-icons'
import type { Component } from 'vue'

import ClickableElement from '@/ui/clickable-element/ClickableElement.vue'

const props = defineProps<{
  activeButtonClasses: Record<string, boolean>
  icon: Component | null
  label: string
}>()
</script>

<template>
  <ClickableElement>
    <button
      :class="[
        activeButtonClasses,
      ]"
      class="
        relative z-10 flex items-center gap-sm rounded-md px-md py-xs text-xs
        font-semibold duration-200
      "
    >
      <component
        :is="props.icon"
        v-if="props.icon !== null"
        class="size-4 shrink-0"
      />
      {{ props.label }}
      <ChevronDownIcon class="size-4" />
    </button>
  </ClickableElement>
</template>
