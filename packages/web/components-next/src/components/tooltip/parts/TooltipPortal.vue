<script setup lang="ts">
import { useInjectConfigContext } from '@/components/config-provider/config.context'

const configContext = useInjectConfigContext()
</script>

<template>
  <Teleport
    :defer="true"
    :to="configContext.teleportTargetSelector"
  >
    <slot />
  </Teleport>
</template>
