import '@/styles/index.css'

import { extendIcons } from '@wisemen/vue-core-components'

import { icons } from '@/icons/icons'

extendIcons(icons)

export * from '@/modules/settings'
export { default as VcLayoutStackRoot } from '@/modules/stacked-layout/parts/LayoutStackRoot.vue'
