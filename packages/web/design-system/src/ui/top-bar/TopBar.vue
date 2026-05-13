<script setup lang="ts">
import { SearchLgIcon } from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

import { UIClickableElement } from '@/ui/clickable-element'
import DashboardPageHeaderBreadcrumbs from '@/ui/dashboard-page/header/DashboardPageHeaderBreadcrumbs.vue'
import DashboardPageHeaderSidebarToggle from '@/ui/dashboard-page/header/DashboardPageHeaderSidebarToggle.vue'
import { UIKeyboardShortcut } from '@/ui/keyboard-shortcut'
import Separator from '@/ui/separator/Separator.vue'
import { useTopBarNavigation } from '@/ui/top-bar/topBarNavigation.composable'

const emit = defineEmits<{
  search: []
}>()

const {
  t,
} = useI18n()

const {
  title, breadcrumbs,
} = useTopBarNavigation()
</script>

<template>
  <div class="flex shrink-0 items-center px-xl pb-md">
    <div class="flex flex-1 items-center">
      <DashboardPageHeaderSidebarToggle />

      <Separator
        v-if="breadcrumbs.length > 0 || title !== null"
        class="mr-lg ml-md h-4.5 bg-quaternary"
        orientation="vertical"
      />

      <template v-if="breadcrumbs.length > 0">
        <h1 class="sr-only">
          {{ title }}
        </h1>
        <DashboardPageHeaderBreadcrumbs :breadcrumbs="breadcrumbs" />
      </template>

      <h1
        v-else-if="title !== null"
        class="text-sm font-medium text-primary"
      >
        {{ title }}
      </h1>
    </div>

    <!-- Center: search button placeholder -->
    <div class="flex flex-1 items-center justify-center">
      <UIClickableElement>
        <button
          type="button"
          class="
            flex h-7.5 w-full max-w-60 cursor-pointer items-center gap-sm
            rounded-lg bg-tertiary px-lg
            hover:bg-quaternary
          "
          @click="emit('search')"
        >
          <SearchLgIcon
            class="size-4 shrink-0 text-quaternary"
          />
          <span class="flex-1 truncate text-left text-xs text-placeholder">
            {{ t('component.top_bar.search') }}
          </span>
          <UIKeyboardShortcut
            :keyboard-shortcut="{
              sequence: [
                'Meta+K',
              ],
            }"
          />
        </button>
      </UIClickableElement>
    </div>

    <!-- Right: badge slot -->
    <div class="flex flex-1 items-center justify-end">
      <slot name="actions" />
    </div>
  </div>
</template>
