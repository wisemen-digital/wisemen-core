<script setup lang="ts">
import { ref } from 'vue'

import InlineNumberField from '@/ui/inline-number-field/InlineNumberField.vue'

const empty = ref<number | null>(null)
const filled = ref<number | null>(42)
const disabled = ref<number | null>(100)
const readonly = ref<number | null>(99)
const error = ref<number | null>(-5)
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <div>
      <p class="mb-4 text-sm font-medium text-secondary">
        States
      </p>
      <div class="flex flex-wrap items-center gap-6">
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">Empty</span>
          <InlineNumberField
            v-model="empty"
            label="Empty"
            placeholder="0"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">Filled</span>
          <InlineNumberField
            v-model="filled"
            label="Filled"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">Disabled</span>
          <InlineNumberField
            v-model="disabled"
            :is-disabled="true"
            label="Disabled"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">Readonly</span>
          <InlineNumberField
            v-model="readonly"
            :is-readonly="true"
            label="Readonly"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">Error</span>
          <InlineNumberField
            v-model="error"
            label="Error"
            error-message="Value must be positive"
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
          <InlineNumberField
            v-model="filled"
            label="Extra small"
            size="xs"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">sm</span>
          <InlineNumberField
            v-model="filled"
            label="Small"
            size="sm"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-tertiary">md</span>
          <InlineNumberField
            v-model="filled"
            label="Medium"
            size="md"
          />
        </div>
      </div>
    </div>

    <div>
      <p class="mb-4 text-sm font-medium text-secondary">
        In context (table row)
      </p>
      <div class="rounded-md border border-primary bg-primary">
        <div
          class="
            flex items-center gap-4 border-b border-primary px-4 py-2 text-xs
            font-medium text-secondary
          "
        >
          <span class="w-48">Product</span>
          <span class="w-24">Quantity</span>
          <span class="w-24">Price</span>
        </div>
        <div class="flex items-center gap-4 px-4 py-2">
          <span class="w-48 text-sm text-primary">Widget A</span>
          <InlineNumberField
            v-model="filled"
            label="Quantity for Widget A"
            class="w-24"
            size="sm"
          />
          <InlineNumberField
            v-model="filled"
            :format-options="{ style: 'currency',
                               currency: 'EUR' }"
            label="Price for Widget A"
            class="w-24"
            size="sm"
          />
        </div>
      </div>
    </div>
  </div>
</template>
