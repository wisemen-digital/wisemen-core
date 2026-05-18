<script setup lang="ts">
import ColumnLayout from '#packages/column-layout/ColumnLayout.vue'
</script>

<template>
  <ColumnLayout
    class="size-full"
    align="center"
    justify="center"
  >
    <slot />
  </ColumnLayout>
</template>
