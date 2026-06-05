import { tv } from '@/libs/tailwindVariants.lib'

export const createTagsFieldStyle = tv({
  slots: {
    input: `
      h-5 min-w-20 flex-1 bg-transparent text-xs text-primary outline-none
      placeholder:text-placeholder
      read-only:cursor-default
      disabled:cursor-not-allowed disabled:text-disabled
      disabled:placeholder:text-fg-disabled-subtle
    `,
  },
  variants: {
    size: {
      md: {
        input: 'px-xs',
      },
      sm: {
        input: 'px-xs',
      },
    },
  },
})

export type TagsFieldStyle = ReturnType<typeof createTagsFieldStyle>
