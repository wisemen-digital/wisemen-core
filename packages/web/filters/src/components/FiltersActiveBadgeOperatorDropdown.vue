<script setup lang="ts">
import {
  UIClickableElement,
  UIDropdownMenu,
  UIDropdownMenuGroup,
  UIDropdownMenuRadioGroup,
  UIDropdownMenuRadioItem,
} from '@wisemen/vue-core-design-system'

import FiltersActiveBadgeBasePart from '@/components/FiltersActiveBadgeBasePart.vue'

interface OperatorOption {
  label: string
  value: string
}

const props = defineProps<{
  disabled?: boolean
  label?: string
  modelValue: string
  options: OperatorOption[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function currentLabel(): string {
  return props.label ?? props.options.find((o) => o.value === props.modelValue)?.label ?? props.modelValue
}
</script>

<template>
  <UIDropdownMenu
    popover-side="bottom"
    popover-align="start"
    width-classes="w-40"
  >
    <template #trigger>
      <UIClickableElement>
        <button
          :disabled="props.disabled"
          type="button"
          class="size-full"
        >
          <FiltersActiveBadgeBasePart
            :is-interactive="!(props.disabled ?? false)"
            :label="currentLabel()"
          />
        </button>
      </UIClickableElement>
    </template>

    <template #content>
      <UIDropdownMenuGroup>
        <UIDropdownMenuRadioGroup
          :model-value="props.modelValue"
          @update:model-value="emit('update:modelValue', $event)"
        >
          <UIDropdownMenuRadioItem
            v-for="option in props.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </UIDropdownMenuRadioGroup>
      </UIDropdownMenuGroup>
    </template>
  </UIDropdownMenu>
</template>
