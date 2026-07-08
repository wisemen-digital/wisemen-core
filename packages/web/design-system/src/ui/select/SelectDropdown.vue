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
  omit,
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
  ...omit(INPUT_FIELD_DEFAULTS, 'iconRight'),
  ...AUTOCOMPLETE_INPUT_DEFAULTS,
  isDropdownKeptOpenOnSelect: null,
  isPrioritizedPosition: true,
  isSideFlipDisabled: true,
  disableSideFlip: true,
  getItemKey: null,
  keepDropdownOpenOnSelect: null,
  limit: null,
  popoverAlign: 'center',
  popoverCollisionPadding: 8,
  popoverSide: 'bottom',
  popoverSideOffset: 4,
  popoverWidth: 'anchor-width',
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

const isDropdownKeptOpenOnSelect = computed<boolean | null>(
  () => props.isDropdownKeptOpenOnSelect ?? props.keepDropdownOpenOnSelect ?? null,
)

function onSelectOption(): void {
  if (isDropdownKeptOpenOnSelect.value === true) {
    return
  }

  if (isDropdownKeptOpenOnSelect.value === false) {
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
    :is-update-on-layout-shift-disabled="props.isUpdateOnLayoutShiftDisabled"
    :is-prioritized-position="props.isPrioritizedPosition"
    :is-side-flip-disabled="props.isSideFlipDisabled"
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
        :get-item-key="props.getItemKey"
        :items="props.items"
        :limit="props.limit"
        :has-virtual-scroll="props.hasVirtualScroll"
        :content-width-class="props.contentWidthClass"
        @next-page="emit('nextPage')"
        @update:search="emit('update:search', $event)"
      />
    </template>
  </Popover>
</template>
