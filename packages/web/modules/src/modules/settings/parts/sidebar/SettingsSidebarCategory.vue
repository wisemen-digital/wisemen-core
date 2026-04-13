<script setup lang="ts">
const props = defineProps<{
  label: string
}>()
</script>

<template>
  <div>
    <span
      class="
        sticky top-0 z-20 inline-block w-full bg-secondary-subtle pb-xxs text-xs
        font-bold text-quaternary uppercase
      "
    >
      {{ props.label }}
    </span>

    <ul class="mt-md flex flex-col gap-y-sm">
      <slot />
    </ul>
  </div>
</template>
