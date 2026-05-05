<script setup lang="ts">
import { ref } from 'vue'

import InlineTextareaField from '@/ui/inline-textarea-field/InlineTextareaField.vue'

const empty = ref<string | null>(null)
const filled = ref<string | null>('Some longer note text that spans multiple lines when needed.')
const disabled = ref<string | null>('Disabled content')
const readonly = ref<string | null>('Readonly content')
const error = ref<string | null>('Invalid content')
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <div>
      <p class="mb-4 text-sm font-medium text-secondary">
        States
      </p>
      <div class="flex flex-wrap items-start gap-6">
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">Empty</span>
          <InlineTextareaField
            v-model="empty"
            label="Empty"
            placeholder="Enter notes..."
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">Filled</span>
          <InlineTextareaField
            v-model="filled"
            label="Filled"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">Disabled</span>
          <InlineTextareaField
            v-model="disabled"
            :is-disabled="true"
            label="Disabled"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">Readonly</span>
          <InlineTextareaField
            v-model="readonly"
            :is-readonly="true"
            label="Readonly"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">Error</span>
          <InlineTextareaField
            v-model="error"
            label="Error"
            error-message="This value is invalid"
          />
        </div>
      </div>
    </div>

    <div>
      <p class="mb-4 text-sm font-medium text-secondary">
        Resize modes
      </p>
      <div class="flex flex-wrap items-start gap-6">
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">none</span>
          <InlineTextareaField
            v-model="filled"
            label="No resize"
            resize="none"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">vertical</span>
          <InlineTextareaField
            v-model="filled"
            label="Vertical resize"
            resize="vertical"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">auto-vertical</span>
          <InlineTextareaField
            v-model="filled"
            label="Auto vertical"
            resize="auto-vertical"
          />
        </div>
      </div>
    </div>
  </div>
</template>
