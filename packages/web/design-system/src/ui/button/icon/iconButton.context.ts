import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { IconButtonStyle } from '@/ui/button/icon/iconButton.style'

interface IconButtonContext {
  iconButtonStyle: ComputedRef<IconButtonStyle>
}

export const [
  useProvideIconButtonContext,
  useInjectIconButtonContext,
] = useContext<IconButtonContext>('iconButtonContext')
