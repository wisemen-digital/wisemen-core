<script setup lang="ts">
import { RadioGroupItem as RekaRadioGroupItem } from 'reka-ui'
import { computed } from 'vue'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import ColumnLayout from '@/ui/column-layout/ColumnLayout.vue'
import { useProvideRadioGroupItemContext } from '@/ui/radio-group/base/baseRadioGroup.context'
import type { BaseRadioGroupItemProps } from '@/ui/radio-group/base/baseRadioGroup.props'
import type { BaseRadioGroupStyle } from '@/ui/radio-group/base/baseRadioGroup.style'
import { createBaseRadioGroupStyle } from '@/ui/radio-group/base/baseRadioGroup.style'
import RadioGroupIndicator from '@/ui/radio-group/RadioGroupIndicator.vue'
import RowLayout from '@/ui/row-layout/RowLayout.vue'
import { UIText } from '@/ui/text/index'

const props = withDefaults(defineProps<BaseRadioGroupItemProps>(), {
  isDisabled: false,
  isLabelHidden: false,
  description: null,
  disabledReason: null,
})

const emit = defineEmits<{
  blur: []
  focus: []
}>()

const radioGroupStyle = computed<BaseRadioGroupStyle>(() => createBaseRadioGroupStyle())

useProvideRadioGroupItemContext({
  radioGroupStyle,
})
</script>

<template>
  <ActionTooltip
    :is-disabled="!props.isDisabled || props.disabledReason == null"
    :label="props.disabledReason"
  >
    <RekaRadioGroupItem
      :id="props.id ?? undefined"
      :disabled="props.isDisabled"
      :value="props.value"
      :class="radioGroupStyle.root()"
      @blur="emit('blur')"
      @focus="emit('focus')"
    >
      <RowLayout
        align="start"
      >
        <div :class="radioGroupStyle.control()">
          <RadioGroupIndicator />
        </div>

        <ColumnLayout
          :class="props.isLabelHidden && 'sr-only'"
          gap="none"
        >
          <UIText
            :text="props.label"
            :class="radioGroupStyle.label()"
          />

          <UIText
            v-if="props.description"
            :text="props.description"
            :class="radioGroupStyle.description()"
          />
        </ColumnLayout>
      </RowLayout>
    </RekaRadioGroupItem>
  </ActionTooltip>
</template>
