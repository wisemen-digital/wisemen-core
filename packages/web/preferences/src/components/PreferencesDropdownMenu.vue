<script setup lang="ts" generic="TValue extends string">
import {
  UIClickableElement,
  UIDropdownMenu,
  UIDropdownMenuGroup,
  UIDropdownMenuRadioGroup,
  UIDropdownMenuRadioItem,
  UIText,
} from '@wisemen/vue-core-design-system'
import { ChevronDownIcon } from '@wisemen/vue-core-icons'
import { computed } from 'vue'

import type { PreferencesDropdownMenuOption } from '#types/preferencesDropdownMenuOption.type'

const props = defineProps<{
  options: PreferencesDropdownMenuOption<TValue>[]
}>()

const modelValue = defineModel<TValue>({
  required: true,
})

const selectedOption = computed<PreferencesDropdownMenuOption<TValue>>(
  () => props.options.find((option) => option.value === modelValue.value)!,
)
</script>

<template>
  <UIDropdownMenu
    popover-align="end"
    popover-side="bottom"
  >
    <template #trigger>
      <UIClickableElement>
        <button
          :disabled="props.options.length <= 1"
          class="
            group flex h-7 items-center gap-x-sm rounded-md border
            border-secondary px-md
            not-disabled:hover:border-primary
            disabled:border-disabled-subtle disabled:bg-disabled-subtle
          "
        >
          <UIText
            :text="selectedOption.label"
            class="
              text-xs text-primary
              group-disabled:text-placeholder
            "
          />

          <UIText
            v-if="selectedOption.hint !== null && selectedOption.hint !== undefined"
            :text="selectedOption.hint"
            class="text-xs text-placeholder"
          />

          <ChevronDownIcon
            class="
              size-3.5 text-tertiary
              group-disabled:text-placeholder-subtle
            "
          />
        </button>
      </UIClickableElement>
    </template>

    <template #content>
      <UIDropdownMenuGroup>
        <UIDropdownMenuRadioGroup v-model="modelValue">
          <UIDropdownMenuRadioItem
            v-for="option of options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
            :config="{
              description: option.description === undefined && option.hint === undefined ? undefined : {
                value: (option.description ?? option.hint)!,
                layout: option.description === undefined ? 'inline' : 'block',
              },
            }"
          />
        </UIDropdownMenuRadioGroup>
      </UIDropdownMenuGroup>
    </template>
  </UIDropdownMenu>
</template>
