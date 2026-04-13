<script setup lang="ts">
import type { Component } from 'vue'

const props = defineProps<{
  icon: Component
}>()
</script>

<template>
  <Component
    :is="props.icon"
    v-if="props.icon"
    class="
      size-3.5 shrink-0 text-fg-quaternary
      group-data-disabled/field-wrapper:text-fg-disabled-subtle
    "
  />
</template>
