<script setup lang="ts">
import { DotsVerticalIcon } from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

import type { RegisteredActionContext } from '@/register'
import { UIActionDropdownMenu } from '@/ui/action-dropdown-menu/index'
import { UIIconButton } from '@/ui/button'
import TableBodyRowCell from '@/ui/table/components/TableBodyRowCell.vue'
import { useInjectTableContext } from '@/ui/table/context/table.context'

const props = defineProps<{
  actionModel: RegisteredActionContext['models'][number] | null
}>()

const i18n = useI18n()

const {
  actions,
} = useInjectTableContext()
</script>

<template>
  <TableBodyRowCell
    class="sticky right-0 z-1 flex items-center justify-end"
    data-row-actions
  >
    <UIActionDropdownMenu
      :actions="actions"
      :models="props.actionModel === null ? [] : [props.actionModel]"
      :current-context-only="true"
      popover-side="bottom"
      popover-align="end"
    >
      <UIIconButton
        :is-tooltip-disabled="true"
        :icon="DotsVerticalIcon"
        :label="i18n.t('component.table.actions_cell.label')"
        size="sm"
        variant="tertiary"
        class="
          pointer-events-auto opacity-0
          group-hover/row:opacity-100
          group-has-focus-visible/row:opacity-100
          group-has-[[data-row-actions]_[data-state=open]]/row:opacity-100
          pointer-coarse:opacity-100
        "
      />
    </UIActionDropdownMenu>
  </TableBodyRowCell>
</template>
