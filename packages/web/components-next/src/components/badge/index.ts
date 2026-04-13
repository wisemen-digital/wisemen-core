import type { BadgeProps } from '@/components/badge/badge.props'

export type VcBadgeProps = Omit<BadgeProps, 'classConfig' | 'size' | 'variant'>
export { createBadgeStyle } from '@/components/badge/badge.style'
export { default as VcBadge } from '@/components/badge/Badge.vue'
export { default as VcBadgeIcon } from '@/components/badge/parts/BadgeIcon.vue'
export { default as VcBadgeRemoveButton } from '@/components/badge/parts/BadgeRemoveButton.vue'
export { default as VcBadgeRoot } from '@/components/badge/parts/BadgeRoot.vue'
