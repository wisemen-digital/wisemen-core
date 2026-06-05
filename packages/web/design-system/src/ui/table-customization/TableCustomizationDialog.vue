<script setup lang="ts">
import { DotsGridIcon } from '@wisemen/vue-core-icons'
import {
  computed,
  ref,
} from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useI18n } from 'vue-i18n'

import { UICheckbox } from '@/ui/checkbox/index'
import {
  UIDialog,
  UIDialogBody,
  UIDialogFooter,
  UIDialogFooterPrimary,
  UIDialogHeader,
} from '@/ui/dialog/index'
import type { TableColumnState } from '@/ui/table-customization/tableCustomization.composable'
import { UIText } from '@/ui/text/index'

const props = defineProps<{
  columnStates: TableColumnState[]
}>()

const emit = defineEmits<{
  close: []
  columnStatesChange: [states: TableColumnState[]]
}>()

const i18n = useI18n()
const localStates = ref<TableColumnState[]>(props.columnStates)

const visibleCount = computed<number>(() => localStates.value.filter((s) => s.isVisible).length)

function onToggle(state: TableColumnState): void {
  state.isVisible = !state.isVisible
  emit('columnStatesChange', localStates.value)
}

function onDragEnd(): void {
  emit('columnStatesChange', localStates.value)
}

function onClose(): void {
  emit('close')
}
</script>

<template>
  <UIDialog size="xs">
    <UIDialogHeader
      :title="i18n.t('component.table_customization.dialog.title')"
      :description="i18n.t('component.table_customization.dialog.description')"
    />

    <UIDialogBody>
      <VueDraggable
        v-model="localStates"
        :animation="150"
        handle="[data-drag-handle]"
        class="flex flex-col gap-y-md"
        @end="onDragEnd"
      >
        <div
          v-for="state in localStates"
          :key="state.column.key"
          class="flex cursor-default items-center gap-x-md py-xs"
        >
          <DotsGridIcon
            class="
              size-4 shrink-0 cursor-grab text-fg-disabled duration-150
              active:scale-90
            "
            data-drag-handle
          />

          <UIText
            :text="state.column.headerLabel"
            :class="{
              'text-secondary': state.isVisible,
              'text-fg-disabled': !state.isVisible,
            }"
            class="text-xs font-medium duration-150"
          />

          <UICheckbox
            :model-value="state.isVisible"
            :is-disabled="state.isVisible && visibleCount === 1"
            :label="state.column.headerLabel"
            :is-label-hidden="true"
            class="ml-auto"
            @update:model-value="onToggle(state)"
          />
        </div>
      </VueDraggable>
    </UIDialogBody>

    <UIDialogFooter>
      <UIDialogFooterPrimary
        :label="i18n.t('component.table_customization.dialog.done')"
        @click="onClose"
      />
    </UIDialogFooter>
  </UIDialog>
</template>
