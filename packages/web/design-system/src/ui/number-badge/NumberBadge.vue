<script setup lang="ts">
import { computed } from 'vue'

import type { NumberBadgeProps } from '@/ui/number-badge/numberBadge.props'
import type { NumberBadgeVariants } from '@/ui/number-badge/numberBadge.style'
import { numberBadgeVariants } from '@/ui/number-badge/numberBadge.style'
import { UIText } from '@/ui/text/index'

const props = withDefaults(defineProps<NumberBadgeProps>(), {
  ariaLabel: null,
  color: 'gray',
  size: 'md',
  variant: 'translucent',
})

const variants = computed<NumberBadgeVariants>(() =>
  numberBadgeVariants({
    color: props.color,
    size: props.size,
    variant: props.variant,
  }))
</script>

<template>
  <span
    :class="variants.base()"
    :aria-label="props.ariaLabel ?? undefined"
    role="status"
  >
    <UIText
      :text="props.value"
      :class="variants.label()"
    />
  </span>
</template>
