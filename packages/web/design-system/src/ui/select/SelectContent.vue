<script setup lang="ts" generic="TValue extends SelectValue | SelectValue[]">
import {
  ListboxContent as RekaListboxContent,
  ListboxFilter as RekaListboxFilter,
  ListboxRoot as RekaListboxRoot,
} from 'reka-ui'
import {
  computed,
  onBeforeUnmount,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'

import Scrollable from '@/ui/scrollable/Scrollable.vue'
import { useSelectDisplayItems } from '@/ui/select/composables/selectDisplayItems.composable'
import { useSelectRemoteSearch } from '@/ui/select/composables/selectRemoteSearch.composable'
import { useSelectValue } from '@/ui/select/composables/selectValue.composable'
import type { SelectContentProps } from '@/ui/select/select.props'
import type {
  SelectItem,
  SelectValue,
} from '@/ui/select/select.type'
import SelectLoading from '@/ui/select/SelectLoading.vue'
import { useSelectLocalSearch } from '@/ui/select/selectLocalSearch.composable'
import SelectOption from '@/ui/select/SelectOption.vue'
import { UISeparator } from '@/ui/separator'
import { UIText } from '@/ui/text'

const props = withDefaults(defineProps<SelectContentProps<TValue>>(), {
  isLoading: false,
  limit: null,
  search: null,
})

const emit = defineEmits<{
  'nextPage': []
  'update:search': [searchTerm: string]
}>()

const i18n = useI18n()

const modelValue = defineModel<TValue>('modelValue', {
  required: true,
})

const {
  isMultiple, selectedOptions,
} = useSelectValue<TValue>(modelValue, props.displayFn)

const {
  locallyFilteredItems,
  localSearch,
  onSearchLocally,
} = useSelectLocalSearch(
  computed<SelectItem<TValue>[]>(() => props.items),
  props.displayFn,
)

const {
  debouncedSearch, search,
} = useSelectRemoteSearch()

const isSearchEmpty = computed<boolean>(() =>
  props.search === 'local' ? localSearch.value === '' : search.value === '')

const {
  createDisplayItemList, displayItems,
} = useSelectDisplayItems<TValue>(
  selectedOptions,
  isSearchEmpty,
  isMultiple(modelValue.value),
  props.displayFn,
)

const filterModelValue = computed<string>(() => props.search === 'local' ? localSearch.value : search.value)

function onSearch(searchTerm: string): void {
  if (props.search === 'local') {
    onSearchLocally(searchTerm)
  }
  else {
    search.value = searchTerm
  }
}

if (props.search === 'remote') {
  watch(() => props.items, (items) => {
    createDisplayItemList(items)
  }, {
    immediate: true,
  })
}
else {
  watch(locallyFilteredItems, (items) => {
    createDisplayItemList(items)
  }, {
    immediate: true,
  })
}

watch(debouncedSearch, (search) => {
  emit('update:search', search)
})

onBeforeUnmount(() => {
  emit('update:search', '')
})
</script>

<template>
  <RekaListboxRoot
    v-model="modelValue"
    :highlight-on-hover="true"
    :multiple="isMultiple(modelValue)"
    :selection-behavior="isMultiple(modelValue) ? 'toggle' : 'replace'"
    class="
      flex max-h-[min(var(--reka-popover-content-available-height),32rem)]
      flex-col overflow-hidden
    "
  >
    <div
      v-if="props.search !== null"
      class="p-xs pb-none"
    >
      <RekaListboxFilter
        :model-value="filterModelValue"
        :placeholder="i18n.t('component.autocomplete.search_placeholder')"
        class="
          h-7 w-full rounded-sm bg-secondary px-md text-xs text-primary
          outline-none
        "
        @update:model-value="onSearch"
      />
    </div>

    <Scrollable
      :as="RekaListboxContent"
      class="p-xs"
      @next="emit('nextPage')"
    >
      <template
        v-for="item of displayItems"
        :key="item.key"
      >
        <SelectOption
          v-if="item.type === 'option'"
          :label="props.displayFn(item.value as any)"
          :value="item.value"
        />

        <UISeparator
          v-else-if="item.type === 'separator'"
          class="my-xs"
        />
      </template>

      <UIText
        v-if="displayItems.length === 0"
        :text="i18n.t('component.autocomplete.no_results_found')"
        class="block px-md pt-xs pb-sm text-xs text-disabled"
      />

      <SelectLoading v-if="props.isLoading && displayItems.length === 0" />

      <UIText
        v-if="props.items.length === props.limit"
        :text="i18n.t('component.autocomplete.more_results_available')"
        :truncate="false"
        class="block px-md pt-xs pb-sm text-xxs text-disabled"
      />
    </Scrollable>
  </RekaListboxRoot>
</template>
