<script setup lang="ts">
import { PlusIcon } from '@wisemen/vue-core-icons'

import { UIEmptyState } from '@/ui/empty-state'
</script>

<template>
  <div class="max-w-sm p-xl">
    <UIEmptyState
      :primary-action="{
        label: 'New project',
        iconLeft: PlusIcon,
        onClick: () => { },
      }"
      :secondary-action="{
        label: 'Clear search',
        onClick: () => { },
      }"
      illustration="cloud-search"
      title="No project found"
      description="Your search 'landing page design' did not match any projects. Please try again"
    />
  </div>
</template>
