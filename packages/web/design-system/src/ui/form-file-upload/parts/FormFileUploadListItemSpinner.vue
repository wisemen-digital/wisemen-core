<script setup lang="ts">
import { UILoader } from '@/ui/loader'
</script>

<template>
  <div
    class="
      absolute right-0 flex h-full items-center bg-linear-to-l from-secondary
      via-secondary via-80% px-lg
    "
  >
    <UILoader class="size-3.5 text-tertiary" />
  </div>
</template>
