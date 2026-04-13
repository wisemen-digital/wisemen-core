<script setup lang="ts">
import { computed } from 'vue'

import { useInjectTimelineContext } from '@/ui/timeline/timeline.context'
import type { TimelineItemProps } from '@/ui/timeline/timeline.props'
import type { TimelineVariants } from '@/ui/timeline/timeline.style'
import { timelineVariants } from '@/ui/timeline/timeline.style'

const props = withDefaults(defineProps<TimelineItemProps>(), {
  isLast: false,
  icon: undefined,
})

const {
  size, variant,
} = useInjectTimelineContext()

const itemVariants = computed<TimelineVariants>(() => timelineVariants({
  isLast: props.isLast,
  size: size.value,
  variant: variant.value,
}))
</script>

<template>
  <div :class="itemVariants.item()">
    <div :class="itemVariants.itemTrack()">
      <div :class="itemVariants.indicator()">
        <slot name="indicator">
          <component
            :is="props.icon"
            v-if="props.icon != null"
            class="size-4"
          />
        </slot>
      </div>

      <div :class="itemVariants.connector()" />
    </div>

    <div :class="itemVariants.content()">
      <slot />
    </div>
  </div>
</template>
