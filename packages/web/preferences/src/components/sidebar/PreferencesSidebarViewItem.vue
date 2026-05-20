<script setup lang="ts">
import { UIRowLayout } from '@wisemen/vue-core-design-system'
import { ListboxItem } from 'reka-ui'
import {
  computed,
  toValue,
} from 'vue'

import PreferencesHighlightWord from '#components/PreferencesHighlightWord.vue'
import { useInjectPreferencesContext } from '#context/preferences.context'
import type { PreferencesView } from '#types/preferences.type'

const props = defineProps<{
  view: PreferencesView
}>()

const {
  activeItem,
} = useInjectPreferencesContext()

const isSectionOfViewActive = computed<boolean>(() => {
  return props.view.sections.some((section) => section.id === activeItem.value.id)
})
</script>

<template>
  <!-- eslint-disable better-tailwindcss/no-unknown-classes -->
  <ListboxItem
    :value="{
      type: 'view',
      id: props.view.id,
    }"
    :data-active-section="isSectionOfViewActive || undefined"
    class="
      group
      dark:data-[state=checked]:glassy
      w-full cursor-default rounded-md p-px
      data-highlighted:bg-tertiary
      data-[state=checked]:bg-quaternary
    "
  >
    <UIRowLayout
      gap="md"
      class="
        group
        dark:group-data-[state=checked]:glassy-inner-content
        h-7 rounded-[0.4rem] px-lg duration-100
      "
    >
      <Component
        :is="props.view.icon"
        class="
          size-3.5 text-fg-tertiary duration-100
          group-hover:text-fg-secondary
          group-data-[state=checked]:text-brand-secondary
          dark:group-data-[state=checked]:text-fg-primary
        "
      />

      <span
        class="
          text-xs font-medium text-secondary duration-100
          group-hover:text-primary
          group-data-[state=checked]:text-brand-primary
        "
      >
        <PreferencesHighlightWord :text="toValue(props.view.title)" />
      </span>
    </UIRowLayout>
  </ListboxItem>
</template>
