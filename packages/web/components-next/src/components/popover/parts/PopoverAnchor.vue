<script setup lang="ts">
import { PopoverAnchor as RekaPopoverAnchor } from 'reka-ui'

import { useInjectPopoverContext } from '@/components/popover/popover.context'

const {
  popoverAnchorReferenceElement,
} = useInjectPopoverContext()
</script>

<template>
  <RekaPopoverAnchor
    :as-child="true"
    :reference="popoverAnchorReferenceElement ?? undefined"
  >
    <slot />
  </RekaPopoverAnchor>
</template>
