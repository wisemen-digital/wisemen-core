<script setup lang="ts">
import { ref } from 'vue'

import Switch from '@/ui/switch/Switch.vue'

const defaultValue = ref<boolean>(false)
const checkedValue = ref<boolean>(true)
const disabledUnchecked = ref<boolean>(false)
const disabledChecked = ref<boolean>(true)
const errorValue = ref<boolean>(false)
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <Switch
      v-model="defaultValue"
      label="Default"
    />
    <Switch
      v-model="checkedValue"
      label="Checked"
    />
    <Switch
      v-model="disabledUnchecked"
      :is-disabled="true"
      label="Disabled (Off)"
    />
    <Switch
      v-model="disabledChecked"
      :is-disabled="true"
      disabled-reason="This switch is disabled because..."
      label="Disabled (On)"
    />
    <Switch
      v-model="errorValue"
      error-message="This field has an error"
      label="Error"
    />
  </div>
</template>
