<script setup lang="ts">
import {
  computed,
  ref,
  useAttrs,
} from 'vue'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import { useIsTruncated } from '@/ui/text/isTruncated.composable'
import type { TextProps } from '@/ui/text/text.props'

const props = withDefaults(defineProps<TextProps>(), {
  isTooltipDisabled: false,
  as: 'span',
  class: null,
  truncate: true,
})

const isTooltipDisabled = computed<boolean>(() => props.isTooltipDisabled || props.disableTooltip === true)

const attrs = useAttrs()

const textRef = ref<HTMLElement | null>(null)
const isTruncated = useIsTruncated(textRef)

type TextClass = (string | Record<string, boolean> | null)[]

const textClass = computed<TextClass>(() => [
  props.class,
  {
    'line-clamp-2': props.truncate === 2,
    'line-clamp-3': props.truncate === 3,
    'line-clamp-4': props.truncate === 4,
    'line-clamp-5': props.truncate === 5,
    'line-clamp-6': props.truncate === 6,
    'truncate': props.truncate === true,
  },
])

// The tooltip (and its Reka portal/positioning tree) is only mounted once truncation is
// actually detected — most `UIText` usages never truncate, so this avoids paying for a
// tooltip's full component tree + ResizeObserver on every instance that will never need one.
const isTooltipNeeded = computed<boolean>(() => isTruncated.value && !isTooltipDisabled.value)
</script>

<template>
  <ActionTooltip
    v-if="isTooltipNeeded"
    :is-disabled="false"
    :label="props.text"
  >
    <Component
      v-bind="attrs"
      :is="props.as"
      ref="textRef"
      :class="textClass"
      class="max-w-full"
    >
      {{ props.text }}
    </Component>
  </ActionTooltip>

  <Component
    v-bind="attrs"
    :is="props.as"
    v-else
    ref="textRef"
    :class="textClass"
    class="max-w-full"
  >
    {{ props.text }}
  </Component>
</template>
