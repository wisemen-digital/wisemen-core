import type { AcceptableValue } from 'reka-ui'

import { useContext } from '@/composables/context.composable'
import type { SegmentedControlGroupStyle } from '@/ui/segmented-control/segmentedControl.style'
import type { SegmentedControlSharedContext } from '@/ui/segmented-control/segmentedControlShared.context'

type SegmentedControlGroupContext = SegmentedControlSharedContext<AcceptableValue[], SegmentedControlGroupStyle>

export const [
  useProvideSegmentedControlGroupContext,
  useInjectSegmentedControlGroupContext,
] = useContext<SegmentedControlGroupContext>('segmentedControlGroupContext')
