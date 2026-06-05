import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { LinkStyle } from '@/ui/button/link/link.style'

interface LinkContext {
  linkStyle: ComputedRef<LinkStyle>
}

export const [
  useProvideLinkContext,
  useInjectLinkContext,
] = useContext<LinkContext>('linkContext')
