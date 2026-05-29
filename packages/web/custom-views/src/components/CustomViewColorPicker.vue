<script setup lang="ts">
import {
  UIClickableElement,
  UIInputWrapper,
  UIRowLayout,
} from '@wisemen/vue-core-design-system'
import { CheckIcon } from '@wisemen/vue-core-icons'
import type { Field } from 'formango'
import {
  RadioGroupIndicator,
  RadioGroupItem,
  RadioGroupRoot,
  useId,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'

import type { CustomViewColor } from '@/types/customViewColor.type'
import {
  CUSTOM_VIEW_COLORS_MAP,
  getCustomViewColor,
} from '@/utils/customViewColor.util'

const props = defineProps<{
  field: Field<CustomViewColor, CustomViewColor> | Field<CustomViewColor>
}>()

const i18n = useI18n()
const id = useId()
</script>

<template>
  <UIInputWrapper
    :for="id"
    :label="i18n.t('component.custom_view_color_picker.label')"
  >
    <RadioGroupRoot
      :id="id"
      :model-value="props.field.value.value"
      @update:model-value="(value) => field.setValue(value as CustomViewColor)"
    >
      <UIRowLayout class="flex-wrap">
        <UIClickableElement
          v-for="[colorKey] of CUSTOM_VIEW_COLORS_MAP"
          :key="colorKey"
        >
          <RadioGroupItem
            :value="colorKey"
            :style="{
              backgroundColor: getCustomViewColor(colorKey),
            }"
            class="
              flex size-7 items-center justify-center rounded-md ring-offset-1
            "
          >
            <RadioGroupIndicator>
              <CheckIcon
                class="
                  size-4 text-white
                  dark:text-black
                "
              />
            </RadioGroupIndicator>
          </RadioGroupItem>
        </UIClickableElement>
      </UIRowLayout>
    </RadioGroupRoot>
  </UIInputWrapper>
</template>
