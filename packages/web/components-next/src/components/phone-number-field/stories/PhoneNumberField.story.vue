<script setup lang="ts">
import PhoneNumberField from '@/components/phone-number-field/PhoneNumberField.vue'
</script>

<template>
  <Story title="Phone Number Field">
    <PhoneNumberField
      :model-value="null"
      class="w-72"
    />
  </Story>
</template>
