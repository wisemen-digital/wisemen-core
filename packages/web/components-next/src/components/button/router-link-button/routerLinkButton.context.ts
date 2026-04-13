import type { ComputedRef } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { RouterLinkButtonProps } from '@/components/button/router-link-button/routerLinkButton.props'
import type { CreateRouterLinkButtonStyle } from '@/components/button/router-link-button/routerLinkButton.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface RouterLinkButtonContext extends PropsToComputed<RouterLinkButtonProps> {
  customClassConfig: ComputedRef<ResolvedClassConfig<'routerLinkButton'>>
  style: ComputedRef<CreateRouterLinkButtonStyle>
}

export const [
  useProvideRouterLinkButtonContext,
  useInjectRouterLinkButtonContext,
] = useContext<RouterLinkButtonContext>('iconButtonContext')
