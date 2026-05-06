<script setup lang="ts" generic="TValue extends SelectValue | SelectValue[]">
import {
  computed,
  watch,
} from 'vue'

import {
  AUTOCOMPLETE_INPUT_DEFAULTS,
  INPUT_DEFAULTS,
  INPUT_FIELD_DEFAULTS,
  INPUT_META_DEFAULTS,
} from '@/types/input.type'
import Popover from '@/ui/popover/Popover.vue'
import { useSelectDropdown } from '@/ui/select/composables/selectDropdown.composable'
import { useSelectValue } from '@/ui/select/composables/selectValue.composable'
import type { SelectProps } from '@/ui/select/select.props'
import type { SelectValue } from '@/ui/select/select.type'
import SelectContent from '@/ui/select/SelectContent.vue'

import { useProvideSelectContext } from './select.context'

const props = withDefaults(defineProps<SelectProps<TValue>>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  ...INPUT_FIELD_DEFAULTS,
  ...AUTOCOMPLETE_INPUT_DEFAULTS,
  disableSideFlip: true,
  keepDropdownOpenOnSelect: null,
  limit: null,
  popoverAlign: 'center',
  popoverCollisionPadding: 8,
  popoverSide: 'bottom',
  popoverSideOffset: 4,
  popoverWidth: 'anchor-width',
  prioritizePosition: true,
  search: null,
  size: 'md',
})

const emit = defineEmits<{
  'blur': []
  'nextPage': []
  'update:search': [searchTerm: string]
}>()

const modelValue = defineModel<TValue>({
  required: true,
})

const {
  isMultiple,
} = useSelectValue<TValue>(modelValue, props.displayFn)

const {
  isDropdownVisible, onTriggerKeyDown,
} = useSelectDropdown()

function onSelectOption(): void {
  if (props.keepDropdownOpenOnSelect === true) {
    return
  }

  if (props.keepDropdownOpenOnSelect === false) {
    isDropdownVisible.value = false

    return
  }

  if (!isMultiple(modelValue.value)) {
    isDropdownVisible.value = false
  }
}

function onCloseDropdown(): void {
  emit('blur')
}

function onUpdateIsOpen(isOpen: boolean): void {
  if (!isOpen) {
    onCloseDropdown()
  }
}

watch(isDropdownVisible, onUpdateIsOpen)

useProvideSelectContext({
  getItemConfig: props.getItemConfig ?? null,
  size: computed<SelectProps<any>['size']>(() => props.size),
  onSelectOption,
})
</script>

<template>
  <Popover
    v-model:is-open="isDropdownVisible"
    :popover-side-offset="4"
    :popover-animation-name="props.popoverAnimationName"
    :popover-align="props.popoverAlign"
    :popover-align-offset="props.popoverAlignOffset"
    :popover-anchor-reference-element="props.popoverAnchorReferenceElement"
    :popover-collision-padding="props.popoverCollisionPadding"
    :popover-container-element="props.popoverContainerElement"
    :popover-side="props.popoverSide"
    :popover-width="props.popoverWidth"
    :is-popover-arrow-visible="props.isPopoverArrowVisible"
    :disable-update-on-layout-shift="props.disableUpdateOnLayoutShift"
    :prioritize-position="props.prioritizePosition"
    :disable-side-flip="props.disableSideFlip"
    @keydown="onTriggerKeyDown"
  >
    <template #trigger>
      <slot
        :is-open="isDropdownVisible"
        name="trigger"
      />
    </template>

    <template #content>
      <SelectContent
        v-bind="$attrs"
        v-model="(modelValue as any)"
        :is-loading="props.isLoading"
        :search="props.search"
        :display-fn="props.displayFn"
        :items="props.items"
        :limit="props.limit"
        @next-page="emit('nextPage')"
        @update:search="emit('update:search', $event)"
      />
    </template>
  </Popover>
</template>
