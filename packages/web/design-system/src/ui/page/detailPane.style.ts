import { tv } from '@/styles/tailwindVariants.lib'

export const createDetailPaneStyle = tv({
  slots: {
    pane: 'absolute z-4 max-w-full bg-primary',
    resizeHandle: `
      group absolute -left-2 z-10 flex w-4 cursor-col-resize items-center
      justify-center
    `,
    resizeHandleBar: `
      h-24 w-1 rounded-full bg-transparent transition-colors duration-150
      group-hover:bg-quaternary
      group-focus-visible:bg-quaternary
      group-active:bg-quaternary
    `,
  },
  variants: {
    variant: {
      'bordered-inline': {
        pane: `
          inset-y-2 right-2 rounded-lg border border-secondary shadow-floating
          max-md:inset-2! max-md:w-auto!
        `,
        resizeHandle: '-inset-y-2',
      },
      'bordered-overlay': {
        pane: `
          inset-y-2 right-2 rounded-lg border border-secondary shadow-floating
          max-md:inset-2! max-md:w-auto!
        `,
        resizeHandle: '-inset-y-2',
      },
      'full-height-inline': {
        pane: `
          inset-y-0 right-0 h-full border-l border-secondary
          max-md:w-full!
        `,
        resizeHandle: 'inset-y-0',
      },
      'full-height-overlay': {
        pane: `
          inset-y-0 right-0 h-full border-l border-secondary
          max-md:w-full!
        `,
        resizeHandle: 'inset-y-0',
      },
    },
  },
})

export type DetailPaneStyle = ReturnType<typeof createDetailPaneStyle>
