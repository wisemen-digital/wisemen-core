import type { VariantProps } from 'tailwind-variants'

import { createTextButtonStyle } from '@/components/button/shared/textButton.style'

export const createButtonStyle = createTextButtonStyle

export type ButtonStyle = VariantProps<typeof createButtonStyle>
export type CreateButtonStyle = ReturnType<typeof createButtonStyle>
