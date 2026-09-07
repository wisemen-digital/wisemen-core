import type { AcceptableValue } from 'reka-ui'

import { useContext } from '@/composables/context.composable'
import type { SegmentedControlStyle } from '@/ui/segmented-control/segmentedControl.style'
import type { SegmentedControlSharedContext } from '@/ui/segmented-control/segmentedControlShared.context'

type SegmentedControlContext = SegmentedControlSharedContext<AcceptableValue, SegmentedControlStyle>

export const [
  useProvideSegmentedControlContext,
  useInjectSegmentedControlContext,
] = useContext<SegmentedControlContext>('segmentedControlContext')
