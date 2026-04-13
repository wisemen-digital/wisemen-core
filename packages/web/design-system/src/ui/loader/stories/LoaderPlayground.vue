<script setup lang="ts">
/* eslint-disable @intlify/vue-i18n/no-raw-text */
import Loader from '@/ui/loader/Loader.vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-sm font-medium text-secondary">
      Sizes
    </p>
    <div class="flex items-center gap-8">
      <Loader class="size-4 text-primary" />
      <Loader class="size-6 text-primary" />
      <Loader class="size-8 text-primary" />
    </div>
  </div>
</template>
