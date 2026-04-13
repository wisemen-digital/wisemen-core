<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import type { BreadcrumbItemProps } from '@/ui/breadcrumbs/breadcrumb.props'
import ClickableElement from '@/ui/clickable-element/ClickableElement.vue'
import RowLayout from '@/ui/row-layout/RowLayout.vue'
import { UIText } from '@/ui/text/index'
import { twMerge } from '@/utils/twMerge.util'

const props = defineProps<BreadcrumbItemProps>()

const srOnlyClasses = computed<string>(() => {
  if (props.isLabelHidden) {
    return 'sr-only'
  }

  return ''
})

const toClasses = computed<string>(() => {
  if (props.to !== undefined) {
    return 'group-hover:text-primary group-hover:underline'
  }

  return ''
})
</script>

<template>
  <Component
    :is="props.to !== undefined ? ClickableElement : 'span'"
    class="min-w-0 overflow-hidden"
  >
    <Component
      :is="props.to !== undefined ? RouterLink : 'span'"
      :to="props.to"
      class="group min-w-0"
    >
      <RowLayout
        class="min-w-0"
        gap="sm"
      >
        <ActionTooltip
          :is-disabled="!props.isLabelHidden"
          :label="props.label"
        >
          <Component
            :is="props.icon"
            v-if="props.icon"
            :class="{
              'group-hover:text-primary': props.to !== undefined,
            }"
            class="size-4 shrink-0 text-quaternary"
          />
        </ActionTooltip>
        <UIText
          v-if="props.label"
          :text="props.label"
          :class="twMerge(
            'text-xs text-quaternary',
            srOnlyClasses,
            toClasses,
          )"
        />
      </RowLayout>
    </Component>
  </Component>
</template>
