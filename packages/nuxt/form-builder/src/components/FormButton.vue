<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'

const props = withDefaults(defineProps<{
  disabled?: boolean
  label: string
  loading?: boolean
}>(), {
  disabled: false,
  loading: false,
})
</script>

<template>
  <UButton
    :disabled="props.disabled || props.loading"
    :loading="props.loading"
    class="w-full justify-center sm:w-auto"
    type="submit"
  >
    {{ props.label }}
  </UButton>
</template>
