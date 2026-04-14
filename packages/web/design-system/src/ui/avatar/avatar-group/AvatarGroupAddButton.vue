<script setup lang="ts">
import { PlusIcon } from '@wisemen/vue-core-icons'
import { computed } from 'vue'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import type { AvatarGroupAddButtonProps } from '@/ui/avatar/avatar-group/avatarGroupAddButton.props'
import type { AvatarGroupAddButtonStyle } from '@/ui/avatar/avatar-group/avatarGroupAddButton.style'
import { createAvatarGroupAddButtonStyle } from '@/ui/avatar/avatar-group/avatarGroupAddButton.style'
import Loader from '@/ui/loader/Loader.vue'

const props = withDefaults(defineProps<AvatarGroupAddButtonProps>(), {
  isDisabled: false,
  isLoading: false,
  isTooltipDisabled: false,
  disabledReason: null,
  form: null,
  keyboardShortcut: null,
  size: 'sm',
  tooltipLabel: null,
  type: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const isTooltipDisabled = computed<boolean>(() => {
  if (props.isDisabled && props.disabledReason !== null) {
    return false
  }

  return props.isTooltipDisabled
})

const tooltipLabel = computed<string>(() => {
  if (props.isDisabled && props.disabledReason !== null) {
    return props.disabledReason
  }

  return props.tooltipLabel ?? props.label
})

const avatarGroupAddButtonStyle = computed<AvatarGroupAddButtonStyle>(
  () => createAvatarGroupAddButtonStyle({
    size: props.size,
  }),
)

function onClick(event: MouseEvent): void {
  if (props.isLoading) {
    event.preventDefault()

    return
  }

  emit('click', event)
}
</script>

<template>
  <ActionTooltip
    :is-disabled="isTooltipDisabled"
    :label="tooltipLabel"
    :keyboard-shortcut="props.keyboardShortcut"
  >
    <button
      :aria-label="props.label"
      :aria-busy="props.isLoading"
      :aria-disabled="props.isLoading"
      :class="avatarGroupAddButtonStyle.root()"
      :data-interactive="(!props.isDisabled && !props.isLoading) || undefined"
      :disabled="props.isDisabled"
      :form="props.form ?? undefined"
      :type="props.type"
      @click="onClick"
    >
      <Loader
        v-if="props.isLoading"
        :class="avatarGroupAddButtonStyle.icon()"
      />
      <PlusIcon
        v-else
        :class="avatarGroupAddButtonStyle.icon()"
      />
    </button>
  </ActionTooltip>
</template>
