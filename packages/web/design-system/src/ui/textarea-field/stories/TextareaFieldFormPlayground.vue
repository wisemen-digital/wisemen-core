<script setup lang="ts">
import { ref } from 'vue'

import TextField from '@/ui/text-field/TextField.vue'
import TextareaField from '@/ui/textarea-field/TextareaField.vue'

const subject = ref<string | null>(null)
const message = ref<string | null>(null)
</script>

<template>
  <form
    class="flex max-w-md flex-col gap-4"
    @submit.prevent
  >
    <TextField
      v-model="subject"
      :is-required="true"
      label="Subject"
      placeholder="Enter subject..."
    />
    <TextareaField
      v-model="message"
      :is-required="true"
      hint="Max 500 characters"
      label="Message"
      placeholder="Write your message..."
      resize="auto-vertical"
    />
  </form>
</template>
