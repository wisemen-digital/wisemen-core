<script setup lang="ts">
import { useMainSidebar } from '@/ui/sidebar/mainSidebar.composable'

const {
  sidebarLogoHeight,
} = useMainSidebar()
</script>

<template>
  <div
    :style="{
      height: sidebarLogoHeight,
    }"
  >
    <slot />
  </div>
</template>
