<script setup lang="ts">
import type { Action } from '@wisemen/vue-core-actions'
import {
  ArrowNarrowDownIcon,
  ArrowNarrowUpIcon,
  DotsVerticalIcon,
  SwitchVertical01Icon,
} from '@wisemen/vue-core-icons'
import {
  AnimatePresence,
  Motion,
} from 'motion-v'
import type { Component } from 'vue'
import {
  computed,
  useId,
  useTemplateRef,
} from 'vue'
import { useI18n } from 'vue-i18n'

import type { SortDirection } from '@/composables/sort.composable'
import type { RegisteredActionContext } from '@/register'
import { UIActionDropdownMenu } from '@/ui/action-dropdown-menu/index'
import { UIIconButton } from '@/ui/button'
import { UIClickableElement } from '@/ui/clickable-element'
import { UIRowLayout } from '@/ui/row-layout/index'
import { useInjectTableContext } from '@/ui/table/context/table.context'
import { UIText } from '@/ui/text/index'
import {
  UITooltip,
  UITooltipContent,
  UITooltipText,
} from '@/ui/tooltip/index'

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
  columnKey: string
  description?: string | null
  label: string | null
}>(), {
  isResizable: true,
  actionConfig: null,
  centerContent: false,
  description: null,
})

const i18n = useI18n()

const {
  isColumnResizeDisabled,
  isGroupingEnabled,
  isResizingColumn,
  isScrolledFromLeft,
  isSelectable,
  sort,
  onColumnResizeFitToContent,
  onColumnResizeStart,
} = useInjectTableContext()

const cellEl = useTemplateRef<HTMLElement>('cellEl')
const descriptionId = useId()

const isSortable = computed<boolean>(() => sort !== null && sort.existsSort(props.columnKey))

const sortDirection = computed<SortDirection | null>(() => {
  if (!isSortable.value) {
    return null
  }

  const value = sort?.getSort(props.columnKey) ?? null

  if (value === null) {
    return null
  }

  return value.direction
})

const sortIcon = computed<Component | null>(() => {
  if (!isSortable.value) {
    return null
  }

  switch (sortDirection.value) {
    case 'asc':
      return ArrowNarrowUpIcon
    case 'desc':
      return ArrowNarrowDownIcon
    default:
      return SwitchVertical01Icon
  }
})
</script>

<template>
  <UITooltip
    :is-disabled="props.description === null"
    :popover-side-offset="4"
    popover-side="bottom"
  >
    <template #trigger>
      <div
        ref="cellEl"
        :aria-describedby="props.description !== null ? descriptionId : undefined"
        :class="{
          'first-of-type:border-r first-of-type:border-secondary': isScrolledFromLeft,
          'justify-center': props.centerContent,
          'bg-secondary': !isGroupingEnabled,
          'first-of-type:left-10': isSelectable,
          'first-of-type:left-0': !isSelectable,
        }"
        class="
          group relative flex h-10 items-center overflow-hidden bg-primary px-xl
          first-of-type:sticky first-of-type:z-2 first-of-type:pl-2xl
          last-of-type:pr-2xl
        "
      >
        <span
          v-if="props.description !== null"
          :id="descriptionId"
          class="sr-only"
        >
          {{ props.description }}
        </span>

        <UIRowLayout gap="xs">
          <UIClickableElement v-if="props.label !== null">
            <button
              :disabled="!isSortable"
              type="button"
              class="
                -ml-sm flex items-center gap-xs rounded-sm px-sm py-xxs
                duration-100
                not-disabled:hover:bg-secondary-hover
                disabled:cursor-default!
              "
              @click="sort?.toggleSort(props.columnKey)"
            >
              <UIText
                :text="props.label"
                class="text-xs font-medium text-primary"
              />

              <AnimatePresence mode="popLayout">
                <Motion
                  :key="sortDirection ?? 'none'"
                  :initial="{
                    opacity: 0,
                    filter: 'blur(2px)',
                    scale: 0.5,
                  }"
                  :animate="{
                    opacity: 1,
                    filter: 'blur(0px)',
                    scale: 1,
                  }"
                  :exit="{
                    opacity: 0,
                    filter: 'blur(2px)',
                    scale: 0.5,
                  }"
                  :transition="{
                    duration: 0.15,
                    type: 'spring',
                    bounce: 0,
                  }"
                >
                  <Component
                    :is="sortIcon"
                    v-if="sortIcon !== null"
                    :class="[
                      sortDirection !== null ? `text-primary` : `text-disabled`,
                    ]"
                    class="size-3 duration-150"
                  />
                </Motion>
              </AnimatePresence>
            </button>
          </UIClickableElement>

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

    <template #content>
      <UITooltipContent>
        <UITooltipText :text="props.description!" />
      </UITooltipContent>
    </template>
  </UITooltip>
</template>
