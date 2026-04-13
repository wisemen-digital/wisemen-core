<script setup lang="ts">
import { TooltipProvider as RekaTooltipProvider } from 'reka-ui'
</script>

<template>
  <RekaTooltipProvider>
    <slot />
  </RekaTooltipProvider>
</template>
