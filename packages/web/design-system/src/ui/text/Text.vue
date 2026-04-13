<script setup lang="ts">
import {
  ref,
  useAttrs,
} from 'vue'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import { useIsTruncated } from '@/ui/text/isTruncated.composable'
import type { TextProps } from '@/ui/text/text.props'

const props = withDefaults(defineProps<TextProps>(), {
  as: 'span',
  class: null,
  disableTooltip: false,
  truncate: true,
})

const attrs = useAttrs()

const textRef = ref<HTMLElement | null>(null)
const isTruncated = useIsTruncated(textRef)
</script>

<template>
  <ActionTooltip
    :is-disabled="!isTruncated || props.disableTooltip"
    :label="props.text"
  >
    <Component
      v-bind="attrs"
      :is="props.as"
      ref="textRef"
      :class="[
        props.class, {
          'truncate': props.truncate === true,
          'line-clamp-2': props.truncate === 2,
          'line-clamp-3': props.truncate === 3,
          'line-clamp-4': props.truncate === 4,
          'line-clamp-5': props.truncate === 5,
          'line-clamp-6': props.truncate === 6,
        },
      ]"
      class="max-w-full"
    >
      {{ props.text }}
    </Component>
  </ActionTooltip>
</template>
