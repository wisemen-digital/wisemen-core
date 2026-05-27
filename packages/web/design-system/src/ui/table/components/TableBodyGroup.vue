<script setup lang="ts">
import { ChevronDownIcon } from '@wisemen/vue-core-icons'
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from 'reka-ui'
import type { Component } from 'vue'
import { onBeforeUnmount } from 'vue'

import { UIRowLayout } from '@/ui/row-layout/index'
import TableSubgrid from '@/ui/table/components/TableSubgrid.vue'
import { TABLE_Z_INDEX } from '@/ui/table/const/table.const'
import { useInjectTableContext } from '@/ui/table/context/table.context'
import { useProvideTableGroupContext } from '@/ui/table/context/tableGroup.context'
import { UIText } from '@/ui/text/index'

const props = withDefaults(defineProps<{
  defaultOpen?: boolean
  headerCells?: Component[]
  label: string
}>(), {
  defaultOpen: true,
})

const {
  isScrolledFromLeft,
  registerGroup,
  unregisterGroup,
} = useInjectTableContext()

useProvideTableGroupContext({
  isGroup: true,
})

registerGroup()

onBeforeUnmount(() => {
  unregisterGroup()
})
</script>

<template>
  <CollapsibleRoot
    v-slot="{ open: isOpen }"
    :as="TableSubgrid"
    :default-open="props.defaultOpen"
    class="group/collapsible"
  >
    <TableSubgrid
      :style="{
        zIndex: TABLE_Z_INDEX.GROUP,
      }"
      class="
        group/group sticky top-10 flex h-8 items-center
        group-data-[state=open]/collapsible:bg-secondary
        hover:bg-secondary
        has-focus-visible:bg-tertiary
      "
    >
      <CollapsibleTrigger :as-child="true">
        <button
          :class="{
            'border-r border-secondary': isScrolledFromLeft,
          }"
          class="
            sticky left-0 z-1 size-full cursor-pointer bg-primary px-2xl
            outline-none
            group-hover/group:bg-secondary
            group-has-focus-visible/group:bg-tertiary
            group-data-[state=open]/collapsible:bg-secondary
          "
        >
          <UIRowLayout gap="none">
            <div class="w-5">
              <ChevronDownIcon
                :class="{
                  '-rotate-90': !isOpen,
                }"
                class="
                  size-3.5 text-disabled duration-150
                  group-hover/group:text-secondary
                "
              />
            </div>

            <UIText
              :text="props.label"
              class="
                text-xs text-tertiary duration-150
                group-hover/group:text-secondary
              "
            />
          </UIRowLayout>
        </button>
      </CollapsibleTrigger>

      <Component
        :is="cell"
        v-for="(cell, i) in props.headerCells"
        :key="i"
      />
    </TableSubgrid>

    <CollapsibleContent
      :as="TableSubgrid"
      class="
        origin-top-left overflow-clip
        data-[state=closed]:animate-[table-collapsible-up_150ms]
        data-[state=open]:animate-[table-collapsible-down_150ms]
      "
    >
      <slot />
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
