<script setup lang="ts">
import AvatarLabel from '@/ui/avatar/avatar-label/AvatarLabel.vue'
import ColumnLayout from '@/ui/column-layout/ColumnLayout.vue'
import RowLayout from '@/ui/row-layout/RowLayout.vue'

const profileSrc = '../../../../storybook-assets/profile-picture.jpg'
const logoSrc = '../../../../storybook-assets/wisemen-logo.png'
</script>

<template>
  <ColumnLayout gap="2xl">
    <RowLayout
      gap="2xl"
      align="start"
    >
      <AvatarLabel
        :src="profileSrc"
        name="Olivia Rhye"
        supporting-text="olivia@wisemen.digital"
        size="md"
        status="online"
      />
      <AvatarLabel
        :src="profileSrc"
        name="Olivia Rhye"
        supporting-text="olivia@wisemen.digital"
        size="md"
        status="away"
      />
      <AvatarLabel
        :src="profileSrc"
        name="Olivia Rhye"
        supporting-text="olivia@wisemen.digital"
        size="md"
        status="busy"
      />
      <AvatarLabel
        :src="profileSrc"
        name="Olivia Rhye"
        supporting-text="olivia@wisemen.digital"
        size="md"
        status="offline"
      />
    </RowLayout>
    <RowLayout
      gap="2xl"
      align="start"
    >
      <AvatarLabel
        :logo="logoSrc"
        :src="profileSrc"
        name="Olivia Rhye"
        supporting-text="olivia@wisemen.digital"
        size="md"
      />
      <AvatarLabel
        name="Olivia Rhye"
        supporting-text="olivia@wisemen.digital"
        size="md"
      />
    </RowLayout>
  </ColumnLayout>
</template>
