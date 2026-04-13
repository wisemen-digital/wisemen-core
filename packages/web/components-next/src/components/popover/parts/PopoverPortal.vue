<script setup lang="ts">
import { PopoverPortal } from 'reka-ui'

import { useInjectConfigContext } from '@/components/config-provider/config.context'

const configContext = useInjectConfigContext()
</script>

<template>
  <PopoverPortal :to="configContext.teleportTargetSelector">
    <slot />
  </PopoverPortal>
</template>
