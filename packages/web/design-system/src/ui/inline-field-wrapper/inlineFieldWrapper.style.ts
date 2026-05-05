import { tv } from '@/styles/tailwindVariants.lib'

export const createInlineFieldWrapperStyle = tv({
  base: `
    group/inline-field-wrapper relative flex flex-row items-center rounded-sm
    border border-transparent bg-transparent py-xxs transition-all duration-100
    data-disabled:cursor-not-allowed data-disabled:bg-disabled-subtle
    data-disabled:opacity-50
    data-error:border-fg-error-primary data-error:pr-xs data-error:pl-sm
    [&:has([data-field-wrapper]:focus-visible)]:data-interactive:data-error:border-fg-error-primary
  `,
  defaultVariants: {
    variant: 'primary',
  },
  variants: {
    variant: {
      primary: `
        data-error:bg-primary-hover
        not-data-error:data-interactive:hover:bg-primary-hover
        not-data-error:data-interactive:hover:px-sm
        [&:has([data-field-wrapper]:focus-visible)]:not-data-error:data-interactive:border-fg-brand-primary
        [&:has([data-field-wrapper]:focus-visible)]:not-data-error:data-interactive:bg-primary-hover
        [&:has([data-field-wrapper]:focus-visible)]:not-data-error:data-interactive:px-sm
      `,
      secondary: `
        data-error:bg-secondary-hover
        not-data-error:data-interactive:hover:bg-secondary-hover
        not-data-error:data-interactive:hover:px-sm
        [&:has([data-field-wrapper]:focus-visible)]:not-data-error:data-interactive:border-fg-brand-primary
        [&:has([data-field-wrapper]:focus-visible)]:not-data-error:data-interactive:bg-secondary-hover
        [&:has([data-field-wrapper]:focus-visible)]:not-data-error:data-interactive:px-sm
      `,
      tertiary: `
        data-error:bg-tertiary
        not-data-error:data-interactive:hover:bg-tertiary
        not-data-error:data-interactive:hover:px-sm
        [&:has([data-field-wrapper]:focus-visible)]:not-data-error:data-interactive:border-fg-brand-primary
        [&:has([data-field-wrapper]:focus-visible)]:not-data-error:data-interactive:bg-tertiary
        [&:has([data-field-wrapper]:focus-visible)]:not-data-error:data-interactive:px-sm
      `,
    },
  },
})

export type InlineFieldWrapperStyle = ReturnType<typeof createInlineFieldWrapperStyle>
