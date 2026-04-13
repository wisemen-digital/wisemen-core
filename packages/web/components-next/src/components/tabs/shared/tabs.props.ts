import type {
  CustomizableElement,
  GetComponentProp,
} from '@/class-variant/classVariant.type'
import type { Routes } from '@/types/routes.type'
import type { TestId } from '@/utils/props.util'

export interface TabsProps extends TestId, CustomizableElement<'tabs'> {
  /**
   * Defines the orientation of the tabs.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Defines the visual style of the tabs.
   * @default 'underline'
   */
  variant?: GetComponentProp<'tabs', 'variant'>
}

export interface RouterLinkTabsItemProps extends TestId {
  /**
   * The route to navigate to when the tab is clicked.
   */
  // @ts-expect-error no matching signature
  to: Routes[number]
}
