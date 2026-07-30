<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import BaseCheckbox from '@/ui/checkbox/base/BaseCheckbox.vue'
import DataTableCell from '@/ui/data-table/components/DataTableCell.vue'

const props = defineProps<{
  isChecked: boolean
  isIndeterminate?: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const i18n = useI18n()
</script>

<template>
  <DataTableCell
    :is-first-column="true"
    :is-last-column="false"
  >
    <BaseCheckbox
      :model-value="props.isChecked"
      :is-indeterminate="props.isIndeterminate ?? false"
      :is-label-hidden="true"
      :label="i18n.t('component.table.row.toggle_selection_action.name')"
      @update:model-value="emit('toggle')"
    />
  </DataTableCell>
</template>
