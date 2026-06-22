<script setup lang="ts">
import {
  UIClickableElement,
  UIDropdownMenu,
  UIDropdownMenuGroup,
  UIDropdownMenuRadioGroup,
  UIDropdownMenuRadioItem,
} from '@wisemen/vue-core-design-system'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

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

const i18n = useI18n()

const {
  values,
} = useInjectFiltersContext()

const currentValue = computed<boolean>(() => values.value[props.filter.key] as boolean)
const radioValue = computed<string>(() => String(currentValue.value))

const operatorLabel = computed<string>(() =>
  currentValue.value
    ? (props.filter.trueOperatorLabel ?? i18n.t('component.filters.operator.is'))
    : (props.filter.falseOperatorLabel ?? i18n.t('component.filters.operator.is_not')))

function onSelect(value: string): void {
  values.value[props.filter.key] = value === 'true'
}
</script>

<template>
  <FiltersActiveBadgeBase :filter="props.filter">
    <FiltersActiveBadgeBasePart
      :label="props.filter.label"
      :icon="props.filter.icon ?? null"
    />

    <FiltersActiveBadgePartSeparator />

    <template v-if="!(props.filter.disableOperators ?? false)">
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
                :label="operatorLabel"
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
                :label="props.filter.trueOperatorLabel ?? i18n.t('component.filters.operator.is')"
                value="true"
              />
              <UIDropdownMenuRadioItem
                :label="props.filter.falseOperatorLabel ?? i18n.t('component.filters.operator.is_not')"
                value="false"
              />
            </UIDropdownMenuRadioGroup>
          </UIDropdownMenuGroup>
        </template>
      </UIDropdownMenu>

      <FiltersActiveBadgePartSeparator />
    </template>

    <FiltersActiveBadgeBasePart
      :label="props.filter.entityLabel"
      class="lowercase"
    />
  </FiltersActiveBadgeBase>
</template>
