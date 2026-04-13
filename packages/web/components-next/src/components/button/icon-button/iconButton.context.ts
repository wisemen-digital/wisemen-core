import type { ComputedRef } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { IconButtonProps } from '@/components/button/icon-button/iconButton.props'
import type { CreateIconButtonStyle } from '@/components/button/icon-button/iconButton.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface IconButtonContext extends PropsToComputed<IconButtonProps> {
  customClassConfig: ComputedRef<ResolvedClassConfig<'iconButton'>>
  style: ComputedRef<CreateIconButtonStyle>
}

export const [
  useProvideIconButtonContext,
  useInjectIconButtonContext,
] = useContext<IconButtonContext>('iconButtonContext')
