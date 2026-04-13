<script setup lang="ts">
import { AvatarRoot as RekavaAvatarRoot } from 'reka-ui'
import { computed } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import {
  getCustomComponentVariant,
  mergeClasses,
} from '@/class-variant/customClassVariants'
import { useProvideAvatarContext } from '@/components/avatar/avatar.context'
import type { AvatarProps } from '@/components/avatar/avatar.props'
import type { CreateAvatarStyle } from '@/components/avatar/avatar.style'
import { createAvatarStyle } from '@/components/avatar/avatar.style'
import { injectThemeProviderContext } from '@/components/theme-provider/themeProvider.context'
import { toComputedRefs } from '@/utils/props.util'

const props = withDefaults(defineProps<AvatarProps>(), {
  id: null,
  testId: null,
  classConfig: null,
  src: null,
  variant: null,
})

const {
  theme,
} = injectThemeProviderContext()

const avatarStyle = computed<CreateAvatarStyle>(
  () => createAvatarStyle({
    variant: props.variant ?? undefined,
  }),
)

const customClassConfig = computed<ResolvedClassConfig<'avatar'>>(
  () => getCustomComponentVariant('avatar', theme.value, {
    variant: props.variant,
  }),
)

useProvideAvatarContext({
  ...toComputedRefs(props),
  customClassConfig,
  style: avatarStyle,
})
</script>

<template>
  <RekavaAvatarRoot
    :class="avatarStyle.root({
      class: mergeClasses(customClassConfig.root, props.classConfig?.root),
    })"
  >
    <slot />
  </RekavaAvatarRoot>
</template>
