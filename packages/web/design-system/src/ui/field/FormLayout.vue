<script setup lang="ts">
import { UIColumnLayout } from '@/ui/column-layout'
</script>

<template>
  <UIColumnLayout
    gap="2xl"
    class="items-stretch"
  >
    <slot />
  </UIColumnLayout>
</template>
