<script setup lang="ts">
import DashboardPageContainer from '@/ui/dashboard-page/DashboardPageContainer.vue'
</script>

<template>
  <DashboardPageContainer class="h-full overflow-auto py-2xl">
    <slot />
  </DashboardPageContainer>
</template>
