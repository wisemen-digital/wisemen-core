import type { VariantProps } from 'tailwind-variants'

import { createTextButtonStyle } from '@/components/button/shared/textButton.style'

export const createRouterLinkButtonStyle = createTextButtonStyle

export type RouterLinkButtonStyle = VariantProps<typeof createRouterLinkButtonStyle>
export type CreateRouterLinkButtonStyle = ReturnType<typeof createRouterLinkButtonStyle>
