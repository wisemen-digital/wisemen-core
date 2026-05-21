<script setup lang="ts">
import {
  UIActionTrigger,
  UIClickableElement,
} from '@wisemen/vue-core-design-system'

import type {
  Filter,
  FilterWithAction,
} from '@/composables'

const props = defineProps<{
  filter: FilterWithAction<Filter>
}>()
</script>

<template>
  <UIActionTrigger
    :current-context-only="true"
    :action="props.filter.action"
  >
    <UIClickableElement>
      <button
        type="button"
        class="size-full"
      >
        <slot />
      </button>
    </UIClickableElement>
  </UIActionTrigger>
</template>
