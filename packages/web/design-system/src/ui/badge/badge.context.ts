import type { ComputedRef } from 'vue'

import type { PropsToComputed } from '@/composables/context.composable'
import { useContext } from '@/composables/context.composable'
import type {
  BadgeColor,
  BadgeProps,
} from '@/ui/badge/badge.props'
import type { BadgeVariants } from '@/ui/badge/badge.style'

interface BadgeContext extends PropsToComputed<BadgeProps> {
  effectiveDotColor: ComputedRef<BadgeColor>
  variants: ComputedRef<BadgeVariants>
}

export const [
  useProvideBadgeContext,
  useInjectBadgeContext,
] = useContext<BadgeContext>('badgeContext')
