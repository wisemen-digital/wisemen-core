import type { Component } from 'vue'

import type { DotColor } from '@/ui/dot/dot.props'
import type { FeaturedIconColor } from '@/ui/featured-icon/featuredIcon.props'

export type BaseHeaderLeftConfig
  = | {
    alt: string
    src: string
    type: 'logo'
  }
  | {
    color?: DotColor
    type: 'dot'
  }
  | {
    color?: FeaturedIconColor
    icon: Component
    type: 'featured-icon'
  }
  | {
    icon: Component
    type: 'icon'
  }
  | {
    name: string
    imageAlt?: string | null
    src?: string | null
    type: 'avatar'
  }
