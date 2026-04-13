import type {
  ComputedRef,
  InjectionKey,
} from 'vue'
import {
  inject,
  provide,
} from 'vue'

import type { LinkStyle } from '@/ui/button/link/link.style'

interface LinkContext {
  linkStyle: ComputedRef<LinkStyle>
}

export const linkContextKey: InjectionKey<LinkContext> = Symbol('LinkContextKey')

export function useProvideLinkContext(context: LinkContext): void {
  provide(linkContextKey, context)
}

export function useInjectLinkContext(): LinkContext {
  const context = inject(linkContextKey, null)

  if (context === null) {
    throw new Error('LinkContext not provided')
  }

  return context
}
