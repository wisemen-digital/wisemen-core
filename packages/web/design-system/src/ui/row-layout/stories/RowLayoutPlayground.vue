<script setup lang="ts">
/* eslint-disable @intlify/vue-i18n/no-raw-text */
import Button from '@/ui/button/button/Button.vue'
import type { RowLayoutProps } from '@/ui/row-layout/rowLayout.props'
import RowLayout from '@/ui/row-layout/RowLayout.vue'

const props = withDefaults(defineProps<{
  align?: RowLayoutProps['align']
  gap?: RowLayoutProps['gap']
  justify?: RowLayoutProps['justify']
}>(), {
  align: 'center',
  gap: 'md',
  justify: 'start',
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Interactive
      </p>
      <RowLayout
        :align="props.align"
        :gap="props.gap"
        :justify="props.justify"
      >
        <Button label="Waffles" />
        <Button
          label="Pancakes"
          variant="secondary"
        />
        <Button
          label="Croissants"
          variant="tertiary"
        />
      </RowLayout>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Space between
      </p>
      <RowLayout
        class="w-full"
        gap="lg"
        justify="between"
      >
        <Button label="Hello" />
        <Button
          label="Hi there"
          variant="secondary"
        />
        <Button
          label="Morning"
          variant="tertiary"
        />
      </RowLayout>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Center justified
      </p>
      <RowLayout
        class="w-full"
        gap="md"
        justify="center"
      >
        <Button label="Ping" />
        <Button
          label="Pong"
          variant="secondary"
        />
        <Button
          label="Boing"
          variant="tertiary"
        />
      </RowLayout>
    </div>
  </div>
</template>
