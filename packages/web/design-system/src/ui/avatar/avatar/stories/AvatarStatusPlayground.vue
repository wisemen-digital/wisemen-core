<script setup lang="ts">
import Avatar from '@/ui/avatar/avatar/Avatar.vue'
import ColumnLayout from '@/ui/column-layout/ColumnLayout.vue'
import RowLayout from '@/ui/row-layout/RowLayout.vue'

const profileSrc = '../../../../storybook-assets/profile-picture.jpg'
</script>

<template>
  <ColumnLayout gap="xl">
    <RowLayout
      gap="xl"
      align="start"
    >
      <Avatar
        :src="profileSrc"
        name="Olivia Roy"
        size="xs"
        status="online"
      />
      <Avatar
        :src="profileSrc"
        name="Olivia Roy"
        size="sm"
        status="online"
      />
      <Avatar
        :src="profileSrc"
        name="Olivia Roy"
        size="md"
        status="online"
      />
      <Avatar
        :src="profileSrc"
        name="Olivia Roy"
        size="lg"
        status="online"
      />
      <Avatar
        :src="profileSrc"
        name="Olivia Roy"
        size="xl"
        status="online"
      />
      <Avatar
        :src="profileSrc"
        name="Olivia Roy"
        size="2xl"
        status="online"
      />
    </RowLayout>
    <RowLayout
      gap="xl"
      align="start"
    >
      <Avatar
        :src="profileSrc"
        name="Olivia Roy"
        size="md"
        status="online"
      />
      <Avatar
        :src="profileSrc"
        name="Olivia Roy"
        size="md"
        status="away"
      />
      <Avatar
        :src="profileSrc"
        name="Olivia Roy"
        size="md"
        status="busy"
      />
      <Avatar
        :src="profileSrc"
        name="Olivia Roy"
        size="md"
        status="offline"
      />
    </RowLayout>
  </ColumnLayout>
</template>
