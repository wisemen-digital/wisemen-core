<script setup lang="ts">
import type { AppearancePreference } from '#sections/appearance/appearancePreference.composable'

const props = defineProps<{
  label: string
  value: AppearancePreference
}>()

const modelValue = defineModel<AppearancePreference>({
  required: true,
})
</script>

<template>
  <label>
    <input
      v-model="modelValue"
      :value="props.value"
      :aria-label="props.label"
      :data-checked="modelValue === props.value || undefined"
      type="radio"
      class="peer sr-only"
    >

    <div
      class="
        group relative h-30 overflow-hidden rounded-xl border border-solid
        border-secondary ring-brand-500 ring-offset-1 ring-offset-white
        outline-offset-1 outline-transparent duration-300
        peer-focus-visible:ring-2
        peer-data-checked:ring-2
        dark:ring-offset-gray-950
      "
    >
      <div
        class="
          h-full duration-300 will-change-transform
          group-hover:scale-102
        "
      >
        <slot />
      </div>
    </div>

    <span class="mt-md inline-block truncate text-sm font-medium text-primary">
      {{ props.label }}
    </span>
  </label>
</template>
