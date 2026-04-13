<script setup lang="ts">
import { VcIcon } from '@wisemen/vue-core-components'
import { ListboxItem } from 'reka-ui'
import {
  computed,
  toValue,
} from 'vue'

import TextHighlight from '@/modules/settings/components/TextHighlight.vue'
import { useInjectSettingsContext } from '@/modules/settings/settings.context'
import type { SettingsView } from '@/modules/settings/settings.type'

const props = defineProps<{
  view: SettingsView
}>()

const {
  activeItem,
} = useInjectSettingsContext()

const isSectionOfViewActive = computed<boolean>(() => {
  return props.view.sections.some((section) => section.id === activeItem.value.id)
})
</script>

<template>
  <ListboxItem
    :as-child="true"
    :value="{
      type: 'view',
      id: props.view.id,
    }"
    :data-active-section="isSectionOfViewActive || undefined"
  >
    <li
      class="
        group/sidebar-item flex cursor-pointer items-center gap-x-lg rounded-xl
        p-xs text-secondary duration-200 outline-none
        data-active-section:bg-brand-50 data-active-section:text-brand-900
        not-data-active-section:not-data-[state=checked]:data-highlighted:bg-tertiary
        data-active-section:data-highlighted:brightness-102
        data-[state=checked]:bg-brand-50 data-[state=checked]:text-brand-900
        data-[state=checked]:data-highlighted:brightness-102
        dark:data-active-section:bg-brand-950
        dark:data-active-section:text-brand-100
        dark:data-active-section:data-highlighted:brightness-90
        dark:data-[state=checked]:bg-brand-950
        dark:data-[state=checked]:text-brand-100
        dark:data-[state=checked]:data-highlighted:brightness-90
      "
    >
      <div
        class="
          shrink-0 rounded-md p-md duration-200
          group-data-active-section/sidebar-item:bg-brand-100
          group-data-[state=checked]/sidebar-item:bg-brand-100
          dark:group-data-active-section/sidebar-item:bg-brand-900
          dark:group-data-[state=checked]/sidebar-item:bg-brand-900
        "
      >
        <VcIcon
          :icon="props.view.icon"
          class="size-3"
        />
      </div>

      <span
        class="
          text-sm font-medium duration-200
          group-data-[state=checked]/sidebar-item:font-semibold
        "
      >
        <TextHighlight :text="toValue(props.view.title)" />
      </span>
    </li>
  </ListboxItem>
</template>
