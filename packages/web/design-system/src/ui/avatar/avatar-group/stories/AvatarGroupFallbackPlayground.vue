<script setup lang="ts">
import type { AvatarProps } from '@/ui/avatar/avatar/avatar.props'
import AvatarGroup from '@/ui/avatar/avatar-group/AvatarGroup.vue'
import ColumnLayout from '@/ui/column-layout/ColumnLayout.vue'

const names = [
  'Olivia Rhye',
  'Alec Whitten',
  'Ava Wright',
  'Lori Bryson',
  'Lana Steiner',
  'Noah Pierre',
  'Amélie Laurent',
  'Owen Garcia',
  'Jackson Reed',
  'Courtney Turner',
  'Sophia Chen',
  'Marcus Johnson',
]

const avatars: AvatarProps[] = names.map((name) => ({
  name,
}))
</script>

<template>
  <ColumnLayout gap="2xl">
    <AvatarGroup
      :avatars="avatars"
      :max="8"
      size="xs"
    />
    <AvatarGroup
      :avatars="avatars"
      :max="8"
      size="sm"
    />
    <AvatarGroup
      :avatars="avatars"
      :max="8"
      size="md"
    />
  </ColumnLayout>
</template>
