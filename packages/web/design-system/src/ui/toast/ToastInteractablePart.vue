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
      class="inline size-3.5 rounded-xs mr-xs align-sub"
    >

    <Component
      :is="props.icon"
      v-else-if="props.icon !== null"
      class="inline size-3.5 align-sub -translate-y-px text-secondary mr-xs"
    />

    <span class="font-medium text-primary">
      {{ props.label }}
    </span>
  </Component>
</template>
