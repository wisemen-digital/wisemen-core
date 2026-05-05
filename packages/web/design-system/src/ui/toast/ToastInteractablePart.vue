<script setup lang="ts">
import type { Component } from 'vue'
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  icon: Component | null
  imageSrc: string | null
  label: string
  to: RouteLocationRaw | null
}>()

const emit = defineEmits<{
  click: []
}>()

function handleClick(): void {
  if (props.to !== null) {
    emit('click')
  }
}
</script>

<template>
  <Component
    :is="props.to === null ? 'div' : RouterLink"
    :to="props.to"
    :class="{
      'hover:bg-tertiary': props.to !== null,
    }"
    class="
      -mx-xs inline-block items-center gap-xs rounded-sm px-xs duration-100
    "
    @click="handleClick"
  >
    <img
      v-if="props.imageSrc !== null"
      :src="props.imageSrc"
      :alt="props.label"
      class="-mt-xxs mr-xs -ml-xxs inline size-4 rounded-xs"
    >

    <Component
      :is="props.icon"
      v-else-if="props.icon !== null"
      class="-mt-xxs mr-xs inline size-3.5 text-secondary"
    />

    <span class="text-sm font-medium text-primary">
      {{ props.label }}
    </span>
  </Component>
</template>
