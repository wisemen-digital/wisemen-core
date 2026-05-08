<script setup lang="ts">
import {
  CollapsibleContent,
  CollapsibleRoot,
} from 'reka-ui'
import { computed } from 'vue'

import { UIColumnLayout } from '@/ui/column-layout'
import type { DetailListCollapseOptions } from '@/ui/detail-list/detailList.type'
import DetailListGroupHeader from '@/ui/detail-list/DetailListGroupHeader.vue'

const props = withDefaults(defineProps<{
  collapseOptions?: Partial<DetailListCollapseOptions>
  label?: string | null
}>(), {
  label: null,
})

const DEFAULT_COLLAPSE_OPTIONS: DetailListCollapseOptions = {
  isCollapsible: false,
  isOpenByDefault: false,
}

const isOpen = defineModel<boolean>({
  default: undefined,
})

const collapseOptions = computed<DetailListCollapseOptions>(() => {
  return {
    ...DEFAULT_COLLAPSE_OPTIONS,
    ...props.collapseOptions,
  }
})

if (isOpen.value === undefined) {
  isOpen.value = collapseOptions.value.isOpenByDefault
}

const delegatedIsOpen = computed<boolean>({
  get: () => {
    if (!collapseOptions.value.isCollapsible) {
      return true
    }

    return isOpen.value
  },
  set: (value: boolean) => {
    if (!collapseOptions.value.isCollapsible) {
      return
    }

    isOpen.value = value
  },
})
</script>

<template>
  <CollapsibleRoot
    v-model:open="delegatedIsOpen"
    :as-child="true"
  >
    <UIColumnLayout
      gap="none"
      class="group/detail-list-group @container/detail-list w-full"
    >
      <DetailListGroupHeader
        v-if="props.label !== null"
        :label="props.label"
        :is-open="delegatedIsOpen"
        :collapse-options="collapseOptions"
      >
        <template #actions>
          <slot name="actions" />
        </template>
      </DetailListGroupHeader>

      <CollapsibleContent
        class="
          w-full origin-top-left overflow-hidden
          data-[state=closed]:animate-[collapsible-up_150ms]
          data-[state=open]:animate-[collapsible-down_150ms]
        "
      >
        <UIColumnLayout
          :class="{
            'pt-xl': props.label !== null,
          }"
          gap="lg"
        >
          <slot />
        </UIColumnLayout>
      </CollapsibleContent>
    </UIColumnLayout>
  </CollapsibleRoot>
</template>

<style>
@keyframes collapsible-up {
  from {
    height: var(--reka-collapsible-content-height);
  }
  to {
    height: 0;
    opacity: 0;
    transform: scale(0.99) translateY(-0.25rem);
  }
}
@keyframes collapsible-down {
  from {
    height: 0;
    opacity: 0;
    transform: scale(0.99) translateY(-0.25rem);
  }
  to {
    height: var(--reka-collapsible-content-height);
  }
}
</style>
