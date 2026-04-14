<script setup lang="ts">
import AvatarLabel from '@/ui/avatar/avatar-label/AvatarLabel.vue'
import RowLayout from '@/ui/row-layout/RowLayout.vue'

const profileSrc = '../../../../storybook-assets/profile-picture.jpg'
</script>

<template>
  <RowLayout
    gap="2xl"
    align="start"
  >
    <AvatarLabel
      :src="profileSrc"
      name="Olivia Rhye"
      supporting-text="olivia@wisemen.digital"
      size="xs"
    />
    <AvatarLabel
      :src="profileSrc"
      name="Olivia Rhye"
      supporting-text="olivia@wisemen.digital"
      size="sm"
    />
    <AvatarLabel
      :src="profileSrc"
      name="Olivia Rhye"
      supporting-text="olivia@wisemen.digital"
      size="md"
    />
    <AvatarLabel
      :src="profileSrc"
      name="Olivia Rhye"
      supporting-text="olivia@wisemen.digital"
      size="lg"
    />
    <AvatarLabel
      :src="profileSrc"
      name="Olivia Rhye"
      supporting-text="olivia@wisemen.digital"
      size="xl"
    />
  </RowLayout>
</template>
