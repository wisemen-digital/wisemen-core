<script setup lang="ts">
import { ref } from 'vue'

import TextField from '@/ui/text-field/TextField.vue'

const email = ref<string | null>(null)
const firstName = ref<string | null>(null)
const lastName = ref<string | null>(null)
const phone = ref<string | null>(null)
</script>

<template>
  <form
    class="flex max-w-md flex-col gap-4"
    @submit.prevent
  >
    <div class="flex gap-4">
      <TextField
        v-model="firstName"
        :is-required="true"
        class="flex-1"
        label="First Name"
        placeholder="John"
      />
      <TextField
        v-model="lastName"
        :is-required="true"
        class="flex-1"
        label="Last Name"
        placeholder="Doe"
      />
    </div>
    <TextField
      v-model="email"
      :is-required="true"
      hint="We'll never share your email"
      label="Email"
      placeholder="you@example.com"
      type="email"
    />
    <TextField
      v-model="phone"
      hint="Optional"
      label="Phone Number"
      placeholder="+1 (555) 123-4567"
      type="tel"
    />
  </form>
</template>
