<script setup lang="ts">
import UFormField from '@nuxt/ui/components/FormField.vue'

import AnimateHeight from './AnimateHeight.vue'

defineProps<{
  isRequired?: boolean
  isTouched?: boolean
  errorMessage?: string | null
  help?: string | null
  label: string
  showError?: boolean
}>()
</script>

<template>
  <UFormField
    :error="showError || isTouched ? errorMessage ?? undefined : undefined"
    :label="label"
    :required="isRequired"
    :ui="{
      error: 'mt-0',
    }"
  >
    <slot />

    <template #error="{ error }">
      <AnimateHeight>
        <div v-if="!error && (help)">
          <p class="mt-1 text-xs text-muted">
            {{ help }}
          </p>
        </div>
        <div v-else-if="error && typeof error === 'string'">
          <p class="mt-1 text-xs text-error">
            {{ error }}
          </p>
        </div>
      </AnimateHeight>
    </template>
  </UFormField>
</template>
