<script setup lang="ts">
import Avatar from '@/ui/avatar/avatar/Avatar.vue'
import RowLayout from '@/ui/row-layout/RowLayout.vue'

const profileSrc = '../../../../storybook-assets/profile-picture.jpg'
const logoSrc = '../../../../storybook-assets/wisemen-logo.png'
</script>

<template>
  <RowLayout
    gap="xl"
    align="start"
  >
    <Avatar
      :logo="logoSrc"
      :src="profileSrc"
      name="Olivia Roy"
      size="xs"
    />
    <Avatar
      :logo="logoSrc"
      :src="profileSrc"
      name="Olivia Roy"
      size="sm"
    />
    <Avatar
      :logo="logoSrc"
      :src="profileSrc"
      name="Olivia Roy"
      size="md"
    />
    <Avatar
      :logo="logoSrc"
      :src="profileSrc"
      name="Olivia Roy"
      size="lg"
    />
    <Avatar
      :logo="logoSrc"
      :src="profileSrc"
      name="Olivia Roy"
      size="xl"
    />
    <Avatar
      :logo="logoSrc"
      :src="profileSrc"
      name="Olivia Roy"
      size="2xl"
    />
  </RowLayout>
</template>
