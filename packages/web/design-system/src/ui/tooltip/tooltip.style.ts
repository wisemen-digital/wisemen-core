import { tv } from '@/styles/tailwindVariants.lib'

export const createTooltipStyle = tv({
  slots: {
    content: `
      relative size-full overflow-hidden rounded-sm border border-secondary
      bg-primary shadow-lg
    `,
    contentWrapper: `z-40 will-change-[transform,filter,opacity]`,
  },
  variants: {
    popoverWidth: {
      'anchor-width': {
        content: 'w-(--reka-tooltip-trigger-width)',
      },
      'available-width': {
        content: 'w-(--reka-tooltip-content-available-width)',
      },
    },
  },
})

export type TooltipStyle = ReturnType<typeof createTooltipStyle>
