<script setup lang="ts">
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
} from '@wisemen/vue-core-icons'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { RegisteredRouteLocationRaw } from '@/register'
import Link from '@/ui/button/link/Link.vue'
import BaseCheckbox from '@/ui/checkbox/base/BaseCheckbox.vue'
import DataTableCellRenderer from '@/ui/data-table/components/DataTableCellRenderer.vue'
import type { DataTableCell } from '@/ui/data-table/types/dataTableCell.type'
import { UIDetailListGroupItem } from '@/ui/detail-list'
import DetailListGroupItemLabel from '@/ui/detail-list/DetailListGroupItemLabel.vue'

export interface DataTableMobileCardCell {
  cell: DataTableCell
  headerLabel: string
  key: string
}

const props = withDefaults(defineProps<{
  isExpanded: boolean
  isSelectable?: boolean
  isSelected?: boolean
  hiddenCells: DataTableMobileCardCell[]
  indicatorCell: DataTableCell | null
  link?: RegisteredRouteLocationRaw | null
  metaCell: DataTableCell | null
  primaryCell: DataTableCell | null
  secondaryCell: DataTableCell | null
}>(), {
  isSelectable: false,
  isSelected: false,
  link: null,
})

const emit = defineEmits<{
  toggleExpanded: []
  toggleSelected: []
}>()

const i18n = useI18n()

const hasTrailingContent = computed<boolean>(() => props.metaCell !== null || props.indicatorCell !== null)
</script>

<template>
  <div class="border-b border-secondary">
    <div
      class="flex items-start gap-md px-xl py-lg"
      role="row"
    >
      <BaseCheckbox
        v-if="props.isSelectable"
        :model-value="props.isSelected"
        :is-label-hidden="true"
        :label="i18n.t('component.table.row.toggle_selection_action.name')"
        class="mt-xxs"
        @update:model-value="emit('toggleSelected')"
      />

      <button
        class="flex flex-1 items-start gap-md text-left outline-none"
        type="button"
        @click="emit('toggleExpanded')"
      >
        <div class="min-w-0 flex-1">
          <div
            v-if="props.primaryCell !== null"
            class="truncate text-sm font-semibold text-primary"
          >
            <DataTableCellRenderer :cell="props.primaryCell" />
          </div>

          <div
            v-if="props.secondaryCell !== null"
            class="mt-xxs truncate text-xs text-tertiary"
          >
            <DataTableCellRenderer :cell="props.secondaryCell" />
          </div>
        </div>

        <div
          v-if="hasTrailingContent"
          class="flex shrink-0 flex-col items-end gap-xxs"
        >
          <DataTableCellRenderer
            v-if="props.metaCell !== null"
            :cell="props.metaCell"
            class="text-xs text-tertiary tabular-nums"
          />

          <DataTableCellRenderer
            v-if="props.indicatorCell !== null"
            :cell="props.indicatorCell"
          />
        </div>

        <ChevronDownIcon
          :class="{
            '-rotate-90': !props.isExpanded,
          }"
          class="mt-xxs size-3.5 shrink-0 text-disabled duration-150"
        />
      </button>
    </div>

    <div
      v-if="props.isExpanded"
      class="flex flex-col gap-lg px-xl pb-lg pl-11"
    >
      <UIDetailListGroupItem
        v-for="hiddenCell of props.hiddenCells"
        :key="hiddenCell.key"
      >
        <DetailListGroupItemLabel :label="hiddenCell.headerLabel" />

        <DataTableCellRenderer
          :cell="hiddenCell.cell"
          class="text-xs text-primary"
        />
      </UIDetailListGroupItem>

      <Link
        v-if="props.link !== null"
        :to="props.link"
        :icon-right="ArrowUpRightIcon"
        :label="i18n.t('component.table.row.view_details_label')"
        size="sm"
        variant="secondary"
      />
    </div>
  </div>
</template>
