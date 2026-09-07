<script setup lang="ts">
import { ChevronDownIcon } from '@wisemen/vue-core-icons'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import BaseCheckbox from '@/ui/checkbox/base/BaseCheckbox.vue'
import { useInjectDataTableContext } from '@/ui/data-table/context/dataTable.context'

const props = withDefaults(defineProps<{
  isExpanded: boolean
  isLast?: boolean
  isSelectable?: boolean
  isSelected?: boolean
  isSelectedIndeterminate?: boolean
  depth?: number
  label: string
}>(), {
  isLast: false,
  isSelectable: false,
  isSelected: false,
  isSelectedIndeterminate: false,
  depth: 0,
})

const emit = defineEmits<{
  toggle: []
  toggleSelected: []
}>()

const i18n = useI18n()

const {
  variant,
} = useInjectDataTableContext()

const indentStyle = computed<Record<string, string>>(() => ({
  paddingLeft: `${1 + props.depth}rem`,
}))

// `full-page` has no container border to close off the table's bottom edge, so its last row
// keeps its own bottom border — `contained`'s container border already does that job.
const hasBottomBorder = computed<boolean>(() => !props.isLast || variant.value === 'full-page')
</script>

<template>
  <!--
    Not a grid/subgrid: `DataTableGroupRow` is always rendered inside an ancestor that's already
    `col-span-full` (see `DataTable.vue`'s group-header wrapper), so this root doesn't need its own
    subgrid to span the full row width — it renders exactly one child, never multiple column-track
    items. Kept as a plain block deliberately: `position: sticky` only has a visible effect on a
    box narrower than its scrolling container, and a `col-span-full grid-cols-subgrid` box is
    already exactly as wide as the scrollable content — nothing for `left: 0` to "stick" against.
    Mirrors `ui/table/components/TableBodyGroup.vue`'s working equivalent (a plain `flex` row, not
    a grid item), rather than fighting sticky-inside-subgrid mechanics.
  -->
  <div
    :class="{
      'bg-secondary': props.depth === 0,
      'bg-tertiary': props.depth > 0,
      'border-b border-secondary': hasBottomBorder,
    }"
    class="col-span-full flex h-10 items-center"
    role="row"
  >
    <div
      :style="indentStyle"
      class="sticky left-0 flex w-max max-w-full items-center gap-xs pr-xl"
    >
      <BaseCheckbox
        v-if="props.isSelectable"
        :model-value="props.isSelected"
        :is-indeterminate="props.isSelectedIndeterminate"
        :is-label-hidden="true"
        :label="i18n.t('component.table.group.toggle_selection_label')"
        @update:model-value="emit('toggleSelected')"
      />

      <button
        class="
          flex items-center gap-xs text-left outline-none
          focus-visible:bg-tertiary
        "
        type="button"
        @click="emit('toggle')"
      >
        <ChevronDownIcon
          :class="{
            '-rotate-90': !props.isExpanded,
          }"
          class="size-3.5 shrink-0 text-disabled"
        />

        <span
          v-if="props.label !== ''"
          class="truncate text-xs font-medium text-secondary"
        >
          {{ props.label }}
        </span>

        <slot />
      </button>
    </div>
  </div>
</template>
