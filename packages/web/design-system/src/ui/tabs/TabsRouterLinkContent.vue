<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { RouterView } from 'vue-router'
</script>

<template>
  <Primitive
    :as-child="true"
    role="tabpanel"
  >
    <RouterView />
  </Primitive>
</template>
