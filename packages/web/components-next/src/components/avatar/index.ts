import type { AvatarProps } from '@/components/avatar/avatar.props'

export type VcAvatarProps = Omit<AvatarProps, 'classConfig' | 'variant'>
export { createAvatarStyle } from '@/components/avatar/avatar.style'
export { default as VcAvatar } from '@/components/avatar/Avatar.vue'
export { default as VcAvatarFallback } from '@/components/avatar/parts/AvatarFallback.vue'
export { default as VcAvatarImage } from '@/components/avatar/parts/AvatarImage.vue'
export { default as VcAvatarRoot } from '@/components/avatar/parts/AvatarRoot.vue'
