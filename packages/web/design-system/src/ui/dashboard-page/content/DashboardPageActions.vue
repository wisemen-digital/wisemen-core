<script setup lang="ts">
import DashboardPageContainer from '@/ui/dashboard-page/DashboardPageContainer.vue'
import RowLayout from '@/ui/row-layout/RowLayout.vue'
</script>

<template>
  <DashboardPageContainer
    class="flex h-11 shrink-0 justify-center border-b border-secondary"
  >
    <slot>
      <RowLayout
        class="size-full"
        justify="between"
      >
        <slot name="left">
          <span />
        </slot>

        <slot name="right">
          <span />
        </slot>
      </RowLayout>
    </slot>
  </DashboardPageContainer>
</template>
