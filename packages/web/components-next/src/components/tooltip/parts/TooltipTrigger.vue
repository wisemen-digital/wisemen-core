<script setup lang="ts">
import { TooltipTrigger as RekaTooltipTrigger } from 'reka-ui'

import { useInjectTooltipContext } from '@/components/tooltip/tooltip.context'

const {
  popoverAnchorReferenceElement,
} = useInjectTooltipContext()
</script>

<template>
  <RekaTooltipTrigger
    :as-child="true"
    :reference="popoverAnchorReferenceElement ?? undefined"
  >
    <slot />
  </RekaTooltipTrigger>
</template>
