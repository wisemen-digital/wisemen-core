<script setup lang="ts">
import { usePreferredColorScheme } from '@vueuse/core'
import { Primitive } from 'reka-ui'
import { computed } from 'vue'

import type { Appearance } from '@/types/appearance.type'
import {
  useInjectThemeProviderContext,
  useProvideThemeProviderContext,
} from '@/ui/theme-provider/themeProvider.context'
import type { ThemeProviderProps } from '@/ui/theme-provider/themeProvider.props'

const props = withDefaults(defineProps<ThemeProviderProps>(), {
  appearance: null,
  asChild: false,
  theme: null,
})

const themeContext = useInjectThemeProviderContext()
const preferredColorScheme = usePreferredColorScheme()

const computedAppearance = computed<Appearance>(() => (
  props.appearance ?? themeContext.appearance.value ?? 'light'
))

const resolvedAppearance = computed<Exclude<Appearance, 'system'>>(() => {
  if (computedAppearance.value === 'system') {
    return preferredColorScheme.value === 'dark' ? 'dark' : 'light'
  }

  return computedAppearance.value
})

const theme = computed<string>(
  () => props.theme ?? themeContext.theme.value,
)

useProvideThemeProviderContext({
  appearance: computedAppearance,
  resolvedAppearance,
  theme,
})
</script>

<template>
  <Primitive
    :as-child="props.asChild"
    :class="[theme, computedAppearance]"
  >
    <slot />
  </Primitive>
</template>
