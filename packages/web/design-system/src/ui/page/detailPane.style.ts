import { tv } from '@/styles/tailwindVariants.lib'

export const createDetailPaneStyle = tv({
  slots: {
    pane: 'absolute z-4 max-w-full bg-primary',
    resizeHandle: 'absolute -left-0.5 z-10 w-0.5 cursor-col-resize',
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
