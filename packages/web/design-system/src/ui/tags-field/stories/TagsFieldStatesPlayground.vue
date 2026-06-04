<script setup lang="ts">
import { ref } from 'vue'

import TagsField from '@/ui/tags-field/TagsField.vue'

const defaultValue = ref<string[]>([])
const disabledValue = ref<string[]>(['Vue', 'React'])
const errorValue = ref<string[]>(['invalid tag'])
const filledValue = ref<string[]>(['TypeScript', 'Vue', 'Vite'])
const loadingValue = ref<string[]>([])
const readonlyValue = ref<string[]>(['Read', 'Only'])
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <TagsField
      v-model="defaultValue"
      class="w-64"
      label="Default"
      placeholder="Add a tag..."
    />

    <TagsField
      v-model="filledValue"
      class="w-64"
      label="Filled"
      placeholder="Add a tag..."
    />

    <TagsField
      v-model="disabledValue"
      :is-disabled="true"
      class="w-64"
      label="Disabled"
      disabled-reason="You don't have permission to edit this field"
      placeholder="Add a tag..."
    />

    <TagsField
      v-model="readonlyValue"
      :is-readonly="true"
      class="w-64"
      label="Read Only"
    />

    <TagsField
      v-model="loadingValue"
      :is-loading="true"
      class="w-64"
      label="Loading"
      placeholder="Loading..."
    />

    <TagsField
      v-model="errorValue"
      class="w-64"
      error-message="This field has an error"
      label="Error"
    />

    <TagsField
      v-model="filledValue"
      class="w-64"
      label="Help"
      help-text="Separate tags by pressing Enter or typing a comma"
    />
  </div>
</template>
