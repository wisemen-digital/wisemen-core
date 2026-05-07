<script setup lang="ts">
import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { RouterLink } from 'vue-router'

const props = defineProps<{
  icon: Component | null
  imageSrc: string | null
  label: string
  to: RouteLocationRaw | null
}>()

const emit = defineEmits<{
  click: []
}>()

function onClick(): void {
  if (props.to !== null) {
    emit('click')
  }
}
</script>

<template>
  <Component
    :is="props.to === null ? 'span' : RouterLink"
    :to="props.to"
    :class="{
      'hover:underline': props.to !== null,
    }"
    @click="onClick"
  >
    <img
      v-if="props.imageSrc !== null"
      :src="props.imageSrc"
      :alt="props.label"
      class="mr-xs inline size-3.5 -translate-y-px rounded-xs align-middle"
    >

    <Component
      :is="props.icon"
      v-else-if="props.icon !== null"
      class="mr-xs inline size-3.5 -translate-y-px align-sub text-secondary"
    />

    <span class="font-medium text-primary">
      {{ props.label }}
    </span>
  </Component>
</template>
