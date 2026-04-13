<script setup lang="ts">
import { computed } from 'vue'

import { useProvideConfigContext } from '@/components/config-provider/config.context'
import type {
  AutoCloseToastConfig,
  ToastPosition,
} from '@/components/toast/toast.composable'
import TooltipProvider from '@/components/tooltip/TooltipProvider.vue'
import type { HourCycle } from '@/types/hourCycle.type'

const props = defineProps<{
  /**
   * Whether the keyboard shortcut hints should be hidden.
   * @default false
   */
  areKeyboardShortcutHintsHidden?: boolean
  /**
   * Configuration for automatically closing toast notifications.
   * Accepts an object with properties `error`, `info`, and `success`, each of which can
   * be a boolean (to enable/disable auto-close) or a number (timeout in milliseconds).
   * For example: `{ error: true, info: 5000, success: false }`
   */
  autoCloseToast?: AutoCloseToastConfig
  /**
   * The Google Maps API key (used for example to validate addresses using the AddressAutocomplete component).
   * @default null
   */
  googleMapsApiKey?: string
  /**
   * The hour cycle to use for time-related components.
   * Can be either 'h12' or 'h24'. If not provided, the system locale's default will be used.
   * @default null
   */
  hourCycle?: HourCycle
  /**
   * The locale to use for localization.
   */
  locale: string
  /**
   * Define the default pagination limit used in the usePagination composable.
   */
  pagination?: {
    limit?: number
  }
  /**
   * The selector for the teleport target.
   * @default 'body'
   */
  teleportTargetSelector?: string
  /**
   * The position of the toast notifications.
   * @default 'bottom-right'
   */
  toastPosition?: ToastPosition
}>()

defineSlots<{
  /**
   * Wrap your application in this component to provide configuration to all components.
   */
  default: () => void
}>()

useProvideConfigContext({
  areKeyboardShortcutHintsHidden: computed<boolean>(() => props.areKeyboardShortcutHintsHidden ?? false),
  autoCloseToast: computed<AutoCloseToastConfig | null>(() => props.autoCloseToast ?? null),
  googleMapsApiKey: props.googleMapsApiKey ?? null,
  hourCycle: computed<HourCycle | null>(() => props.hourCycle ?? null),
  locale: computed<string>(() => props.locale),
  pagination: {
    limit: props.pagination?.limit,
  },
  teleportTargetSelector: props.teleportTargetSelector ?? 'body',
  toastPosition: props.toastPosition,
})
</script>

<template>
  <TooltipProvider>
    <slot />
  </TooltipProvider>
</template>
