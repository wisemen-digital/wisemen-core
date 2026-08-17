<script setup lang="ts">
import { ChevronDownIcon } from '@wisemen/vue-core-icons'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import BaseCheckbox from '@/ui/checkbox/base/BaseCheckbox.vue'

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

const indentStyle = computed<Record<string, string>>(() => ({
  paddingLeft: `${1 + props.depth}rem`,
}))
</script>

<template>
  <div
    :class="{
      'bg-secondary': props.depth === 0,
      'bg-tertiary': props.depth > 0,
      'border-b border-secondary': !props.isLast,
    }"
    class="col-span-full grid grid-cols-subgrid"
    role="row"
  >
    <div
      :style="indentStyle"
      class="col-span-full flex h-10 items-center gap-xs pr-xl"
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
          flex flex-1 items-center gap-xs text-left outline-none
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
