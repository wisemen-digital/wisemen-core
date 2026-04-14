<script setup lang="ts">
import { computed } from 'vue'

import { toComputedRefs } from '@/composables/context.composable'
import { useProvideTimelineContext } from '@/ui/timeline/timeline.context'
import type { TimelineProps } from '@/ui/timeline/timeline.props'
import type { TimelineVariants } from '@/ui/timeline/timeline.style'
import { timelineVariants } from '@/ui/timeline/timeline.style'

const props = withDefaults(defineProps<TimelineProps>(), {
  size: 'md',
  variant: 'solid',
})

const variants = computed<TimelineVariants>(() => timelineVariants({
  size: props.size,
  variant: props.variant,
}))

useProvideTimelineContext({
  ...toComputedRefs(props),
  variants,
})
</script>

<template>
  <div :class="variants.root()">
    <slot />
  </div>
</template>
