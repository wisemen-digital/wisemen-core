<script setup lang="ts" generic="TValue extends AutocompleteValue">
import {
  ComboboxContent as RekaComboboxContent,
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
import AutocompleteLoading from '@/ui/autocomplete/AutocompleteLoading.vue'
import AutocompleteOption from '@/ui/autocomplete/AutocompleteOption.vue'
import { useAutocompleteSearch } from '@/ui/autocomplete/composables/autocompleteSearch.composable'
import Scrollable from '@/ui/scrollable/Scrollable.vue'
import { UISeparator } from '@/ui/separator'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'

const props = withDefaults(defineProps<AutocompleteContentProps<TValue>>(), {
  isLoading: false,
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
</script>

<template>
  <RekaComboboxPortal to="body">
    <ThemeProvider :as-child="true">
      <RekaComboboxContent
        :side-offset="4"
        :collision-padding="8"
        position="popper"
        side="bottom"
        align="center"
        sticky="always"
        data-animation="popover-default"
        class="
          z-40 w-(--reka-combobox-trigger-width)
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
            <template
              v-for="item of filteredItems"
              :key="JSON.stringify(item)"
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

            <AutocompleteLoading v-if="props.isLoading && filteredItems.length === 0" />

            <span
              v-else-if="!props.isLoading && filteredItems.length === 0"
              class="block px-md pt-xs pb-sm text-xs text-disabled"
            >
              {{ i18n.t('component.autocomplete.no_results_found') }}
            </span>
          </Scrollable>
        </div>
      </RekaComboboxContent>
    </ThemeProvider>
  </RekaComboboxPortal>
</template>
