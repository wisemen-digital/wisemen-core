<script setup lang="ts">
import { DropdownMenuPortal as RekaDropdownMenuPortal } from 'reka-ui'

import { useInjectConfigContext } from '@/components/config-provider/config.context'

const configContext = useInjectConfigContext()
</script>

<template>
  <RekaDropdownMenuPortal :to="configContext.teleportTargetSelector">
    <slot />
  </RekaDropdownMenuPortal>
</template>
