<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import {
  getCustomComponentVariant,
  mergeClasses,
} from '@/class-variant/customClassVariants'
import { useProvideRouterLinkButtonContext } from '@/components/button/router-link-button/routerLinkButton.context'
import type { RouterLinkButtonProps } from '@/components/button/router-link-button/routerLinkButton.props'
import type { CreateRouterLinkButtonStyle } from '@/components/button/router-link-button/routerLinkButton.style'
import { createRouterLinkButtonStyle } from '@/components/button/router-link-button/routerLinkButton.style'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'
import { injectThemeProviderContext } from '@/components/theme-provider/themeProvider.context'
import { toComputedRefs } from '@/utils/props.util'

const props = withDefaults(defineProps<RouterLinkButtonProps>(), {
  id: null,
  testId: null,
  isDisabled: false,
  classConfig: null,
  iconLeft: null,
  iconRight: null,
  size: 'md',
  variant: 'primary',
})

const {
  theme,
} = injectThemeProviderContext()

const buttonStyle = computed<CreateRouterLinkButtonStyle>(() => createRouterLinkButtonStyle({
  size: props.size,
  variant: props.variant,
}))

const customClassConfig = computed<ResolvedClassConfig<'routerLinkButton'>>(
  () => getCustomComponentVariant('routerLinkButton', theme.value, {
    size: props.size,
    variant: props.variant,
  }),
)

useProvideRouterLinkButtonContext({
  ...toComputedRefs(props),
  customClassConfig,
  style: buttonStyle,
})
</script>

<template>
  <TestIdProvider :test-id="props.testId">
    <RouterLink
      :class="buttonStyle.root({
        class: mergeClasses(customClassConfig.root, props.classConfig?.root),
      })"
      :data-loading="false"
      :to="props.to"
    >
      <slot />
    </RouterLink>
  </TestIdProvider>
</template>
