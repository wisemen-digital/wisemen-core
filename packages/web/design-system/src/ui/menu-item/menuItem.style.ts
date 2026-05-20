import { tv } from '@/libs/tailwindVariants.lib'

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
    base: 'w-full overflow-hidden',
    dotWrapper: 'flex shrink-0 items-center',
    icon: 'text-tertiary',
    iconWrapper: 'flex shrink-0',
    leftAvatar: '',
  },
  variants: {
    isDisabled: {
      false: {},
      true: {
        base: 'cursor-not-allowed opacity-60',
      },
    },
    hasBlockDescription: {
      false: {},
      true: {
        dotWrapper: 'self-start',
        iconWrapper: 'mt-xs self-start',
      },
    },
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
        base: 'min-h-8',
        dotWrapper: 'h-5',
        icon: 'size-3.5',
      },
      sm: {
        base: 'min-h-7 px-sm',
        dotWrapper: 'h-4',
        icon: 'size-3',
      },
    },
  },
})

export type MenuItemStyle = ReturnType<typeof createMenuItemStyle>
