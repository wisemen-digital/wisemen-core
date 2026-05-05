<script setup lang="ts">
import { ref } from 'vue'

import InlineTextField from '@/ui/inline-text-field/InlineTextField.vue'

const empty = ref<string | null>(null)
const filled = ref<string | null>('Hello World')
const disabled = ref<string | null>('Disabled value')
const readonly = ref<string | null>('Readonly value')
const error = ref<string | null>('Invalid value')
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <div>
      <p class="text-sm">
        012334
      </p>
      <InlineTextField
        v-model="empty"
        label="Empty"
        placeholder="Editable text"
      />
    </div>
    <div>
      <p class="mb-4 text-sm font-medium text-secondary">
        States
      </p>
      <div class="flex flex-wrap items-center gap-6">
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">Empty</span>
          <InlineTextField
            v-model="empty"
            label="Empty"
            placeholder="Editable text"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">Filled</span>
          <InlineTextField
            v-model="filled"
            label="Filled"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">Disabled</span>
          <InlineTextField
            v-model="disabled"
            :is-disabled="true"
            label="Disabled"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">Readonly</span>
          <InlineTextField
            v-model="readonly"
            :is-readonly="true"
            label="Readonly"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">Error</span>
          <InlineTextField
            v-model="error"
            label="Error"
            error-message="This value is invalid"
          />
        </div>
      </div>
    </div>

    <div>
      <p class="mb-4 text-sm font-medium text-secondary">
        Sizes
      </p>
      <div class="flex flex-wrap items-center gap-6">
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">xs</span>
          <InlineTextField
            v-model="filled"
            label="Extra small"
            size="xs"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">sm</span>
          <InlineTextField
            v-model="filled"
            label="Small"
            size="sm"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">md</span>
          <InlineTextField
            v-model="filled"
            label="Medium"
            size="md"
          />
        </div>
      </div>
    </div>

    <div>
      <p class="mb-4 text-sm font-medium text-secondary">
        Hierarchy
      </p>
      <div class="flex flex-wrap gap-4">
        <div class="flex flex-col gap-1 rounded-md bg-primary p-4">
          <span class="text-xs text-tertiary">Primary surface</span>
          <InlineTextField
            v-model="filled"
            label="Primary"
            variant="primary"
          />
        </div>
        <div class="flex flex-col gap-1 rounded-md bg-secondary p-4">
          <span class="text-xs text-tertiary">Secondary surface</span>
          <InlineTextField
            v-model="filled"
            label="Secondary"
            variant="secondary"
          />
        </div>
        <div class="flex flex-col gap-1 rounded-md bg-tertiary p-4">
          <span class="text-xs text-tertiary">Tertiary surface</span>
          <InlineTextField
            v-model="filled"
            label="Tertiary"
            variant="tertiary"
          />
        </div>
      </div>
    </div>
  </div>
</template>
