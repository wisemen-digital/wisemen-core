<script setup lang="ts">
import Button from '@/ui/button/button/Button.vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <Button
        label="Primary"
        variant="primary"
      />
      <Button
        label="Secondary"
        variant="secondary"
      />
      <Button
        label="Tertiary"
        variant="tertiary"
      />
      <Button
        label="Minimal Color"
        variant="minimal-color"
      />
    </div>
    <div class="flex items-center gap-2">
      <Button
        label="Destructive Primary"
        variant="destructive-primary"
      />
      <Button
        label="Destructive Secondary"
        variant="destructive-secondary"
      />
      <Button
        label="Destructive Tertiary"
        variant="destructive-tertiary"
      />
    </div>
  </div>
</template>
