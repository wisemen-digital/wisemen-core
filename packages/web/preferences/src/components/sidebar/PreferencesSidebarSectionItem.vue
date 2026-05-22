<script setup lang="ts">
import { ListboxItem } from 'reka-ui'
import { toValue } from 'vue'

import PreferencesHighlightWord from '#components/PreferencesHighlightWord.vue'
import type { PreferencesSection } from '#types/preferences.type'

const props = defineProps<{
  section: PreferencesSection
}>()
</script>

<template>
  <!-- eslint-disable better-tailwindcss/no-unknown-classes -->
  <ListboxItem
    :value="{
      type: 'section',
      id: props.section.id,
    }"
    class="
      group w-full cursor-default rounded-md p-px
      data-highlighted:bg-tertiary
      data-[state=checked]:bg-quaternary
      dark:data-[state=checked]:glassy
    "
  >
    <div
      gap="md"
      class="
        group h-7 rounded-[0.4rem] px-lg duration-100
        dark:group-data-[state=checked]:glassy-inner-content
      "
    >
      <span
        class="
          text-xs font-medium text-secondary duration-100
          group-hover:text-primary
          group-data-[state=checked]:text-brand-primary
        "
      >
        <PreferencesHighlightWord :text="toValue(props.section.title)" />
      </span>
    </div>
  </ListboxItem>
</template>
