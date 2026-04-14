<script setup lang="ts">
import {
  computed,
  useAttrs,
} from 'vue'
import { RouterLink } from 'vue-router'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import { useProvideLinkContext } from '@/ui/button/link/link.context'
import type { LinkProps } from '@/ui/button/link/link.props'
import type { LinkStyle } from '@/ui/button/link/link.style'
import { createLinkStyle } from '@/ui/button/link/link.style'
import LinkIcon from '@/ui/button/link/LinkIcon.vue'
import { UIRowLayout } from '@/ui/row-layout/index'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<LinkProps>(), {
  iconLeft: null,
  iconRight: null,
  keyboardShortcut: null,
  link: null,
  size: 'md',
  to: null,
  tooltipLabel: null,
  tooltipSide: 'top',
  variant: 'primary',
})

const attrs = useAttrs()

if (props.link === null && props.to === null) {
  throw new Error('Either `link` or `to` must be provided.')
}

const component = computed<'a' | typeof RouterLink>(() => {
  if (props.to !== null) {
    return RouterLink
  }

  return 'a'
})

const linkAttributes = computed<Record<string, unknown>>(() => {
  if (props.to !== null) {
    return {
      to: props.to,
    }
  }

  if (props.link !== null) {
    return {
      href: props.link.href,
      rel: props.link.rel,
      target: props.link.target,
    }
  }

  return {}
})

const linkStyle = computed<LinkStyle>(() => createLinkStyle({
  class: attrs.class as string,
  size: props.size,
  variant: props.variant,
}))

useProvideLinkContext({
  linkStyle,
})
</script>

<template>
  <ActionTooltip
    :popover-side="props.tooltipSide"
    :is-disabled="props.tooltipLabel === null && props.keyboardShortcut === null"
    :label="props.tooltipLabel ?? props.label"
    :keyboard-shortcut="props.keyboardShortcut"
  >
    <!-- This component contains a lot of hacky code to get the glassy look working -->
    <Component
      :is="component"
      v-bind="{
        ...linkAttributes,
        ...attrs,
      }"
      :class="linkStyle.root()"
    >
      <div
        :class="linkStyle.container()"
      >
        <UIRowLayout
          :class="linkStyle.rowLayout()"
          gap="sm"
          justify="center"
        >
          <LinkIcon
            v-if="props.iconLeft !== null"
            :icon="props.iconLeft"
            :size="props.size"
            :variant="props.variant"
          />

          <span
            :class="linkStyle.label()"
          >
            {{ props.label }}
          </span>

          <LinkIcon
            v-if="props.iconRight !== null"
            :icon="props.iconRight"
            :size="props.size"
            :variant="props.variant"
          />
        </UIRowLayout>
      </div>
    </Component>
  </ActionTooltip>
</template>
