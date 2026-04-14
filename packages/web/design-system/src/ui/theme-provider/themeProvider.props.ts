import type { Appearance } from '@/types/appearance.type'

export interface ThemeProviderProps {
  /**
   * The appearance of the application.
   * @default null
   */
  appearance?: Appearance | null
  /**
   * Whether to render the child component directly without any wrapping element.
   * @default false
   */
  asChild?: boolean
  /**
   * The chosen theme for the application.
   * @default null
   */
  theme?: string & {} | 'default' | null
}
