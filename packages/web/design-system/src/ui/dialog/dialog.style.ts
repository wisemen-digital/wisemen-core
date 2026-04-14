import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/styles/tailwindVariants.lib'

export const createDialogStyle = tv({
  slots: {
    body: 'flex-1 overflow-y-auto px-xl py-xs',
    chin: `
      absolute bottom-0 -z-10 w-full rounded-t-[calc(1rem+5px)] rounded-b-none
      shadow-xl transition-transform duration-200
      sm:top-0 sm:rounded-[calc(1rem+5px)]
    `,
    content: `
      flex max-h-[90vh] w-full flex-col overflow-hidden
      rounded-t-[calc(1rem+5px)] rounded-b-none border-t-[5px] border-r-[5px]
      border-l-[5px] border-transparent bg-primary bg-clip-padding
      sm:max-h-[85vh] sm:rounded-[calc(1rem+5px)] sm:border-[5px]
    `,
    contentPositioner: `
      z-modal fixed inset-x-0 bottom-0 flex w-full flex-col
      will-change-[transform,opacity] outline-none
      sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:-translate-1/2
    `,
    footer: 'sticky bottom-0 bg-primary',
    header: 'sticky top-0 z-10 bg-primary',
    innerContent: '',
    overlay: `
      z-modal fixed inset-0 bg-linear-to-t from-black/50 to-black/25
      will-change-[opacity]
    `,
  },
  variants: {
    size: {
      'full-screen': {
        content: `
          h-[90vh]
          sm:max-h-[90vh] sm:rounded-[calc(1rem+5px)] sm:border-[5px]
        `,
        contentPositioner: `sm:max-w-[90vw]`,
      },
      'lg': {
        contentPositioner: `sm:max-w-160`,
      },
      'md': {
        contentPositioner: `sm:max-w-140`,
      },
      'sm': {
        contentPositioner: `sm:max-w-120`,
      },
      'xl': {
        contentPositioner: `sm:max-w-180`,
      },
      'xs': {
        contentPositioner: `sm:max-w-100`,
      },
      'xxs': {
        contentPositioner: `sm:max-w-90`,
      },
    },
  },
})

export type DialogStyle = VariantProps<typeof createDialogStyle>
export type CreateDialogStyle = ReturnType<typeof createDialogStyle>
