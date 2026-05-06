<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import type { ToastInteractableModel } from '@/ui/toast/toast.type'
import ToastInteractablePart from '@/ui/toast/ToastInteractablePart.vue'

interface TextChunk {
  label: string
  type: 'text'
}

interface InteractableChunk {
  icon: Component | null
  imageSrc: string | null
  key: string
  label: string
  to?: RouteLocationRaw
  type: 'interactable'
}

type MessageChunk = InteractableChunk | TextChunk

const props = defineProps<{
  message: string
  models: Record<string, ToastInteractableModel>
}>()

const emit = defineEmits<{
  closeToast: []
}>()

const chunks = computed<MessageChunk[]>(() => {
  return props.message.split(/(\{.*?\})/g).map((part) => {
    const interactableMatch = part.match(/^\{(.*?)\}$/)

    if (interactableMatch === null) {
       return {
        label: part,
        type: 'text',
      } as TextChunk
    }

    const key = interactableMatch[1]!

    const model = props.models[key as keyof typeof props.models] ?? null

    if (model === null) {
      console.warn(`No model found for key "${key}" in toast message "${props.message}"`)

      return {
        label: part,
        type: 'text',
      } as TextChunk
    }

    return {
      icon: model.icon ?? null,
      imageSrc: model.imageSrc ?? null,
      key,
      label: model.label,
      to: model.to,
      type: 'interactable',
    }
  })
})
</script>

<template>
  <span class="text-sm text-secondary">
    <template
      v-for="(chunk, chunkIndex) of chunks"
      :key="chunkIndex"
    >
      <template v-if="chunk.type === 'text'">
        {{ chunk.label }}
      </template>

      <ToastInteractablePart
        v-else-if="chunk.type === 'interactable'"
        :icon="chunk.icon"
        :image-src="chunk.imageSrc"
        :label="chunk.label"
        :to="chunk.to ?? null"
        @click="emit('closeToast')"
      />
    </template>
  </span>
</template>
