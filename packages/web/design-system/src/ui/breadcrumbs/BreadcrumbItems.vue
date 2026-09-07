<script setup lang="ts">
import RowLayout from '@/ui/row-layout/RowLayout.vue'
</script>

<template>
  <nav class="min-w-0">
    <RowLayout
      align="center"
      gap="sm"
      class="min-w-0"
    >
      <slot />
    </RowLayout>
  </nav>
</template>
