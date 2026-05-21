<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <div class="p-md">
    <span class="flex text-xs font-semibold text-secondary">
      {{ props.title }}
    </span>
  </div>
</template>
