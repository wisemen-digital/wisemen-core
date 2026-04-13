<script setup lang="ts">
import { ListboxFilter as RekaListboxFilter } from 'reka-ui'

import { mergeClassConfigs } from '@/class-variant/customClassVariants'
import { useInjectSelectContext } from '@/components/select/select.context'
import TextFieldIconLeft from '@/components/text-field/parts/TextFieldIconLeft.vue'
import TextFieldInput from '@/components/text-field/parts/TextFieldInput.vue'
import TextFieldRoot from '@/components/text-field/parts/TextFieldRoot.vue'

const {
  hasScrolledInDropdownContent,
  classConfig,
  customClassConfig,
  filter,
  searchInputPlaceholder,
  searchTerm,
} = useInjectSelectContext()
</script>

<template>
  <div
    v-if="filter !== null && filter.isEnabled && !filter.isInline"
    class="relative p-xs pb-0"
  >
    <TextFieldRoot
      v-model="searchTerm"
      :placeholder="searchInputPlaceholder"
      :class-config="mergeClassConfigs(
        {
          root: 'border-none shadow-none outline-none bg-secondary h-8 rounded-sm',
          iconLeft: 'ml-md',
        },
        customClassConfig?.dropdownSearchInput,
        classConfig?.dropdownSearchInput,
      )"
    >
      <TextFieldIconLeft />

      <RekaListboxFilter
        :as-child="true"
      >
        <TextFieldInput />
      </RekaListboxFilter>
    </TextFieldRoot>

    <div
      v-if="hasScrolledInDropdownContent"
      class="
        pointer-events-none absolute bottom-0 z-10 h-4 w-full translate-y-full
        bg-linear-to-b from-primary to-transparent
      "
    />
  </div>
</template>
