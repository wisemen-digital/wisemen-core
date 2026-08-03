<script setup lang="ts" generic="TValue extends AutocompleteValue">
import {
  ComboboxContent as RekaComboboxContent,
  ComboboxInput as RekaComboboxInput,
  ComboboxPortal as RekaComboboxPortal,
  injectComboboxRootContext,
} from 'reka-ui'
import {
  computed,
  onBeforeUnmount,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'

import type { AutocompleteContentProps } from '@/ui/autocomplete/autocomplete.props'
import type { AutocompleteValue } from '@/ui/autocomplete/autocomplete.type'
import AutocompleteOptionsList from '@/ui/autocomplete/AutocompleteOptionsList.vue'
import { useAutocompleteSearch } from '@/ui/autocomplete/composables/autocompleteSearch.composable'
import Scrollable from '@/ui/scrollable/Scrollable.vue'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'

const props = withDefaults(defineProps<AutocompleteContentProps<TValue>>(), {
  isLoading: false,
  isMobileDrawer: false,
  getItemKey: null,
  popoverAlign: 'center',
  popoverCollisionPadding: 8,
  popoverSide: 'bottom',
  popoverSideOffset: 4,
  searchMode: 'local',
})

const emit = defineEmits<{
  'nextPage': []
  'update:search': [searchTerm: string]
}>()

const i18n = useI18n()

const {
  filterSearch,
} = injectComboboxRootContext()

const {
  debouncedSearch, filteredItems,
} = useAutocompleteSearch(
  computed(() => props.items),
  filterSearch,
  props.displayFn,
  props.searchMode ?? 'local',
)

watch(debouncedSearch, (value) => {
  if (props.searchMode === 'remote') {
    emit('update:search', value)
  }
})

onBeforeUnmount(() => {
  if (props.searchMode === 'remote') {
    emit('update:search', '')
  }
})

function displayValueFn(value: TValue | null): string {
  if (value == null) {
    return ''
  }

  return props.displayFn(value as NonNullable<TValue>)
}
</script>

<template>
  <RekaComboboxPortal
    v-if="!props.isMobileDrawer"
    to="body"
  >
    <ThemeProvider :as-child="true">
      <RekaComboboxContent
        :side="props.popoverSide"
        :align="props.popoverAlign"
        :align-offset="props.popoverAlignOffset"
        :hide-when-empty="true"
        :side-offset="4"
        :collision-padding="8"
        position="popper"
        sticky="always"
        data-animation="popover-default"
        class="
          z-50 w-(--reka-combobox-trigger-width)
          origin-(--reka-combobox-content-transform-origin)
          will-change-[transform,opacity]
        "
      >
        <div
          class="
            relative size-full overflow-hidden rounded-md border
            border-secondary bg-primary shadow-lg
          "
        >
          <Scrollable
            class="
              max-h-[min(var(--reka-combobox-content-available-height),32rem)]
              p-xs
            "
            @next="emit('nextPage')"
          >
            <AutocompleteOptionsList
              :display-fn="props.displayFn"
              :get-item-key="props.getItemKey"
              :is-loading="props.isLoading"
              :items="filteredItems"
            />
          </Scrollable>
        </div>
      </RekaComboboxContent>
    </ThemeProvider>
  </RekaComboboxPortal>

  <RekaComboboxContent
    v-else
    :hide-when-empty="false"
    class="flex max-h-full min-h-0 flex-col overflow-hidden"
  >
    <div class="p-xs pb-none">
      <RekaComboboxInput
        :display-value="displayValueFn"
        :placeholder="i18n.t('component.autocomplete.search_placeholder')"
        class="
          h-7 w-full rounded-sm bg-secondary px-md text-xs text-primary
          outline-none
        "
      />
    </div>

    <Scrollable
      class="min-h-0 grow p-xs"
      @next="emit('nextPage')"
    >
      <AutocompleteOptionsList
        :display-fn="props.displayFn"
        :get-item-key="props.getItemKey"
        :is-loading="props.isLoading"
        :items="filteredItems"
      />
    </Scrollable>
  </RekaComboboxContent>
</template>
