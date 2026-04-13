<script setup lang="ts">
import IconButton from '@/components/button/icon-button/IconButton.vue'
</script>

<template>
  <Story title="Button/Icon Button">
    <Variant title="Primary">
      <IconButton
        variant="primary"
        label="Button"
        icon="plus"
      />

      <IconButton
        :is-disabled="true"
        variant="primary"
        label="Button"
        icon="plus"
      />
    </Variant>
  </Story>
</template>
