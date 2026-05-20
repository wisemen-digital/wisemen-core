<script setup lang="ts">
import MainLayoutCornerHighlight from './MainLayoutCornerHighlight.vue'
</script>

<template>
  <div class="relative flex h-dvh w-full overflow-hidden">
    <slot />

    <MainLayoutCornerHighlight />
  </div>
</template>
