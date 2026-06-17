<script setup lang="ts">
import { ChevronDownIcon } from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

import { useInjectTabsContext } from '@/ui/tabs/tabs.context'

import TabsItemContent from './TabsItemContent.vue'

const i18n = useI18n()
const tabsContext = useInjectTabsContext()
</script>

<template>
  <div
    aria-hidden="true"
    class="pointer-events-none invisible absolute top-0 left-0"
  >
    <div
      :ref="(el) => tabsContext.setOverflowMeasurementListRef(el as HTMLElement | null)"
      :class="tabsContext.variants.value.list()"
      :data-orientation="tabsContext.orientation.value"
    >
      <div
        v-for="tab in tabsContext.registeredTabs.value"
        :key="tab.id"
        :ref="(el) => tabsContext.setOverflowMeasurementTabRef(tab.id, el as HTMLElement | null)"
        :class="tabsContext.variants.value.item()"
        :data-orientation="tabsContext.orientation.value"
        data-state="inactive"
      >
        <TabsItemContent
          :count="tab.count"
          :icon="tab.icon"
          :is-label-hidden="tab.isLabelHidden"
          :label="tab.label"
        />
      </div>

      <div
        :ref="(el) => tabsContext.setOverflowMeasurementDropdownTriggerRef(el as HTMLElement | null)"
        :class="[
          tabsContext.variants.value.item(),
          tabsContext.variants.value.dropdownTrigger(),
        ]"
        :data-orientation="tabsContext.orientation.value"
        data-state="inactive"
      >
        <span>{{ i18n.t('component.tabs.overflow_label') }}</span>
        <ChevronDownIcon class="size-4 shrink-0" />
      </div>
    </div>
  </div>
</template>
