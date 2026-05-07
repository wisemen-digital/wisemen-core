import type { PropsToComputed } from '@/composables/context.composable'
import { useContext } from '@/composables/context.composable'
import type { ConfigProviderProps } from '@/ui/config-provider/config.types'

export type ConfigContext = PropsToComputed<ConfigProviderProps>

export const [
  useProvideConfigContext,
  useInjectConfigContext,
] = useContext<ConfigContext>('configContext')
