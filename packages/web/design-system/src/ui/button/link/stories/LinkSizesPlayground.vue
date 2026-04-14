<script setup lang="ts">
import Link from '@/ui/button/link/Link.vue'
</script>

<template>
  <div class="flex items-center gap-2">
    <Link
      :link="{ href: '#' }"
      label="Extra Small"
      size="xs"
    />
    <Link
      :link="{ href: '#' }"
      label="Small"
      size="sm"
    />
    <Link
      :link="{ href: '#' }"
      label="Medium"
      size="md"
    />
    <Link
      :link="{ href: '#' }"
      label="Large"
      size="lg"
    />
  </div>
</template>
