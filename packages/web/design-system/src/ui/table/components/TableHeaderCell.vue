<script setup lang="ts">
import type { Action } from '@wisemen/vue-core-actions'
import { DotsVerticalIcon } from '@wisemen/vue-core-icons'
import { useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

import type { RegisteredActionContext } from '@/register'
import { UIActionDropdownMenu } from '@/ui/action-dropdown-menu/index'
import { UIIconButton } from '@/ui/button'
import { UIRowLayout } from '@/ui/row-layout/index'
import { useInjectTableContext } from '@/ui/table/context/table.context'
import { UIText } from '@/ui/text/index'

const props = withDefaults(defineProps<{
  isResizable?: boolean
  actionConfig?: {
    actions: Action[]
    currentContextOnly?: boolean
    label?: string | null
    metadata?: RegisteredActionContext['metadata']
  } | null
  centerContent?: boolean
  columnIndex: number
  label: string | null
}>(), {
  isResizable: true,
  actionConfig: null,
  centerContent: false,
})

const i18n = useI18n()

const {
  isColumnResizeDisabled,
  isGroupingEnabled,
  isResizingColumn,
  isScrolledFromLeft,
  onColumnResizeFitToContent,
  onColumnResizeStart,
} = useInjectTableContext()

const cellEl = useTemplateRef<HTMLElement>('cellEl')
</script>

<template>
  <div
    ref="cellEl"
    :class="{
      'first-of-type:border-r first-of-type:border-secondary': isScrolledFromLeft,
      'justify-center': props.centerContent,
      'bg-secondary': !isGroupingEnabled,
    }"
    class="
      group relative flex h-10 items-center overflow-hidden bg-primary px-xl
      first-of-type:sticky first-of-type:left-0 first-of-type:z-2
      first-of-type:pl-2xl
      last-of-type:pr-2xl
    "
  >
    <UIRowLayout gap="xs">
      <UIText
        v-if="props.label !== null"
        :text="props.label"
        class="text-xs font-medium text-primary"
      />

      <UIActionDropdownMenu
        :actions="props.actionConfig?.actions ?? []"
        :metadata="props.actionConfig?.metadata"
        :current-context-only="props.actionConfig?.currentContextOnly ?? true"
        popover-side="bottom"
        popover-align="end"
      >
        <UIIconButton
          :icon="DotsVerticalIcon"
          :is-tooltip-disabled="props.actionConfig?.label === undefined"
          :label="props.actionConfig?.label ?? i18n.t('component.table.header_cell.options_label')"
          size="sm"
          variant="tertiary"
        />
      </UIActionDropdownMenu>
    </UIRowLayout>

    <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
    <div
      v-if="props.isResizable && !isColumnResizeDisabled"
      class="
        group/handle absolute top-0 right-0 z-10 flex h-full w-4
        cursor-col-resize items-center justify-center select-none
      "
      @mousedown.prevent="onColumnResizeStart(props.columnIndex, $event.clientX, cellEl!)"
      @dblclick.prevent="onColumnResizeFitToContent(props.columnIndex, cellEl!)"
    >
      <div
        :class="{
          'scale-92': isResizingColumn,
        }"
        class="
          h-5 w-1 rounded-full bg-fg-disabled opacity-0 duration-150
          group-hover/handle:opacity-100
        "
      />
    </div>
  </div>
</template>
