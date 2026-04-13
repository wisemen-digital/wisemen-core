<script setup lang="ts">
import { ref } from 'vue'

import Switch from '@/components/switch/Switch.vue'

const value = ref<boolean>(true)
</script>

<template>
  <Story title="Switch">
    <Switch
      v-model="value"
      :errors="['error']"
      :is-touched="true"
      size="sm"
      label="Label"
      hint="This is a switch."
      icon-checked="check"
    />
  </Story>
</template>
