<script setup lang="ts">
import Badge from '@/components/badge/Badge.vue'
</script>

<template>
  <Story title="Badge">
    <Badge
      :is-removable="true"
      variant="outline"
      color="brand"
      size="sm"
      icon="checkCircle"
    >
      Label
    </Badge>

    <Badge
      :is-removable="true"
      variant="translucent"
      color="brand"
      size="md"
      icon="checkCircle"
    >
      Label
    </Badge>

    <Badge
      :is-removable="true"
      variant="solid"
      color="brand"
      size="lg"
      icon="checkCircle"
    >
      Label
    </Badge>
  </Story>
</template>
