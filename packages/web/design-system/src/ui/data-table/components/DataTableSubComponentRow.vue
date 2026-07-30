<script setup lang="ts">
</script>

<template>
  <div
    class="
      col-span-full grid grid-cols-subgrid border-b border-secondary
      bg-secondary
    "
    role="row"
  >
    <div class="col-span-full p-xl">
      <slot />
    </div>
  </div>
</template>
