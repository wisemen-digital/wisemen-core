<script setup lang="ts">
import {
  UIClickableElement,
  UIIconButton,
  UIInputWrapper,
  UIPopover,
} from '@wisemen/vue-core-design-system'
import type { Field } from 'formango'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { CustomViewIcon } from '@/types/customViewIcon.type'
import {
  CUSTOM_VIEW_ICONS_MAP,
  getCustomViewIconComponent,
} from '@/utils/customViewIcon.util'

const props = defineProps<{
  field: Field<CustomViewIcon, CustomViewIcon>
}>()

const i18n = useI18n()
const isOpen = ref<boolean>(false)

function onSelectIcon(icon: CustomViewIcon): void {
  props.field.setValue(icon)
  isOpen.value = false
}
</script>

<template>
  <UIPopover
    v-model:is-open="isOpen"
    :popover-side-offset="4"
    popover-align="start"
    popover-side="bottom"
  >
    <template #trigger>
      <UIInputWrapper :label="i18n.t('component.custom_view_icon_picker.label')">
        <UIIconButton
          :icon="getCustomViewIconComponent(props.field.value.value)"
          :is-tooltip-disabled="true"
          :label="i18n.t('component.custom_view_icon_picker.view_icon_label')"
          variant="secondary"
        />
      </UIInputWrapper>
    </template>

    <template #content>
      <div class="p-sm">
        <ul class="grid grid-cols-8 gap-xxs">
          <li
            v-for="[iconKey, iconComponent] of CUSTOM_VIEW_ICONS_MAP"
            :key="iconKey"
          >
            <UIClickableElement>
              <button
                :class="{
                  'bg-tertiary': iconKey === props.field.value.value,
                  'hover:bg-secondary': iconKey !== props.field.value.value,
                }"
                type="button"
                class="p-md"
                @click="onSelectIcon(iconKey)"
              >
                <Component
                  :is="iconComponent"
                  class="size-4 text-tertiary"
                />
              </button>
            </UIClickableElement>
          </li>
        </ul>
      </div>
    </template>
  </UIPopover>
</template>
