import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { ButtonStyle } from '@/ui/button/button/button.style'

interface ButtonContext {
  buttonStyle: ComputedRef<ButtonStyle>
}

export const [
  useProvideButtonContext,
  useInjectButtonContext,
] = useContext<ButtonContext>('buttonContext')
