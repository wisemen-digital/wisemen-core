import { tv } from '@/styles/tailwindVariants.lib'

export const createMenuItemStyle = tv({
  compoundVariants: [
    {
      hasLeftContent: false,
      class: {
        base: 'pl-md',
      },
      size: 'md',
    },
    {
      hasLeftContent: true,
      class: {
        base: 'pl-md',
      },
      size: 'md',
    },
    {
      hasRightContent: false,
      class: {
        base: 'pr-md',
      },
      size: 'md',
    },
    {
      hasRightContent: true,
      class: {
        base: 'pr-md',
      },
      size: 'md',
    },
  ],
  slots: {
    base: 'w-full',
    dotWrapper: 'flex shrink-0 items-center',
    iconWrapper: 'flex shrink-0 items-center',
  },
  variants: {
    hasLeftContent: {
      false: {},
      true: {},
    },
    hasRightContent: {
      false: {},
      true: {},
    },
    size: {
      md: {
        base: 'min-h-8 py-sm',
        dotWrapper: 'h-5',
        iconWrapper: 'h-5',
      },
      sm: {
        base: 'min-h-7 px-sm py-xs',
        dotWrapper: 'h-4',
        iconWrapper: 'h-4',
      },
    },
  },
})

export type MenuItemStyle = ReturnType<typeof createMenuItemStyle>
