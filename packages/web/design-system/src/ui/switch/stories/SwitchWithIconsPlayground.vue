<script setup lang="ts">
import {
  CheckIcon,
  XCloseIcon,
} from '@wisemen/vue-core-icons'
import { ref } from 'vue'

import Switch from '@/ui/switch/Switch.vue'

const value = ref<boolean>(true)
</script>

<template>
  <div class="flex flex-wrap items-start gap-4">
    <Switch
      v-model="value"
      :icon-checked="CheckIcon"
      :icon-unchecked="XCloseIcon"
      label="With icons"
    />
  </div>
</template>
