<script setup lang="ts">
import { Primitive } from 'reka-ui'
</script>

<template>
  <Primitive
    :as-child="true"
    class="pointer-events-auto"
  >
    <slot />
  </Primitive>
</template>
