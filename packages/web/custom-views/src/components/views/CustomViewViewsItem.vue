<script setup lang="ts">
import {
  UIActionContextMenu,
  UIActionTooltip,
  UIClickableElement,
  UIRowLayout,
} from '@wisemen/vue-core-design-system'

import { useCustomViewDeleteViewAction } from '@/actions/customViewDeleteView.action'
import { useCustomViewEditViewAction } from '@/actions/customViewEditView.action'
import type { CustomView } from '@/types/customView.type'
import { getCustomViewColor } from '@/utils/customViewColor.util'
import { getCustomViewIconComponent } from '@/utils/customViewIcon.util'

const props = defineProps<{
  isSelected: boolean
  view: CustomView
  viewIndex: number
}>()

const emit = defineEmits<{
  select: [viewId: string]
}>()

const editViewAction = useCustomViewEditViewAction()
const deleteViewAction = useCustomViewDeleteViewAction()
</script>

<template>
  <UIActionTooltip
    :label="props.view.name"
    :keyboard-shortcut="viewIndex < 9 ? {
      key: `${viewIndex + 1}`,
    } : null"
  >
    <div
      class="
        flex h-6 items-center overflow-hidden rounded-sm border border-secondary
        duration-100
        hover:bg-secondary
      "
    >
      <UIActionContextMenu
        :current-context-only="true"
        :actions="[
          editViewAction,
          deleteViewAction,
        ]"
        :models="[
          {
            modelName: 'CustomView',
            ...props.view,
          },
        ]"
      >
        <UIClickableElement class="h-full rounded-none">
          <button
            :class="{
              'bg-tertiary': props.isSelected,
            }"
            @click="emit('select', props.view.id)"
          >
            <UIRowLayout
              gap="none"
              class="
                duration-100
                active:scale-98 active:will-change-transform
              "
            >
              <UIRowLayout
                gap="xs"
                class="px-sm"
              >
                <Component
                  :is="getCustomViewIconComponent(props.view.icon)"
                  :style="{
                    color: getCustomViewColor(props.view.color),
                  }"
                  class="size-3"
                />

                <span class="text-xs text-primary">
                  {{ props.view.name }}
                </span>
              </UIRowLayout>
            </UIRowLayout>
          </button>
        </UIClickableElement>
      </UIActionContextMenu>
    </div>
  </UIActionTooltip>
</template>
