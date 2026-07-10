<script setup lang="ts" generic="TValue extends SelectValue | SelectValue[]">
import { useBreakpoints } from '@vueuse/core'
import {
  computed,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'

import {
  AUTOCOMPLETE_INPUT_DEFAULTS,
  INPUT_DEFAULTS,
  INPUT_FIELD_DEFAULTS,
  INPUT_META_DEFAULTS,
  omit,
} from '@/types/input.type'
import type { PopoverProps } from '@/ui/popover/popover.props'
import Popover from '@/ui/popover/Popover.vue'
import type { ResponsiveDrawerProps } from '@/ui/responsive-drawer/responsiveDrawer.props'
import ResponsiveDrawer from '@/ui/responsive-drawer/ResponsiveDrawer.vue'
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

const i18n = useI18n()

const screen = useBreakpoints({
  md: 768,
})
const isMobileDrawer = screen.smaller('md')

type SelectPopoverProps = Pick<
  PopoverProps,
  | 'isPopoverArrowVisible'
  | 'isPrioritizedPosition'
  | 'isSideFlipDisabled'
  | 'isUpdateOnLayoutShiftDisabled'
  | 'popoverAlign'
  | 'popoverAlignOffset'
  | 'popoverAnchorReferenceElement'
  | 'popoverAnimationName'
  | 'popoverCollisionPadding'
  | 'popoverContainerElement'
  | 'popoverSide'
  | 'popoverSideOffset'
  | 'popoverWidth'
>

const popoverProps = computed<SelectPopoverProps>(() => ({
  isPopoverArrowVisible: props.isPopoverArrowVisible,
  isPrioritizedPosition: props.isPrioritizedPosition,
  isSideFlipDisabled: props.isSideFlipDisabled,
  isUpdateOnLayoutShiftDisabled: props.isUpdateOnLayoutShiftDisabled,
  popoverAlign: props.popoverAlign,
  popoverAlignOffset: props.popoverAlignOffset,
  popoverAnchorReferenceElement: props.popoverAnchorReferenceElement,
  popoverAnimationName: props.popoverAnimationName,
  popoverCollisionPadding: props.popoverCollisionPadding,
  popoverContainerElement: props.popoverContainerElement,
  popoverSide: props.popoverSide,
  popoverSideOffset: 4,
  popoverWidth: props.popoverWidth,
}))

const drawerProps = computed<ResponsiveDrawerProps>(() => ({
  title: i18n.t('component.select.dropdown_title'),
}))

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
  <component
    :is="isMobileDrawer ? ResponsiveDrawer : Popover"
    v-model:is-open="isDropdownVisible"
    v-bind="isMobileDrawer ? drawerProps : popoverProps"
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
  </component>
</template>
