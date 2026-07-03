<script setup lang="ts">
import { ChevronDownIcon } from '@wisemen/vue-core-icons'
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from 'reka-ui'
import type { Component } from 'vue'
import { onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

import BaseCheckbox from '@/ui/checkbox/base/BaseCheckbox.vue'
import { UIRowLayout } from '@/ui/row-layout/index'
import TableSubgrid from '@/ui/table/components/TableSubgrid.vue'
import { TABLE_Z_INDEX } from '@/ui/table/const/table.const'
import { useInjectTableContext } from '@/ui/table/context/table.context'
import { useProvideTableGroupContext } from '@/ui/table/context/tableGroup.context'
import { useInjectTableSelectionContext } from '@/ui/table/context/tableSelection.context'
import { UIText } from '@/ui/text/index'

const props = withDefaults(defineProps<{
  defaultOpen?: boolean
  headerCells?: Component[]
  items?: unknown[]
  label: string
}>(), {
  defaultOpen: true,
  items: () => [],
})

const {
  isScrolledFromLeft,
  isSelectable,
  registerGroup,
  unregisterGroup,
} = useInjectTableContext()

const {
  isGroupAllSelected,
  isGroupIndeterminate,
  toggleGroup,
} = useInjectTableSelectionContext()

const i18n = useI18n()

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
      <div
        class="
          sticky z-1 flex items-center gap-xs bg-primary px-2xl
          group-hover/group:bg-secondary
          group-has-focus-visible/group:bg-tertiary
          group-data-[state=open]/collapsible:bg-secondary
        "
      >
        <BaseCheckbox
          v-if="isSelectable"
          :model-value="isGroupAllSelected(props.items) || isGroupIndeterminate(props.items)"
          :is-indeterminate="isGroupIndeterminate(props.items) && !isGroupAllSelected(props.items)"
          :is-label-hidden="true"
          :label="i18n.t('component.table.group.toggle_selection_label')"
          class="mr-sm"
          @update:model-value="() => toggleGroup(props.items)"
        />

        <CollapsibleTrigger :as-child="true">
          <button
            :class="{
              'border-r border-secondary': isScrolledFromLeft,
              'left-0': !isSelectable,
              'left-10': isSelectable,
            }"
            class="h-full flex-1 outline-none"
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
      </div>

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
