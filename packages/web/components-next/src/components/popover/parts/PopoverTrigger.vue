<script setup lang="ts">
import { PopoverTrigger as RekaPopoverTrigger } from 'reka-ui'
</script>

<template>
  <RekaPopoverTrigger :as-child="true">
    <slot />
  </RekaPopoverTrigger>
</template>
