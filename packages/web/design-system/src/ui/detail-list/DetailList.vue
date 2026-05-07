<script setup lang="ts">
import { UIColumnLayout } from '@/ui/column-layout'
</script>

<template>
  <UIColumnLayout
    gap="2xl"
    class="w-full"
  >
    <slot />
  </UIColumnLayout>
</template>
