export interface SkeletonItemProps {
  /**
   * Whether the skeleton item should display a shimmer animation.
   * @default false
   */
  isAnimated?: boolean
  /**
   * @deprecated Use `isAnimated` instead.
   */
  animate?: boolean

  /**
   * The animation delay in milliseconds before the shimmer starts.
   * @default 0
   */
  animationDelayInMs?: number
}
