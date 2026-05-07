<script setup lang="ts">
import { CollapsibleTrigger } from 'reka-ui'

import { UIClickableElement } from '@/ui/clickable-element'
import type { DetailListCollapseOptions } from '@/ui/detail-list/detailList.type'
import DetailListGroupHeaderCollapseArrowIcon from '@/ui/detail-list/DetailListGroupHeaderCollapseArrowIcon.vue'
import DetailListGroupHeaderCollapseInfo from '@/ui/detail-list/DetailListGroupHeaderCollapseInfo.vue'
import { UIRowLayout } from '@/ui/row-layout'
import { UIText } from '@/ui/text'

const props = defineProps<{
  isOpen: boolean
  collapseOptions: DetailListCollapseOptions
  label: string
}>()
</script>

<template>
  <UIRowLayout
    justify="between"
    class="w-full"
  >
    <UIClickableElement>
      <CollapsibleTrigger
        :disabled="!props.collapseOptions.isCollapsible"
        class="
          group/trigger -ml-sm flex h-6.5 max-w-full items-center
          overflow-hidden px-sm py-xs duration-100
          not-disabled:hover:bg-tertiary
          disabled:cursor-default!
        "
      >
        <UIRowLayout gap="xs">
          <UIRowLayout
            gap="none"
            class="w-full"
          >
            <UIText
              :text="props.label"
              class="text-xs font-medium text-primary"
            />

            <DetailListGroupHeaderCollapseInfo
              v-if="props.collapseOptions.isCollapsible && props.collapseOptions.badge != null"
              :badge="props.collapseOptions.badge!"
              :is-visible="!props.isOpen"
            />
          </UIRowLayout>

          <DetailListGroupHeaderCollapseArrowIcon
            v-if="props.collapseOptions.isCollapsible"
            class="
              size-4 shrink-0 text-disabled opacity-0 duration-200
              group-hover/detail-list-group:text-secondary
              group-hover/detail-list-group:opacity-100
              group-has-focus-visible/detail-list-group:opacity-100
              group-data-[state=closed]/trigger:opacity-100
              group-data-[state=open]/trigger:rotate-90
              pointer-coarse:opacity-100
            "
          />
        </UIRowLayout>
      </CollapsibleTrigger>
    </UIClickableElement>

    <div
      class="
        opacity-0 duration-100
        group-hover/detail-list-group:opacity-100
        focus-visible:opacity-100
        has-focus-visible:opacity-100
        pointer-coarse:opacity-100
      "
    >
      <slot name="actions" />
    </div>
  </UIRowLayout>
</template>
