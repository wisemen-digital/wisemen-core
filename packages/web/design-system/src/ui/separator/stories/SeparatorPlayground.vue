<script setup lang="ts">
/* eslint-disable @intlify/vue-i18n/no-raw-text */
import Separator from '@/ui/separator/Separator.vue'
</script>

<template>
  <div class="flex w-64 flex-col gap-8">
    <div class="flex flex-col gap-2">
      <span class="text-sm text-primary">Section above</span>
      <Separator orientation="horizontal" />
      <span class="text-sm text-primary">Section below</span>
    </div>

    <div class="flex h-6 items-center gap-2">
      <span class="text-sm text-primary">Left</span>
      <Separator orientation="vertical" />
      <span class="text-sm text-primary">Right</span>
    </div>
  </div>
</template>
