<script setup lang="ts">
import {
  UIActionDropdownMenu,
  UIButton,
  UIRowLayout,
  UISeparator,
} from '@wisemen/vue-core-design-system'
import { ChevronDownIcon } from '@wisemen/vue-core-icons'

import { useI18n } from 'vue-i18n'

import { useCustomViewCreateViewAction } from '@/actions/customViewCreateView.action'
import { useCustomViewSaveToCurrentViewAction } from '@/actions/customViewSaveToCurrentView.action'
import CustomViewViewsItem from '@/components/views/CustomViewViewsItem.vue'
import { useInjectCustomViewManagerContext } from '@/context/customViewManager.context'

const i18n = useI18n()
const customViewManagerContext = useInjectCustomViewManagerContext()
const createViewAction = useCustomViewCreateViewAction()
const saveToCurrentViewAction = useCustomViewSaveToCurrentViewAction()
</script>

<template>
  <UIRowLayout>
    <UIRowLayout gap="sm">
      <CustomViewViewsItem
        v-for="(view, viewIndex) of customViewManagerContext.views.value"
        :key="view.id"
        :view="view"
        :is-selected="view.id === customViewManagerContext.activeView.value.id"
        :view-index="viewIndex"
        @select="customViewManagerContext.setActiveView"
      />
    </UIRowLayout>

    <template v-if="customViewManagerContext.isDirty.value">
      <UISeparator
        class="h-5"
        orientation="vertical"
      />

      <UIActionDropdownMenu
        :current-context-only="false"
        :actions="[saveToCurrentViewAction, createViewAction]"
        popover-side="bottom"
        popover-align="end"
      >
        <UIButton
          :icon-right="ChevronDownIcon"
          :label="i18n.t('component.custom_view_list.save')"
          size="sm"
          variant="secondary"
        />
      </UIActionDropdownMenu>
    </template>
  </UIRowLayout>
</template>
