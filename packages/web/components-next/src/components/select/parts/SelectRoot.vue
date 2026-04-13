<script setup lang="ts" generic="TValue extends SelectValue">
import type { AcceptableValue } from 'reka-ui'
import {
  ListboxRoot as RekaListboxRoot,
  useFilter,
} from 'reka-ui'
import {
  computed,
  ref,
  useId,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import {
  getCustomComponentVariant,
  mergeClasses,
} from '@/class-variant/customClassVariants'
import { useProvideSelectContext } from '@/components/select/select.context'
import type { SelectEmits } from '@/components/select/select.emits'
import type {
  SelectFilterFn,
  SelectProps,
  SelectValue,
} from '@/components/select/select.props'
import type { CreateSelectStyle } from '@/components/select/style/select.style'
import { createSelectStyle } from '@/components/select/style/select.style'
import FormControl from '@/components/shared/FormControl.vue'
import type InteractableElement from '@/components/shared/InteractableElement.vue'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'
import { injectThemeProviderContext } from '@/components/theme-provider/themeProvider.context'
import { toComputedRefs } from '@/utils/props.util'

const props = withDefaults(defineProps<SelectProps<TValue>>(), {
  id: null,
  testId: null,
  isDisabled: false,
  isDropdownHidden: false,
  isLoading: false,
  isPopoverArrowVisible: false,
  isRequired: false,
  isSearchTermControlled: false,
  isTouched: false,
  classConfig: null,
  clearSearchTermOnSelect: false,
  errorMessage: null,
  filter: null,
  hint: null,
  iconLeft: null,
  iconRight: 'selectIconRight',
  label: null,
  placeholder: null,
  popoverAlign: 'end',
  popoverAlignOffset: 0,
  popoverAnchorReferenceElement: null,
  popoverCollisionPadding: 0,
  popoverContainerElement: null,
  popoverSide: 'bottom',
  popoverSideOffset: 6,
  popoverWidth: null,
  remainOpenOnSelect: null,
  searchInputPlaceholder: null,
  variant: null,
  virtualList: null,
})

const emit = defineEmits<SelectEmits>()

const modelValue = defineModel<TValue>({
  required: true,
})

const searchTerm = defineModel<string>('searchTerm', {
  default: '',
  required: false,
})

const isDropdownVisible = defineModel<boolean>('isOpen', {
  default: false,
  required: false,
})

const {
  theme,
} = injectThemeProviderContext()

const {
  t,
} = useI18n()

const id = props.id ?? useId()

const rootRef = ref<InstanceType<typeof InteractableElement> | null>(null)

const hasScrolledInDropdownContent = ref<boolean>(false)

// We need to track every item in the listbox to determine if it should be displayed or not
const allItems = ref<Map<string, unknown>>(new Map())
const allGroups = ref<Map<string, Set<string>>>(new Map())

const inlinesearchInputElementRef = ref<HTMLInputElement | null>(null)

// A search term is always present when an option is selected
// since we set the search term to the displayFn of the selected option.
// However, when the dropdown is first opened, all options should be displayed, even if a search term is entered.
const hasInteractedWithInlineSearchInput = ref<boolean>(false)

const {
  contains,
} = useFilter()

const selectStyle = computed<CreateSelectStyle>(() => createSelectStyle({
  variant: props.variant ?? undefined,
}))

const customClassConfig = computed<ResolvedClassConfig<'select'>>(
  () => getCustomComponentVariant('select', theme.value, {
    variant: props.variant,
  }),
)

const isMultiple = computed<boolean>(() => Array.isArray(modelValue.value))

const hasSelectRootFocusIn = ref<boolean>(false)

const remainOpenOnSelect = computed<boolean>(() => (
  props.remainOpenOnSelect ?? isMultiple.value
))

const hasInlineSearchInput = computed<boolean>(() => {
  if (props.filter === null) {
    return false
  }

  return (props.filter.isEnabled && props.filter.isInline) ?? false
})

function defaultFilterFn(value: unknown, searchTerm: string): boolean {
  const displayValue = props.displayFn(value as any)

  return contains(displayValue.toLowerCase(), searchTerm.toLowerCase())
}

const filterFn = computed<SelectFilterFn<TValue>>(() => props.filter?.fn ?? defaultFilterFn)

const filteredItems = computed<Map<string, unknown>>(() => {
  if (props.filter === null || !props.filter.isEnabled) {
    return allItems.value
  }

  if (hasInlineSearchInput.value && !hasInteractedWithInlineSearchInput.value) {
    return allItems.value
  }

  return new Map(
    Array.from(allItems.value.entries())
      .filter(([
        _key,
        value,
      ]) => {
        return filterFn.value(value as any, searchTerm.value)
      }),
  )
})

const virtualListFilteredItems = computed<AcceptableValue[]>(() => {
  if (props.virtualList === null || !props.virtualList.isEnabled) {
    return []
  }

  return props.virtualList.items.filter((item) => (
    filterFn.value(item as any, searchTerm.value)
  ))
})

const filteredGroups = computed<Map<string, Set<string>>>(() => {
  return new Map(
    Array.from(allGroups.value.entries())
      .filter(([
        _key,
        value,
      ]) => {
        return Array.from(value).some((itemId) => filteredItems.value.has(itemId))
      }),
  )
})

const searchInputPlaceholder = computed<string>(() => {
  return props.searchInputPlaceholder ?? t('component.select.search_input_placeholder')
})

function setIsDropdownVisible(value: boolean): void {
  isDropdownVisible.value = value
}

function resetSearchTerm(): void {
  if (props.isSearchTermControlled) {
    return
  }

  if (isMultiple.value
    || !hasInlineSearchInput.value
    || modelValue.value === null
    || props.clearSearchTermOnSelect
  ) {
    searchTerm.value = ''

    return
  }

  searchTerm.value = props.displayFn(modelValue.value as any)
}

function focusInlineSearchInputElement(): void {
  if (hasInlineSearchInput.value) {
    setTimeout(() => {
      inlinesearchInputElementRef.value?.focus()
    })
  }
}

function onOpenDropdown(): void {
  focusInlineSearchInputElement()
}

function onCloseDropdown(): void {
  if (!props.isSearchTermControlled) {
    resetSearchTerm()
  }

  hasInteractedWithInlineSearchInput.value = false
}

function onRootFocusIn(): void {
  if (!hasSelectRootFocusIn.value) {
    onFocus()
  }

  hasSelectRootFocusIn.value = true
}

function onRootFocusOut(): void {
  setTimeout(() => {
    const isFocusInsideRoot = rootRef.value?.$el.contains(document.activeElement)

    if (!isFocusInsideRoot && (!isDropdownVisible.value || props.isDropdownHidden)) {
      hasSelectRootFocusIn.value = false

      onBlur()
    }
  })
}

function onDropdownEscapeKeyDown(): void {
  focusInlineSearchInputElement()
}

function onFocus(): void {
  emit('focus')
}

function onBlur(): void {
  emit('blur')
}

function onDropdownInteractOutside(event: CustomEvent): void {
  const eventTargetIsSearchInput = event.target === inlinesearchInputElementRef.value

  if (eventTargetIsSearchInput) {
    event.preventDefault()
  }
  else {
    onBlur()
  }
}

function onSelectItem(): void {
  focusInlineSearchInputElement()

  if (!remainOpenOnSelect.value) {
    setIsDropdownVisible(false)
  }
}

watch(isDropdownVisible, (isDropdownVisible) => {
  if (isDropdownVisible) {
    onOpenDropdown()
  }
  else {
    onCloseDropdown()
  }
})

watch(modelValue, resetSearchTerm, {
  immediate: true,
})

useProvideSelectContext({
  ...toComputedRefs(props),
  id: computed<string>(() => id),
  hasInlineSearchInput,
  hasInteractedWithInlineSearchInput,
  hasScrolledInDropdownContent,
  isDropdownVisible: computed<boolean>(() => isDropdownVisible.value),
  isMultiple,
  allGroups,
  allItems,
  customClassConfig,
  filteredGroups,
  filteredItems,
  inlinesearchInputElementRef,
  modelValue,
  remainOpenOnSelect,
  searchInputPlaceholder,
  searchTerm,
  setIsDropdownVisible,
  style: selectStyle,
  virtualListFilteredItems,
  onDropdownEscapeKeyDown,
  onDropdownInteractOutside,
  onSelectItem,
})
</script>

<template>
  <TestIdProvider :test-id="props.testId">
    <FormControl
      :id="null"
      ref="rootRef"
      :is-disabled="props.isDisabled"
      :is-invalid="props.errorMessage !== null"
      :is-loading="props.isLoading"
      :is-required="props.isRequired"
      :described-by="`${id}-error ${id}-hint`"
      :data-invalid="(props.errorMessage !== null && props.isTouched) || undefined"
      :data-icon-left="iconLeft !== null || undefined"
      :data-icon-right="iconRight !== null || undefined"
      :data-disabled="props.isDisabled || undefined"
      @focusin="onRootFocusIn"
      @focusout="onRootFocusOut"
      @entry-focus.prevent
    >
      <RekaListboxRoot
        v-model="modelValue"
        :selection-behavior="isMultiple ? 'toggle' : 'replace'"
        :multiple="isMultiple"
        :class="selectStyle.root({
          class: mergeClasses(customClassConfig.root, props.classConfig?.root),
        })"
      >
        <slot />
      </RekaListboxRoot>
    </FormControl>
  </TestIdProvider>
</template>
