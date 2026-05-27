<script setup lang="ts">
import {
  UIClickableElement,
  UIDropdownMenu,
  UIDropdownMenuGroup,
  UIDropdownMenuRadioGroup,
  UIDropdownMenuRadioItem,
} from '@wisemen/vue-core-design-system'
import { computed } from 'vue'

import FiltersActiveBadgeBase from '@/components/FiltersActiveBadgeBase.vue'
import FiltersActiveBadgeBasePart from '@/components/FiltersActiveBadgeBasePart.vue'
import FiltersActiveBadgePartSeparator from '@/components/FiltersActiveBadgePartSeparator.vue'
import type {
  BooleanFilter,
  FilterWithAction,
} from '@/composables'
import { useInjectFiltersContext } from '@/context/filters.context'

const props = defineProps<{
  filter: FilterWithAction<BooleanFilter>
}>()

const {
  values,
} = useInjectFiltersContext()

const currentValue = computed<boolean>(() => values.value[props.filter.key] as boolean)
const radioValue = computed<string>(() => String(currentValue.value))

const trueLabel = computed<string>(() => props.filter.trueLabel)
const falseLabel = computed<string>(() => props.filter.falseLabel)

function onSelect(value: string): void {
  values.value[props.filter.key] = value === 'true'
}
</script>

<template>
  <FiltersActiveBadgeBase :filter="props.filter">
    <FiltersActiveBadgeBasePart
      :label="props.filter.entityLabel"
      :icon="props.filter.icon ?? null"
    />

    <FiltersActiveBadgePartSeparator />

    <UIDropdownMenu
      popover-side="bottom"
      popover-align="start"
      width-classes="w-32"
    >
      <template #trigger>
        <UIClickableElement>
          <button
            :disabled="!props.filter.canBeToggled"
            type="button"
            class="
              size-full
              disabled:cursor-not-allowed
            "
          >
            <FiltersActiveBadgeBasePart
              :is-interactive="props.filter.canBeToggled"
              :label="currentValue ? trueLabel : falseLabel"
            />
          </button>
        </UIClickableElement>
      </template>

      <template #content>
        <UIDropdownMenuGroup>
          <UIDropdownMenuRadioGroup
            :model-value="radioValue"
            @update:model-value="onSelect"
          >
            <UIDropdownMenuRadioItem
              :label="trueLabel"
              value="true"
            />
            <UIDropdownMenuRadioItem
              :label="falseLabel"
              value="false"
            />
          </UIDropdownMenuRadioGroup>
        </UIDropdownMenuGroup>
      </template>
    </UIDropdownMenu>

    <FiltersActiveBadgePartSeparator />

    <FiltersActiveBadgeBasePart
      :label="props.filter.badgeLabel ?? props.filter.label"
      class="lowercase"
    />
  </FiltersActiveBadgeBase>
</template>
