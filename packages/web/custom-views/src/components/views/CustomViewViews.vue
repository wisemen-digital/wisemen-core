<script setup lang="ts">
import {
  UIActionDropdownMenu,
  UIButton,
  UIRowLayout,
  UISeparator,
} from '@wisemen/vue-core-design-system'
import { ChevronDownIcon } from '@wisemen/vue-core-icons'
import {
  ref,
  watch,
} from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useI18n } from 'vue-i18n'

import { useCustomViewCreateViewAction } from '@/actions/customViewCreateView.action'
import { useCustomViewSaveToCurrentViewAction } from '@/actions/customViewSaveToCurrentView.action'
import CustomViewViewsItem from '@/components/views/CustomViewViewsItem.vue'
import { useInjectCustomViewManagerContext } from '@/context/customViewManager.context'
import type { CustomView } from '@/types/customView.type'

const i18n = useI18n()
const customViewManagerContext = useInjectCustomViewManagerContext()
const createViewAction = useCustomViewCreateViewAction()
const saveToCurrentViewAction = useCustomViewSaveToCurrentViewAction()

const draggableViews = ref<CustomView[]>([
  ...customViewManagerContext.views.value,
])

watch(
  () => customViewManagerContext.views.value,
  (views) => {
    draggableViews.value = [
      ...views,
    ]
  },
)

function onDragEnd(): void {
  customViewManagerContext.reorderViews(draggableViews.value)
}
</script>

<template>
  <UIRowLayout>
    <VueDraggable
      v-model="draggableViews"
      :animation="150"
      class="flex flex-row items-center gap-1"
      @end="onDragEnd"
    >
      <CustomViewViewsItem
        v-for="(view, viewIndex) of draggableViews"
        :key="view.id"
        :view="view"
        :is-selected="view.id === customViewManagerContext.activeView.value.id"
        :view-index="viewIndex"
        @select="customViewManagerContext.setActiveView"
      />
    </VueDraggable>

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
