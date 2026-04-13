<script setup lang="ts">
import { DropdownMenuTrigger as RekaDropdownMenuTrigger } from 'reka-ui'
</script>

<template>
  <RekaDropdownMenuTrigger :as-child="true">
    <slot />
  </RekaDropdownMenuTrigger>
</template>
