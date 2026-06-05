<script setup lang="ts">
import { ListboxRoot } from 'reka-ui'

import type { HistoryItem } from '#composables/preferencesHistory.composable'
import { useInjectPreferencesContext } from '#context/preferences.context'

const {
  activeItem, onShowItem,
} = useInjectPreferencesContext()
</script>

<template>
  <ListboxRoot
    :model-value="activeItem"
    selection-behavior="replace"
    class="flex w-56 shrink-0 flex-col pr-md"
    @update:model-value="(item) => onShowItem(item as HistoryItem)"
  >
    <slot />
    <slot name="footer" />
  </ListboxRoot>
</template>
