<script setup lang="ts">
import ConfigProvider from '@/ui/config-provider/ConfigProvider.vue'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'

defineProps<{
  theme?: string
}>()
</script>

<template>
  <!-- eslint-disable better-tailwindcss/no-unknown-classes -->
  <ConfigProvider
    locale="en-US"
    hour-cycle="24-hour"
  >
    <ThemeProvider
      :appearance="theme ?? 'light'"
    >
      <div
        class="
          default flex items-center justify-center bg-primary p-4 text-primary
        "
      >
        <slot />
      </div>
    </ThemeProvider>
  </ConfigProvider>
</template>
