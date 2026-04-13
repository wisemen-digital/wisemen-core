<script setup lang="ts">
import { ref } from 'vue'

import PasswordField from '@/components/password-field/PasswordField.vue'

const value = ref<string | null>(null)
</script>

<template>
  <Story title="Password">
    <PasswordField
      v-model="value"
      label="Password"
    />
  </Story>
</template>
