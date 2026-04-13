<script setup lang="ts" generic="TValue extends AcceptableValue">
import { useDebounceFn } from '@vueuse/core'
import type { AcceptableValue } from 'reka-ui'
import {
  computed,
  ref,
  watch,
} from 'vue'

import type { AutocompleteProps } from '@/components/autocomplete/autocomplete.props'
import SelectItem from '@/components/select/parts/SelectItem.vue'
import Select from '@/components/select/Select.vue'
import type { Icon } from '@/icons/icons'

const props = withDefaults(defineProps<AutocompleteProps<TValue>>(), {
  isSearchTermOptional: false,
  debounceTimeoutInMs: 300,
  iconRight: null,
})

const emit = defineEmits<{
  search: [searchTerm: string]
}>()

const modelValue = defineModel<TValue>({
  required: true,
})

const searchTerm = ref<string>(modelValue.value ? props.displayFn(modelValue.value as any) : '')
const isDebouncing = ref<boolean>(false)
const delegatedItems = ref<TValue[]>(props.items)

const isSearchTermEmpty = computed<boolean>(() => searchTerm.value.trim().length === 0)

const isSearchTermTheSameAsCurrentValue = computed<boolean>(() => {
  if (modelValue.value === null) {
    return false
  }

  return searchTerm.value === props.displayFn(modelValue.value as any)
})

const isDropdownVisible = computed<boolean>(() => {
  if (delegatedItems.value.length === 0 && isSearchTermEmpty.value) {
    return false
  }

  if (isSearchTermTheSameAsCurrentValue.value && delegatedItems.value.length === 0) {
    return false
  }

  // Don't show dropdown if there are no items and loading is enabled
  if ((props.isLoading || isDebouncing.value) && delegatedItems.value.length === 0) {
    return false
  }

  // If there is only 1 item, and that item is already selected, don't show the dropdown
  if (delegatedItems.value.length === 1) {
    const isOnlyItemSelected = JSON.stringify(delegatedItems.value[0]) === JSON.stringify(modelValue.value)
    const doesSearchTermMatchOnlyItem
      = delegatedItems.value[0] !== null
        && searchTerm.value === props.displayFn(delegatedItems.value[0] as any)

    if (isOnlyItemSelected && !doesSearchTermMatchOnlyItem) {
      return false
    }
  }

  return true
})

const iconRight = computed<Icon | null>(() => {
  if (props.iconRight !== null) {
    return props.iconRight
  }

  if (props.isSearchTermOptional) {
    return 'selectIconRight'
  }

  return null
})

const debounceSearch = useDebounceFn((searchTerm: string | null) => {
  isDebouncing.value = false

  if (searchTerm === null) {
    return
  }

  emit('search', searchTerm)
}, props.debounceTimeoutInMs)

function onUpdateIsOpen(isOpen: boolean): void {
  // If the user can open the dropdown manually, we don't clear the items since they
  // might want to see them again without searching
  if (!isOpen && !props.isSearchTermOptional) {
    delegatedItems.value = []
  }
}

watch(searchTerm, (searchTerm) => {
  if (isSearchTermEmpty.value) {
    delegatedItems.value = []
  }

  if (isSearchTermTheSameAsCurrentValue.value) {
    return
  }

  if (!isSearchTermEmpty.value) {
    isDebouncing.value = true

    debounceSearch(searchTerm)
  }
  else {
    isDebouncing.value = false
    // We need to make sure the debounce is "cancelled" by providing a `null` value
    // And intercept the `null` value in the debounce function
    debounceSearch(null)
  }
})

watch(() => props.items, (newItems) => {
  delegatedItems.value = newItems
})

function onUpdateModelValue(value: TValue | null): void {
  if (value !== null) {
    searchTerm.value = props.displayFn(value as any)
  }
}
</script>

<template>
  <Select
    v-bind="props"
    v-model:search-term="searchTerm"
    v-model="modelValue"
    :filter="{
      isEnabled: true,
      isInline: true,
      fn: () => true,
    }"
    :icon-right="iconRight"
    :is-dropdown-hidden="!isDropdownVisible"
    :is-loading="props.isLoading || isDebouncing"
    :is-search-term-controlled="true"
    @update:is-open="onUpdateIsOpen"
    @update:model-value="onUpdateModelValue"
  >
    <template #base>
      <slot name="base" />
    </template>

    <template #left>
      <slot name="left" />
    </template>

    <template #right>
      <slot name="right" />
    </template>

    <template #loader>
      <slot name="loader" />
    </template>

    <slot
      :items="delegatedItems"
      name="items"
    >
      <template
        v-for="(item, itemIndex) of delegatedItems"
        :key="itemIndex"
      >
        <slot
          :value="(item as NonNullable<TValue>)"
          name="item"
        >
          <SelectItem :value="item">
            {{ props.displayFn(item as any) }}
          </SelectItem>
        </slot>
      </template>
    </slot>
  </Select>
</template>
