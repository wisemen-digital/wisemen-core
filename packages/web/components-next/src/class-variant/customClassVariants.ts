import { extendTailwindMerge } from 'tailwind-merge'

import type {
  ComponentMap,
  CustomClassVariant,
  GetComponentProps,
  GetComponentSlots,
} from '@/class-variant/classVariant.type'

export const customClassVariants: CustomClassVariant<any, never, string>[] = []

/**
 * Define a new or override an existing class variant for a component.
 * @param customClassVariant The class variant to define or override.
 * @returns The defined class variant.
 * @example
 * ```ts
 * defineComponentVariant({
 *   config: {
 *     root: 'px-2xl',
 *   }
 *   target: {
 *     prop: 'size',
 *     value: 'md',
 *   },
 *   component: 'button',
 * })
 * ```
 */
export function defineComponentVariant<
  TComponent extends keyof ComponentMap,
  TTargetProp extends keyof GetComponentProps<TComponent>,
  TTargetPropNewValue extends string,
>(
  customClassVariant: CustomClassVariant<TComponent, TTargetProp, TTargetPropNewValue>,
): CustomClassVariant<TComponent, TTargetProp, TTargetPropNewValue> {
  const componentCustomVariants = customClassVariants.filter((variant) => {
    return variant.component === customClassVariant.component
      && (variant.theme === customClassVariant.theme || variant.theme === undefined)
  })

  const existingVariant = componentCustomVariants.find(
    (variant) => variant.target?.prop === customClassVariant.target?.prop
      && variant.target?.value === customClassVariant.target?.value,
  ) ?? null

  if (existingVariant === null) {
    customClassVariants.push(customClassVariant as CustomClassVariant<TComponent, never, never>)
  }
  else {
    customClassVariants.splice(
      customClassVariants.indexOf(existingVariant),
      1,
      customClassVariant as CustomClassVariant<TComponent, never, never>,
    )
  }

  return customClassVariant
}

export function getCustomComponentVariant<
  TComponent extends keyof ComponentMap,
>(component: TComponent, theme: string, props: GetComponentProps<TComponent>): {
  [KSlot in keyof GetComponentSlots<TComponent>]: string
} {
  const themeVariants = customClassVariants.filter((variant) => {
    return variant.theme === theme || variant.theme === undefined
  })

  const componentVariants = themeVariants.filter((variant) => {
    return variant.component === component
  })

  const targetVariants = componentVariants.filter((variant) => {
    return variant.target === undefined || props[variant.target.prop as keyof typeof props] === variant.target.value
  })

  const configs = targetVariants.map((variant) => variant.config)

  const merged = configs.reduce((acc, obj) => {
    for (const key in obj) {
      if (key in acc) {
        acc[key] += ` ${obj[key]}`
      }
      else {
        acc[key] = obj[key]
      }
    }

    return acc
  }, {} as any)

  return merged
}

const twMergeCustom = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [
        'none',
        'xxs',
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
        '3xl',
        '4xl',
        '5xl',
        '6xl',
        '7xl',
        '8xl',
        '9xl',
        '10xl',
        '11xl',
      ],
    },
  },
})

export function mergeClasses(...strings: (string | null | undefined)[]): string {
  return twMergeCustom(strings.filter(Boolean).join(' '))
}

/**
 * Merges multiple class config objects by combining the class strings for each property.
 * Properties from later configs will be merged with earlier ones instead of overwriting them.
 * Supports nested class config objects for complex component hierarchies.
 *
 * @param configs - Array of class config objects to merge
 * @returns A merged class config object where each property's classes are combined
 * @example
 * ```ts
 * const defaultConfig = { root: 'flex items-center', button: 'px-4' }
 * const userConfig = { root: 'bg-blue-500', icon: 'size-4' }
 *
 * mergeClassConfigs(defaultConfig, userConfig)
 * // Result: { root: 'flex items-center bg-blue-500', button: 'px-4', icon: 'size-4' }
 * ```
 */
export function mergeClassConfigs<T extends Record<string, any>>(
  ...configs: (T | null | undefined)[]
): T {
  const validConfigs = configs.filter(Boolean) as T[]

  if (validConfigs.length === 0) {
    return {} as T
  }

  if (validConfigs.length === 1) {
    return validConfigs[0]!
  }

  // Collect all unique keys from all configs
  const allKeys = new Set<keyof T>()

  for (const config of validConfigs) {
    for (const key of Object.keys(config)) {
      allKeys.add(key as keyof T)
    }
  }

  // Merge classes for each key
  const result = {} as T

  for (const key of allKeys) {
    const values = validConfigs
      .map((config) => config[key])
      .filter((value) => value !== null && value !== undefined)

    if (values.length === 0) {
      continue
    }

    // Check if all values are strings (class strings)
    const areAllStrings = values.every((value) => typeof value === 'string')

    if (areAllStrings) {
      // Merge class strings
      result[key] = mergeClasses(...(values as string[])) as T[keyof T]
    }
    else {
      // Recursively merge nested objects
      const nestedObjects = values.filter((value) => typeof value === 'object')

      if (nestedObjects.length > 0) {
        result[key] = mergeClassConfigs(...nestedObjects) as T[keyof T]
      }
      else {
        // Fallback: use the last non-null value
        result[key] = values.at(-1) as T[keyof T]
      }
    }
  }

  return result
}
