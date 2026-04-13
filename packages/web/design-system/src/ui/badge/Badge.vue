<script setup lang="ts">
import { computed } from 'vue'

import { toComputedRefs } from '@/composables/context.composable'
import { useProvideBadgeContext } from '@/ui/badge/badge.context'
import type {
  BadgeColor,
  BadgeProps,
} from '@/ui/badge/badge.props'
import type { BadgeVariants } from '@/ui/badge/badge.style'
import { badgeVariants } from '@/ui/badge/badge.style'
import BadgeDot from '@/ui/badge/BadgeDot.vue'
import BadgeIcon from '@/ui/badge/BadgeIcon.vue'
import BadgeLabel from '@/ui/badge/BadgeLabel.vue'
import { UIRowLayout } from '@/ui/row-layout/index'

const props = withDefaults(defineProps<BadgeProps>(), {
  hasDot: false,
  ariaLabel: null,
  color: 'gray',
  dotColor: null,
  icon: null,
  label: null,
  rounded: 'default',
  size: 'md',
  variant: 'translucent',
})

const effectiveDotColor = computed<BadgeColor>(() => props.dotColor ?? props.color)

const variants = computed<BadgeVariants>(() =>
  badgeVariants({
    color: props.color,
    rounded: props.rounded,
    size: props.size,
    variant: props.variant,
  }))

useProvideBadgeContext({
  ...toComputedRefs(props),
  effectiveDotColor,
  variants,
})
</script>

<template>
  <UIRowLayout
    :class="variants.base()"
    :aria-label="props.ariaLabel"
    gap="xs"
    role="status"
  >
    <BadgeDot v-if="props.hasDot" />

    <slot>
      <BadgeIcon
        v-if="props.icon"
        :icon="props.icon"
      />
      <BadgeLabel
        v-if="props.label"
        :label="props.label"
      />
    </slot>
  </UIRowLayout>
</template>
