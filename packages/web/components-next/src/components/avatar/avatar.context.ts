import type { ComputedRef } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { AvatarProps } from '@/components/avatar/avatar.props'
import type { CreateAvatarStyle } from '@/components/avatar/avatar.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface AvatarContext extends PropsToComputed<AvatarProps> {
  customClassConfig: ComputedRef<ResolvedClassConfig<'avatar'>>
  style: ComputedRef<CreateAvatarStyle>
}

export const [
  useProvideAvatarContext,
  useInjectAvatarContext,
] = useContext<AvatarContext>('avatarContext')
