import { useContext } from '@/composables/context.composable'
import type { useCustomViewManager } from '@/composables/customViewManager.composable'

interface CustomViewManagerContext extends ReturnType<typeof useCustomViewManager> {}

export const [
  useProvideCustomViewManagerContext,
  useInjectCustomViewManagerContext,
] = useContext<CustomViewManagerContext>('customViewManagerContext')
