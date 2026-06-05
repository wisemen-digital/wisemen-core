import { tv } from '@/libs/tailwindVariants.lib'

export const createSliderStyle = tv({
  slots: {
    labelsRow: `
      relative w-full
    `,
    range: `
      absolute h-full bg-brand-solid
      group-disabled/slider:bg-disabled
    `,
    root: `
      group/slider relative flex w-full touch-none select-none flex-col
    `,
    thumb: `
      block rounded-full border-2 border-brand-600 bg-white outline-none
      duration-150
      focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2
      disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled-subtle
    `,
    track: `
      relative w-full grow overflow-hidden rounded-full bg-quaternary
      group-disabled/slider:bg-disabled-subtle
    `,
    trackContainer: `
      relative flex w-full items-center
    `,
    valueLabel: `
      absolute -translate-x-1/2 tabular-nums text-tertiary
      group-disabled/slider:text-disabled
    `,
  },
  variants: {
    size: {
      md: {
        labelsRow: 'h-4 mt-1',
        thumb: 'size-4',
        track: 'h-1.5',
        valueLabel: 'text-xs',
      },
      sm: {
        labelsRow: 'h-3.5 mt-0.5',
        thumb: 'size-3',
        track: 'h-1',
        valueLabel: 'text-xs',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type SliderStyle = ReturnType<typeof createSliderStyle>
