import { tv } from '@/styles/tailwindVariants.lib'

export const createDetailPaneStyle = tv({
  slots: {
    pane: 'absolute z-4 max-w-full bg-primary',
    resizeHandle: `
      group absolute -left-2 z-10 flex w-4 cursor-col-resize items-center
      justify-center
    `,
    resizeHandleBar: `
      h-32 w-1 translate-x-0.5 scale-90 rounded-full bg-quaternary opacity-0
      duration-200 ease-in-out
      group-hover:-translate-x-1.5 group-hover:scale-100 group-hover:opacity-100
      group-focus-visible:-translate-x-1.5 group-focus-visible:scale-100
      group-focus-visible:opacity-100
      group-active:h-28 group-active:-translate-x-2 group-active:scale-100
      group-active:opacity-100 group-active:brightness-95
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
