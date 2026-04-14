<script setup lang="ts">
import Link from '@/ui/button/link/Link.vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <Link
        :link="{ href: '#' }"
        label="Primary"
        variant="primary"
      />
      <Link
        :link="{ href: '#' }"
        label="Secondary"
        variant="secondary"
      />
      <Link
        :link="{ href: '#' }"
        label="Tertiary"
        variant="tertiary"
      />
    </div>
    <div class="flex items-center gap-2">
      <Link
        :link="{ href: '#' }"
        label="Destructive Primary"
        variant="destructive-primary"
      />
      <Link
        :link="{ href: '#' }"
        label="Destructive Tertiary"
        variant="destructive-tertiary"
      />
    </div>
  </div>
</template>
