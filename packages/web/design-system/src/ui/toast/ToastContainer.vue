<script setup lang="ts">
import 'vue-sonner/style.css'

import { Toaster } from 'vue-sonner'
</script>

<template>
  <Toaster
    :style="{
      zIndex: 75,
    }"
    :expand="false"
  />
</template>
