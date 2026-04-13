<script setup lang="ts">
import { ListboxItem } from 'reka-ui'
import { toValue } from 'vue'

import TextHighlight from '@/modules/settings/components/TextHighlight.vue'
import type { SettingsSection } from '@/modules/settings/settings.type'

const props = defineProps<{
  section: SettingsSection
}>()
</script>

<template>
  <ListboxItem
    :as-child="true"
    :value="{
      type: 'section',
      id: props.section.id,
    }"
  >
    <li
      class="
        group/sidebar-item flex cursor-pointer items-center gap-x-lg rounded-lg
        px-md py-xs text-secondary duration-200 outline-none
        data-highlighted:bg-tertiary
        data-[state=checked]:bg-tertiary
        data-[state=checked]:data-highlighted:brightness-102
        dark:data-[state=checked]:text-brand-100
        dark:data-[state=checked]:data-highlighted:brightness-90
      "
    >
      <span
        class="
          text-sm font-medium duration-200
          group-data-[state=checked]/sidebar-item:font-semibold
        "
      >
        <TextHighlight :text="toValue(props.section.title)" />
      </span>
    </li>
  </ListboxItem>
</template>
