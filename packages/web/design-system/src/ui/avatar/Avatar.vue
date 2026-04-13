<script setup lang="ts">
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from 'reka-ui'

const props = defineProps<{
  name: string
  src?: string | null
}>()

function getInitials(name: string): string {
  const nameParts = name.split(' ')
  const initials = nameParts.map((part) => part.charAt(0).toUpperCase())

  const firstTwoInitials = initials.slice(0, 2).join('')

  return firstTwoInitials
}
</script>

<template>
  <AvatarRoot
    :as-child="true"
  >
    <AvatarImage
      v-if="props.src"
      :src="props.src"
      class="
        aspect-square size-6 shrink-0 rounded-full border border-secondary
        object-cover
      "
      alt="Avatar"
    />
    <AvatarFallback
      class="
        flex aspect-square size-6 shrink-0 items-center justify-center
        rounded-full border border-secondary bg-tertiary text-xs font-semibold
        text-quaternary
      "
    >
      {{ getInitials(props.name) }}
    </AvatarFallback>
  </AvatarRoot>
</template>
