<script setup lang="ts">
import type { HourCycle } from '@/types/hourCycle.type'
import ConfigProvider from '@/ui/config-provider/ConfigProvider.vue'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'

defineProps<{
  hourCycle?: HourCycle
  locale?: string
  theme?: string
}>()
</script>

<template>
  <!-- eslint-disable better-tailwindcss/no-unknown-classes -->
  <ConfigProvider
    :locale="locale ?? 'en-US'"
    :hour-cycle="hourCycle ?? '24-hour'"
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
