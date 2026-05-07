<script setup lang="ts">
import { useMainSidebar } from '@/ui/sidebar/mainSidebar.composable'

const {
  sidebarContainerPadding,
} = useMainSidebar()
</script>

<template>
  <div
    class="flex h-full flex-col justify-between overflow-hidden text-primary"
  >
    <div
      :style="{ padding: sidebarContainerPadding }"
    >
      <slot name="header" />
    </div>
    <nav
      :style="{ padding: sidebarContainerPadding }"
      class="flex h-full flex-col justify-between gap-2xl overflow-y-auto"
    >
      <slot name="navigation" />
      <slot name="bottom-navigation" />
    </nav>
    <div
      :style="{ padding: sidebarContainerPadding }"
      class="flex flex-col gap-sm"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
