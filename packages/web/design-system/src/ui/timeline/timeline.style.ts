import { tv } from 'tailwind-variants'

export const timelineVariants = tv({
  slots: {
    connector: 'flex-1 bg-quaternary',
    content: 'flex min-w-0 flex-1 flex-col',
    icon: '',
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
        connector: 'mt-md mb-md w-px',
        content: 'pb-3xl',
        icon: 'size-4',
        indicator: 'size-8',
        item: 'gap-lg',

      },
      sm: {
        connector: 'mt-xs mb-xs w-px',
        content: 'pb-md',
        icon: 'size-3',
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
