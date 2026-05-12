<script setup lang="ts">
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchLgIcon,
} from '@wisemen/vue-core-icons'

import { UIBreadcrumbItems } from '@/ui/breadcrumbs'
import type { BreadcrumbItemProps } from '@/ui/breadcrumbs/breadcrumb.props'
import BreadcrumbItem from '@/ui/breadcrumbs/BreadcrumbItem.vue'
import BreadcrumbSeparator from '@/ui/breadcrumbs/BreadcrumbSeparator.vue'
import { UIIconButton } from '@/ui/button'
import { UIClickableElement } from '@/ui/clickable-element'
import { UIKeyboardShortcut } from '@/ui/keyboard-shortcut'
import MainContentSidebarToggle from '@/ui/layout/MainContentSidebarToggle.vue'
import { UIRowLayout } from '@/ui/row-layout'
import { UISeparator } from '@/ui/separator'

const props = defineProps<{
  breadcrumbs: BreadcrumbItemProps[]
}>()
</script>

<template>
  <div
    class="
      grid w-full shrink-0 grid-cols-[1fr_auto_1fr] items-center px-2xl pb-sm
    "
  >
    <UIRowLayout gap="sm">
      <MainContentSidebarToggle />

      <UISeparator
        class="h-4 bg-quaternary"
        orientation="vertical"
      />

      <UIRowLayout gap="xxs">
        <UIIconButton
          :icon="ChevronLeftIcon"
          label="Back"
          size="sm"
          variant="tertiary"
        />
        <UIIconButton
          :icon="ChevronRightIcon"
          label="Forward"
          size="sm"
          variant="tertiary"
        />
      </UIRowLayout>

      <UISeparator
        class="h-4 bg-quaternary"
        orientation="vertical"
      />

      <div class="ml-md">
        <UIBreadcrumbItems>
          <template
            v-for="(breadcrumb, breadcrumbIndex) of props.breadcrumbs"
            :key="breadcrumb.label"
          >
            <BreadcrumbItem
              v-bind="breadcrumb"
            />
            <BreadcrumbSeparator v-if="breadcrumbIndex !== props.breadcrumbs.length - 1" />
          </template>
        </UIBreadcrumbItems>
      </div>
    </UIRowLayout>

    <div class="flex h-full items-center">
      <UIClickableElement>
        <button
          class="
            flex h-6.5 w-54 items-center justify-between gap-sm rounded-md
            bg-fg-primary/5 px-sm duration-100
            hover:bg-fg-primary/7
          "
        >
          <div class="flex items-center gap-sm">
            <SearchLgIcon class="size-3.5 text-disabled" />
            <span class="text-xs text-placeholder">
              Search...
            </span>
          </div>

          <UIKeyboardShortcut
            :keyboard-shortcut="{
              meta: true,
              key: 'K',
            }"
            :enable-key-hold-visualization="true"
          />
        </button>
      </UIClickableElement>
    </div>

    <slot name="right" />
  </div>
</template>
