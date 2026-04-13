<script setup lang="ts">
import { Separator } from 'reka-ui'
import { computed } from 'vue'

import type { SeparatorProps } from '@/ui/separator/separator.props'
import type { SeparatorStyle } from '@/ui/separator/separator.style'
import { createSeparatorStyle } from '@/ui/separator/separator.style'

const props = withDefaults(defineProps<SeparatorProps>(), {
  orientation: 'horizontal',
})

const seperatorStyle = computed<SeparatorStyle>(() => createSeparatorStyle({
  orientation: props.orientation,
}))
</script>

<template>
  <Separator
    :class="seperatorStyle.separator({
      class: props.class,
    })"
    :orientation="props.orientation"
    role="presentation"
  />
</template>
