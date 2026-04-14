export interface LogoProps {
  /**
   * Accessible alt text for the logo image.
   */
  alt: string
  /**
   * The size of the logo.
   */
  size: '3xs' | 'sm' | 'xs' | 'xxs'
  /**
   * The image source URL for the logo.
   */
  src: string
}

export interface LogoWithTextProps {
  /**
   * The name displayed next to the logo.
   */
  name: string
  /**
   * The size of the logo and text.
   */
  size: 'sm' | 'xs' | 'xxs'
  /**
   * The image source URL for the logo.
   * When null, only the text is displayed.
   */
  src: string | null
}
