<script setup lang="ts">
import {
  UIActionDropdownMenu,
  UIIconButton,
} from '@wisemen/vue-core-design-system'
import { PlusIcon } from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

import { useInjectFiltersContext } from '@/context/filters.context'

const i18n = useI18n()

const {
  action,
} = useInjectFiltersContext()
</script>

<template>
  <UIActionDropdownMenu
    :metadata="{
      filters: {
        hideClearAll: true,
      },
    }"
    :current-context-only="false"
    :parent-action="action"
    :popover-collision-padding="10"
    :fixed-content-position="true"
    popover-align="start"
    popover-side="bottom"
  >
    <UIIconButton
      :icon="PlusIcon"
      :label="i18n.t('component.filters.add_filter')"
      variant="tertiary"
      size="sm"
    />
  </UIActionDropdownMenu>
</template>
