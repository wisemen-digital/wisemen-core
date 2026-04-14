<script setup lang="ts">
import { HelpCircleIcon } from '@wisemen/vue-core-icons'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import ClickableElement from '@/ui/clickable-element/ClickableElement.vue'
import { UIRowLayout } from '@/ui/row-layout/index'
import { UIText } from '@/ui/text/index'
import { twMerge } from '@/utils/twMerge.util'

const props = defineProps<{
  isHorizontal?: boolean
  isLabelHidden?: boolean
  isRequired: boolean
  for: string | null
  helpText?: string | null
  label: string | null
}>()
</script>

<template>
  <UIRowLayout
    v-if="props.label !== null"
    :class="[
      {
        'pb-xs': !props.isHorizontal,
      },
      props.isLabelHidden && 'sr-only',
    ]"
    gap="none"
  >
    <slot name="left" />

    <UIText
      :for="props.for ?? undefined"
      :text="props.label"
      :class="twMerge(
        'text-xs font-medium text-secondary',
        props.isRequired ? 'after:pl-xxs after:text-error-primary' : '',
      )"
      :data-label-required="props.isRequired ? '' : null"

      as="label"
    />

    <ActionTooltip
      v-if="props.helpText !== undefined && props.helpText !== null"
      :label="props.helpText"
    >
      <ClickableElement
        :is-default-cursor="true"
      >
        <button
          tabindex="0"
          aria-label="Help"
          class="ml-xs inline-flex items-center"
        >
          <HelpCircleIcon class="size-3.5 shrink-0 text-fg-quaternary" />
        </button>
      </ClickableElement>
    </ActionTooltip>

    <slot name="right" />
  </UIRowLayout>
</template>

<style scoped>
:deep([data-label-required]::after) {
  content: '*';
}
</style>
