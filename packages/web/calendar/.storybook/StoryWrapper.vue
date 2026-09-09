<script setup lang="ts">
import {
  UIConfigProvider,
  UIThemeProvider,
  UITooltipProvider,
} from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIConfigProvider
    locale="en-US"
    hour-cycle="24-hour"
    number-format="system"
    project-name="calendar-storybook"
    auto-close-toast="never"
  >
    <UIThemeProvider appearance="light">
      <UITooltipProvider>
        <div class="default light bg-primary p-4">
          <slot />
        </div>
      </UITooltipProvider>
    </UIThemeProvider>
  </UIConfigProvider>
</template>
