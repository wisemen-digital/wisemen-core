<script setup lang="ts">
import {
  _UIActionDropdownMenu as UIActionDropdownMenu,
  UIIconButton,
} from '@wisemen/vue-core-design-system'
import { PlusIcon } from '@wisemen/vue-core-icons'
import { useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { useInjectFiltersContext } from '@/context/filters.context'

const i18n = useI18n()

const {
  action,
} = useInjectFiltersContext()

const containerRef = useTemplateRef('container')
const referenceRef = useTemplateRef('reference')

// We don't want the position to change when toggling filters, so we'll update it when opened
function updatePosition(isOpen: boolean): void {
  if (!isOpen) {
    return
  }

  const containerBoundingBox = containerRef.value?.getBoundingClientRect() ?? null

  if (containerBoundingBox === null || referenceRef.value === null) {
    return
  }

  referenceRef.value.style.top = `${containerBoundingBox.top}px`
  referenceRef.value.style.left = `${containerBoundingBox.left}px`
  referenceRef.value.style.height = `${containerBoundingBox.height}px`
  referenceRef.value.style.width = `${containerBoundingBox.width}px`
}
</script>

<template>
  <div
    ref="reference"
    class="pointer-events-none fixed"
  />

  <div ref="container">
    <UIActionDropdownMenu
      :metadata="{
        filters: {
          hideClearAll: true,
        },
      }"
      :current-context-only="false"
      :popover-anchor-reference-element="referenceRef"
      :parent-action="action"
      :popover-collision-padding="10"
      popover-align="start"
      popover-side="bottom"
      @update:is-open="updatePosition"
    >
      <UIIconButton
        :icon="PlusIcon"
        :label="i18n.t('component.filters.add_filter')"
        variant="tertiary"
        size="sm"
      />
    </UIActionDropdownMenu>
  </div>
</template>
