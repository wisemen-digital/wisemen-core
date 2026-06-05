<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import TableHeaderCell from '@/ui/table/components/TableHeaderCell.vue'
import TableSubgrid from '@/ui/table/components/TableSubgrid.vue'
import { TABLE_Z_INDEX } from '@/ui/table/const/table.const'
import { useInjectTableContext } from '@/ui/table/context/table.context'

const i18n = useI18n()

const {
  isGroupingEnabled,
  actions,
  headerActions,
} = useInjectTableContext()
</script>

<template>
  <TableSubgrid
    :style="{
      zIndex: TABLE_Z_INDEX.HEADER,
    }"
    :class="{
      'border-b border-secondary': !isGroupingEnabled,
    }"
    class="sticky top-0"
  >
    <slot />

    <!-- We either render the header actions, or a spacer -->
    <TableHeaderCell
      v-if="actions.length > 0 || headerActions.length > 0"
      :column-index="0"
      :is-resizable="false"
      :label="null"
      :action-config="{
        actions: headerActions ?? [],
        label: i18n.t('component.table.settings_label'),
        currentContextOnly: false,
      }"
      column-key=""
      class="sticky right-0 z-1 h-full"
    />
  </TableSubgrid>
</template>
