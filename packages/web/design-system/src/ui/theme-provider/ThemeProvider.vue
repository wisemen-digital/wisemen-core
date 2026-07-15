<script setup lang="ts">
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

const computedAppearance = computed<Appearance>(() => (
  props.appearance ?? themeContext.appearance.value ?? 'light'
))

const theme = computed<string>(
  () => props.theme ?? themeContext.theme.value,
)

useProvideThemeProviderContext({
  appearance: computedAppearance,
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
