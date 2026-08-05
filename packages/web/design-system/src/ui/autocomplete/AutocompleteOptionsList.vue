<script setup lang="ts" generic="TValue extends AutocompleteValue">
import { useI18n } from 'vue-i18n'

import type {
  AutocompleteDisplayFn,
  AutocompleteGetItemKeyFn,
} from '@/ui/autocomplete/autocomplete.props'
import type {
  AutocompleteItem,
  AutocompleteValue,
} from '@/ui/autocomplete/autocomplete.type'
import AutocompleteLoading from '@/ui/autocomplete/AutocompleteLoading.vue'
import AutocompleteOption from '@/ui/autocomplete/AutocompleteOption.vue'
import { UISeparator } from '@/ui/separator'

const props = withDefaults(defineProps<{
  isLoading?: boolean
  displayFn: AutocompleteDisplayFn<TValue>
  getItemKey?: AutocompleteGetItemKeyFn<TValue> | null
  items: AutocompleteItem<TValue>[]
}>(), {
  isLoading: false,
  getItemKey: null,
})

const i18n = useI18n()

function getItemKeyFor(value: NonNullable<TValue>): number | string {
  return props.getItemKey?.(value) ?? JSON.stringify(value)
}
</script>

<template>
  <template
    v-for="(item, index) of props.items"
    :key="item.type === 'option' ? `option-${getItemKeyFor(item.value as NonNullable<TValue>)}` : `sep-${index}`"
  >
    <AutocompleteOption
      v-if="item.type === 'option'"
      :label="props.displayFn(item.value as NonNullable<TValue>)"
      :value="item.value"
    />

    <UISeparator
      v-else-if="item.type === 'separator'"
      class="my-xs"
    />
  </template>

  <AutocompleteLoading v-if="props.isLoading && props.items.length === 0" />

  <span
    v-else-if="!props.isLoading && props.items.length === 0"
    class="block px-md pt-xs pb-sm text-xs text-disabled"
  >
    {{ i18n.t('component.autocomplete.no_results_found') }}
  </span>
</template>
