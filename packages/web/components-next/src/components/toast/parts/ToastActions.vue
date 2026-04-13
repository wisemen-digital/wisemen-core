<script setup lang="ts">
import { toValue } from 'vue'

import type { ButtonProps } from '@/components/button/default-button/button.props'
import Button from '@/components/button/default-button/Button.vue'
import { useInjectToastContext } from '@/components/toast/toast.context'
import type { PropsToMaybeRefOrGetter } from '@/components/toast/toast.props'

const {
  actions,
  customClassConfig,
  style,
  onClose,
} = useInjectToastContext()

function mapPropsToValue(props: PropsToMaybeRefOrGetter<ButtonProps> & { onClick: undefined }): ButtonProps {
  return Object.entries(props).reduce((acc, [
    key,
    value,
  ]) => {
    // @ts-expect-error index signature
    acc[key] = toValue(value)

    return acc
  }, {} as ButtonProps)
}
</script>

<template>
  <div
    v-if="actions.length > 0"
    :class="style.actions({
      class: customClassConfig.actions,
    })"
  >
    <Button
      v-for="action of actions"
      :key="action.label"
      v-bind="mapPropsToValue({
        ...action,
        onClick: undefined,
      })"
      :size="toValue(action.size) ?? 'sm'"
      @click="() => {
        action.onClick(onClose)
      }"
    >
      {{ action.label }}
    </Button>
  </div>
</template>
