<script setup lang="ts">
import UAlert from '@nuxt/ui/components/Alert.vue'

defineProps<{
  isSuccess: boolean
  successText: string
}>()
</script>

<template>
  <div class="relative">
    <div :class="isSuccess ? 'pointer-events-none opacity-35 blur-sm' : ''">
      <slot />
    </div>
    <div
      v-if="isSuccess"
      class="absolute inset-0 grid place-items-center p-6 text-center"
    >
      <UAlert
        :title="successText"
        color="success"
      />
    </div>
  </div>
</template>
