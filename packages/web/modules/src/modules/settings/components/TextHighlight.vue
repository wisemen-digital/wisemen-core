<script setup lang="ts">
import type { HighlightWords } from 'highlight-words'
import highlightWords from 'highlight-words'
import { computed } from 'vue'

import { useInjectSettingsContext } from '@/modules/settings/settings.context'

const props = defineProps<{
  text: string
}>()

const {
  searchTerm,
} = useInjectSettingsContext()

const chunks = computed<HighlightWords.Chunk[]>(() => highlightWords({
  query: searchTerm.value,
  text: props.text,
}))
</script>

<template>
  <span>
    <span
      v-for="(chunk, index) in chunks"
      :key="index"
      :class="{
        'bg-brand-200 dark:bg-brand-300 dark:text-brand-900': chunk.match,
      }"
    >
      {{ chunk.text }}
    </span>
  </span>
</template>
