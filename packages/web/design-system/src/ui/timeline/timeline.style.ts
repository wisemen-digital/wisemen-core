import { tv } from 'tailwind-variants'

export const timelineVariants = tv({
  slots: {
    connector: 'flex-1 bg-quaternary',
    content: 'flex min-w-0 flex-1 flex-col',
    indicator: `
      relative z-10 flex shrink-0 items-center justify-center rounded-full
    `,
    item: 'relative flex',
    itemTrack: 'flex shrink-0 flex-col items-center',
    root: 'flex flex-col',
  },
  variants: {
    size: {
      md: {
        connector: 'w-px',
        content: 'pb-lg',
        indicator: 'size-8',
        item: 'gap-md',
      },
      sm: {
        connector: 'w-px',
        content: 'pb-md',
        indicator: 'size-6',
        item: 'gap-sm',
      },
    },
    variant: {
      outline: {
        indicator: 'border border-secondary bg-primary',
      },
      solid: {
        indicator: 'bg-brand-primary-alt text-fg-brand-primary-alt',
      },
      subtle: {
        indicator: 'bg-tertiary text-secondary',
      },
    },
    isLast: {
      true: {
        connector: 'invisible',
        content: 'pb-0',
      },
    },
  },
})

export type TimelineVariants = ReturnType<typeof timelineVariants>
