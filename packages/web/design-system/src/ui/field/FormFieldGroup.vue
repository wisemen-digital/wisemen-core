<script setup lang="ts">
import { UIColumnLayout } from '@/ui/column-layout'
</script>

<template>
  <UIColumnLayout
    class="w-full"
    gap="xl"
  >
    <slot />
  </UIColumnLayout>
</template>
