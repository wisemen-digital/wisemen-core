<script setup lang="ts">
import { UIColumnLayout } from '@/ui/column-layout/index'
import { UISkeletonItem } from '@/ui/skeleton-item/index'
</script>

<template>
  <div
    class="p-lg"
    role="status"
    aria-live="polite"
  >
    <span class="sr-only">Loading actions</span>

    <UIColumnLayout gap="4xl">
      <div
        v-for="i in 2"
        :key="i"
      >
        <UISkeletonItem class="h-2 w-20" />

        <UIColumnLayout
          class="mt-xl"
          gap="lg"
        >
          <UISkeletonItem class="h-3 w-40" />
          <UISkeletonItem class="h-3 w-24" />
          <UISkeletonItem class="h-3 w-48" />
          <UISkeletonItem class="h-3 w-40" />
        </UIColumnLayout>
      </div>
    </UIColumnLayout>
  </div>
</template>
