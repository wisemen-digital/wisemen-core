import type { ComputedRef } from 'vue'

import type { PropsToComputed } from '@/composables/context.composable'
import { useContext } from '@/composables/context.composable'
import type { TimelineProps } from '@/ui/timeline/timeline.props'
import type { TimelineVariants } from '@/ui/timeline/timeline.style'

interface TimelineContext extends PropsToComputed<TimelineProps> {
  variants: ComputedRef<TimelineVariants>
}

export const [
  useProvideTimelineContext,
  useInjectTimelineContext,
] = useContext<TimelineContext>('timelineContext')
