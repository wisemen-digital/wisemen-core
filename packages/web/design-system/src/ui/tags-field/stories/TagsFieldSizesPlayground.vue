<script setup lang="ts">
import { ref } from 'vue'

import TagsField from '@/ui/tags-field/TagsField.vue'

const mdValue = ref<string[]>([
  'Vue',
  'TypeScript',
])
const smValue = ref<string[]>([
  'Vue',
  'TypeScript',
])
</script>

<template>
  <div class="flex items-end gap-4">
    <TagsField
      v-model="smValue"
      class="w-64"
      label="Small (sm)"
      placeholder="Add a tag..."
      size="sm"
    />

    <TagsField
      v-model="mdValue"
      class="w-64"
      label="Medium (md)"
      placeholder="Add a tag..."
      size="md"
    />
  </div>
</template>
