<script setup lang="ts">
import { TooltipArrow as RekaTooltipArrow } from 'reka-ui'
</script>

<template>
  <RekaTooltipArrow
    class="relative -mb-4 h-4 w-10 -translate-y-px overflow-hidden"
    as="div"
  >
    <div
      class="
        absolute left-1/2 size-4 -translate-x-1/2 -translate-y-3 rotate-45
        rounded-xxs border border-secondary bg-primary shadow-lg
      "
    />
  </RekaTooltipArrow>
</template>
