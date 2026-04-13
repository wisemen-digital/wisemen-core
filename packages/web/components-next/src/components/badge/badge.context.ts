import type { ComputedRef } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { BadgeProps } from '@/components/badge/badge.props'
import type { CreateBadgeStyle } from '@/components/badge/badge.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface BadgeContext extends PropsToComputed<BadgeProps> {
  customClassConfig: ComputedRef<ResolvedClassConfig<'badge'>>
  style: ComputedRef<CreateBadgeStyle>
  onRemove: () => void
}

export const [
  useProvideBadgeContext,
  useInjectBadgeContext,
] = useContext<BadgeContext>('badgeContext')
