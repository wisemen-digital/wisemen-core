<script setup lang="ts">
import { ListboxFilter as RekaListboxFilter } from 'reka-ui'
import {
  onMounted,
  ref,
} from 'vue'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectSelectContext } from '@/components/select/select.context'

const {
  id,
  hasInteractedWithInlineSearchInput,
  isDisabled,
  classConfig,
  customClassConfig,
  inlinesearchInputElementRef,
  placeholder,
  searchInputPlaceholder,
  searchTerm,
  setIsDropdownVisible,
  style,
} = useInjectSelectContext()

const listboxFilterRef = ref<InstanceType<typeof RekaListboxFilter>>()

function onInput(): void {
  hasInteractedWithInlineSearchInput.value = true
  openDropdown()
}

function openDropdown(): void {
  setIsDropdownVisible(true)
}

onMounted(() => {
  inlinesearchInputElementRef.value = listboxFilterRef.value?.$el ?? null
})
</script>

<template>
  <RekaListboxFilter
    :id="id"
    ref="listboxFilterRef"
    v-model="searchTerm"
    :disabled="isDisabled"
    :class="style.inlineSearchInput({
      class: mergeClasses(customClassConfig.inlineSearchInput, classConfig?.inlineSearchInput),
    })"
    :placeholder="placeholder ?? searchInputPlaceholder"
    aria-autocomplete="list"
    role="combobox"
    autocomplete="false"
    @input="onInput"
    @keydown.up.down.prevent="openDropdown"
  />
</template>
