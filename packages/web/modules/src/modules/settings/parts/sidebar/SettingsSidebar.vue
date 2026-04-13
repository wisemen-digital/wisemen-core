<script setup lang="ts">
import { ListboxRoot } from 'reka-ui'

import { useInjectSettingsContext } from '@/modules/settings/settings.context'
import type { HistoryItem } from '@/modules/settings/settingsHistory.composable'

const {
  activeItem, onShowItem,
} = useInjectSettingsContext()
</script>

<template>
  <ListboxRoot
    :model-value="activeItem"
    selection-behavior="replace"
    class="
      hidden w-72 shrink-0 flex-col gap-y-3xl border-r border-solid
      border-secondary bg-secondary-subtle
      @3xl/settings:flex
    "
    @update:model-value="(item) => onShowItem(item as HistoryItem)"
  >
    <slot />
  </ListboxRoot>
</template>
