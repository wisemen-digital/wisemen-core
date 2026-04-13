import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createBadgeStyle = tv({
  slots: {
    icon: new StyleBuilder()
      .withSize('size-4')
      .build(),
    root: new StyleBuilder()
      .withBase('group/badge')
      .withFlex('inline-flex items-center')
      .withBorder('border border-solid')
      .withBorderRadius('rounded-full')
      .withFontWeight('font-medium')
      .build(),
  },
  variants: {
    variant: {
      // Don't use compound variants because it's a hell to support it with `defineComponentVariant`
      outline: {},
      solid: {},
      translucent: {},
    },
    color: {
      brand: {
        root: new StyleBuilder()
          // Solid
          .withBackgroundColor('data-[variant=solid]:bg-brand-700')
          .withColor('data-[variant=solid]:text-primary-on-brand')
          .withBorder('data-[variant=solid]:border-brand-700')
          // Translucent
          .withBackgroundColor('data-[variant=translucent]:bg-brand-25 data-[variant=translucent]:dark:bg-brand-950')
          .withColor('data-[variant=translucent]:text-brand-700 data-[variant=translucent]:dark:text-brand-200')
          .withBorder('data-[variant=translucent]:border-brand-200 data-[variant=translucent]:dark:border-brand-800')
          // Outline
          .withColor('data-[variant=outline]:text-brand-700 data-[variant=outline]:dark:text-brand-300')
          .withBorder('data-[variant=outline]:border-brand-400 data-[variant=outline]:dark:border-brand-600')
          .build(),
      },
      error: {
        root: new StyleBuilder()
          // Solid
          .withBackgroundColor('data-[variant=solid]:bg-error-700')
          .withColor('data-[variant=solid]:text-white')
          .withBorder('data-[variant=solid]:border-error-700')
          // Translucent
          .withBackgroundColor('data-[variant=translucent]:bg-error-25 data-[variant=translucent]:dark:bg-error-950')
          .withColor('data-[variant=translucent]:text-error-700 data-[variant=translucent]:dark:text-error-200')
          .withBorder('data-[variant=translucent]:border-error-200 data-[variant=translucent]:dark:border-error-800')
          // Outline
          .withColor('data-[variant=outline]:text-error-700 data-[variant=outline]:dark:text-error-300')
          .withBorder('data-[variant=outline]:border-error-400 data-[variant=outline]:dark:border-error-600')
          .build(),
      },
      gray: {
        root: new StyleBuilder()
          // Solid
          .withBackgroundColor('data-[variant=solid]:bg-gray-700')
          .withColor('data-[variant=solid]:text-white')
          .withBorder('data-[variant=solid]:border-gray-700')
          // Translucent
          .withBackgroundColor('data-[variant=translucent]:bg-gray-25 data-[variant=translucent]:dark:bg-gray-950')
          .withColor('data-[variant=translucent]:text-gray-700 data-[variant=translucent]:dark:text-gray-200')
          .withBorder('data-[variant=translucent]:border-gray-200 data-[variant=translucent]:dark:border-gray-800')
          // Outline
          .withColor('data-[variant=outline]:text-gray-700 data-[variant=outline]:dark:text-gray-300')
          .withBorder('data-[variant=outline]:border-gray-400 data-[variant=outline]:dark:border-gray-600')
          .build(),
      },
      success: {
        root: new StyleBuilder()
          // Solid
          .withBackgroundColor('data-[variant=solid]:bg-success-700')
          .withColor('data-[variant=solid]:text-white')
          .withBorder('data-[variant=solid]:border-success-700')
          // Translucent
          .withBackgroundColor('data-[variant=translucent]:bg-success-25 data-[variant=translucent]:dark:bg-success-950')
          .withColor('data-[variant=translucent]:text-success-700 data-[variant=translucent]:dark:text-success-200')
          .withBorder('data-[variant=translucent]:border-success-200 data-[variant=translucent]:dark:border-success-800')
          // Outline
          .withColor('data-[variant=outline]:text-success-700 data-[variant=outline]:dark:text-success-300')
          .withBorder('data-[variant=outline]:border-success-400 data-[variant=outline]:dark:border-success-600')
          .build(),
      },
      warning: {
        root: new StyleBuilder()
          // Solid
          .withBackgroundColor('data-[variant=solid]:bg-warning-700')
          .withColor('data-[variant=solid]:text-white')
          .withBorder('data-[variant=solid]:border-warning-700')
          // Translucent
          .withBackgroundColor('data-[variant=translucent]:bg-warning-25 data-[variant=translucent]:dark:bg-warning-950')
          .withColor('data-[variant=translucent]:text-warning-700 data-[variant=translucent]:dark:text-warning-200')
          .withBorder('data-[variant=translucent]:border-warning-200 data-[variant=translucent]:dark:border-warning-800')
          // Outline
          .withColor('data-[variant=outline]:text-warning-700 data-[variant=outline]:dark:text-warning-300')
          .withBorder('data-[variant=outline]:border-warning-400 data-[variant=outline]:dark:border-warning-600')
          .build(),
      },
    },
    size: {
      lg: {
        root: new StyleBuilder()
          .withFlex('gap-x-sm')
          .withPadding('px-lg py-xs data-icon:pl-md data-removable:pr-sm')
          .withFontSize('text-sm')
          .build(),
      },
      md: {
        root: new StyleBuilder()
          .withFlex('gap-x-sm')
          .withPadding('px-2.5 py-xxs data-icon:pl-sm data-removable:pr-sm')
          .withFontSize('text-sm')
          .build(),
      },
      sm: {
        root: new StyleBuilder()
          .withFlex('gap-x-xs')
          .withPadding('px-md py-xxs data-icon:pl-xs data-removable:pr-xs')
          .withFontSize('text-xs')
          .build(),
      },
    },
  },
})

export type BadgeStyle = VariantProps<typeof createBadgeStyle>
export type CreateBadgeStyle = ReturnType<typeof createBadgeStyle>
