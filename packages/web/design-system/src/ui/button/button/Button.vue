<script setup lang="ts">
import {
  computed,
  useAttrs,
} from 'vue'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import { useProvideButtonContext } from '@/ui/button/button/button.context'
import type { ButtonProps } from '@/ui/button/button/button.props'
import type { ButtonStyle } from '@/ui/button/button/button.style'
import { createButtonStyle } from '@/ui/button/button/button.style'
import ButtonIcon from '@/ui/button/button/ButtonIcon.vue'
import Loader from '@/ui/loader/Loader.vue'
import { UIRowLayout } from '@/ui/row-layout/index'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ButtonProps>(), {
  isDisabled: false,
  isLoading: false,
  disabledReason: null,
  form: null,
  iconLeft: null,
  iconRight: null,
  keyboardShortcut: null,
  size: 'md',
  tooltipLabel: null,
  tooltipSide: 'top',
  type: 'button',
  variant: 'primary',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const attrs = useAttrs()

const buttonStyle = computed<ButtonStyle>(() => createButtonStyle({
  isLoading: props.isLoading,
  class: attrs.class as string,
  size: props.size,
  variant: props.variant,
}))

function onClick(event: MouseEvent): void {
  if (props.isLoading) {
    event.preventDefault()

    return
  }

  emit('click', event)
}

const isTooltipDisabled = computed<boolean>(() => {
  if (props.tooltipLabel !== null) {
    return false
  }

  if (props.keyboardShortcut !== null) {
    return false
  }

  if (props.isDisabled && props.disabledReason !== null) {
    return false
  }

  return true
})

const tooltipLabel = computed<string>(() => {
  if (props.isDisabled && props.disabledReason !== null) {
    return props.disabledReason
  }

  return props.tooltipLabel ?? props.label
})

useProvideButtonContext({
  buttonStyle,
})
</script>

<template>
  <ActionTooltip
    :popover-side="props.tooltipSide"
    :is-disabled="isTooltipDisabled"
    :label="tooltipLabel"
    :keyboard-shortcut="props.keyboardShortcut"
  >
    <!-- This component contains a lot of hacky code to get the glassy look working -->
    <button
      v-bind="attrs"
      :type="props.type"
      :form="props.form ?? undefined"
      :aria-disabled="props.isLoading"
      :disabled="props.isDisabled"
      :aria-busy="props.isLoading"
      :data-interactive="(!props.isDisabled && !props.isLoading) || undefined"
      :class="buttonStyle.root()"
      @click="onClick"
    >
      <div
        :class="buttonStyle.container()"
      >
        <Loader
          :class="buttonStyle.loader()"
        />

        <UIRowLayout
          :class="buttonStyle.rowLayout()"
          gap="sm"
          justify="center"
        >
          <slot name="left" />

          <ButtonIcon
            v-if="props.iconLeft !== null"
            :icon="props.iconLeft"
            :size="props.size"
            :variant="props.variant"
          />

          <span
            :class="buttonStyle.label()"
            class=""
          >
            {{ props.label }}
          </span>

          <ButtonIcon
            v-if="props.iconRight !== null"
            :icon="props.iconRight"
            :size="props.size"
            :variant="props.variant"
          />
        </UIRowLayout>
      </div>
    </button>
  </ActionTooltip>
</template>
