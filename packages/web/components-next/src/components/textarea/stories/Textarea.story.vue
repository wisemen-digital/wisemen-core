<script setup lang="ts">
import Textarea from '@/components/textarea/Textarea.vue'
</script>

<template>
  <Story title="Textarea">
    <Textarea
      :model-value="null"
      :class-config="{ }"
      :is-required="true"
      label="Textarea"
      placeholder="Enter your text here..."
      hint="You can enter quite a lot of text here."
      resize="auto-vertical"
      class="w-96"
    >
    <template #bottom>
      <div class="p-lg pt-0">
        hier
      </div>
    </template>
    </Textarea>
  </Story>
</template>
