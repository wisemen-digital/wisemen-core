<script setup lang="ts">
import { createAction } from '@wisemen/vue-core-actions'
import {
  Edit01Icon,
  Settings01Icon,
  Trash01Icon,
} from '@wisemen/vue-core-icons'

import type { BadgeColor } from '@/ui/badge/badge.props'
import Badge from '@/ui/badge/Badge.vue'
import BadgeGroup from '@/ui/badge/BadgeGroup.vue'

const props = withDefaults(defineProps<{
  hasDot?: boolean
  isDisabled?: boolean
  color?: BadgeColor
  label?: string | null
  rounded?: 'default' | 'full'
  size?: 'lg' | 'md' | 'sm'
  variant?: 'outline' | 'solid' | 'translucent'
}>(), {
  hasDot: false,
  isDisabled: false,
  color: 'gray',
  label: 'Badge',
  rounded: 'default',
  size: 'md',
  variant: 'translucent',
})

const actions = [
  createAction({
    id: 'badge-edit',
    name: () => 'Edit',
    availableWhenUnauthenticated: true,
    execute: () => {},
    icon: () => Edit01Icon,
  }),
  createAction({
    id: 'badge-settings',
    name: () => 'Settings',
    availableWhenUnauthenticated: true,
    execute: () => {},
    icon: () => Settings01Icon,
  }),
  createAction({
    id: 'badge-delete',
    name: () => 'Delete',
    availableWhenUnauthenticated: true,
    execute: () => {},
    icon: () => Trash01Icon,
  }),
]

const colors: BadgeColor[] = [
  'gray',
  'brand',
  'blue',
  'pink',
  'error',
  'success',
  'warning',
  'purple',
  'neutral',
]

const variants: Array<'solid' | 'translucent'> = [
  'translucent',
  'solid',
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Interactive
      </p>
      <div>
        <Badge
          :color="props.color"
          :dot="props.hasDot ? {} : null"
          :is-disabled="props.isDisabled"
          :label="props.label"
          :rounded="props.rounded"
          :size="props.size"
          :variant="props.variant"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Sizes
      </p>
      <div class="flex items-center gap-3">
        <Badge
          :color="props.color"
          :variant="props.variant"
          label="Small"
          size="sm"
        />
        <Badge
          :color="props.color"
          :variant="props.variant"
          label="Medium"
          size="md"
        />
        <Badge
          :color="props.color"
          :variant="props.variant"
          label="Large"
          size="lg"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Rounded
      </p>
      <div class="flex items-center gap-3">
        <Badge
          :color="props.color"
          :variant="props.variant"
          label="Default"
          rounded="default"
        />
        <Badge
          :color="props.color"
          :variant="props.variant"
          label="Full"
          rounded="full"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        With dot
      </p>
      <div class="flex items-center gap-3">
        <Badge
          :color="props.color"
          :variant="props.variant"
          :dot="{
            color: 'pink',
          }"
          label="With dot"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        With icon
      </p>
      <div class="flex items-center gap-3">
        <Badge
          :color="props.color"
          :variant="props.variant"
          :icon="Settings01Icon"
          label="With icon"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        With avatar
      </p>
      <div class="flex items-center gap-3">
        <Badge
          :color="props.color"
          :variant="props.variant"
          :avatar="{ name: 'John Doe' }"
          label="With avatar"
        />
        <Badge
          :color="props.color"
          :variant="props.variant"
          :avatar="{
            name: 'John Doe',
            src: 'https://i.pravatar.cc/150?img=3',
          }"
          label="With avatar image"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Disabled
      </p>
      <div class="flex items-center gap-3">
        <Badge
          :color="props.color"
          :variant="props.variant"
          :icon="Settings01Icon"
          :is-disabled="true"
          label="Disabled"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        With icon color override
      </p>
      <div class="flex items-center gap-3">
        <Badge
          :color="props.color"
          :variant="props.variant"
          :icon="Settings01Icon"
          icon-color="error"
          label="Icon color override"
        />
        <Badge
          :variant="props.variant"
          :left="{ icon: Settings01Icon,
                   color: 'error',
                   type: 'icon' }"
          color="gray"
          label="Gray badge, colored icon"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        With left config
      </p>
      <div class="flex items-center gap-3">
        <Badge
          :color="props.color"
          :variant="props.variant"
          :left="{
            icon: Settings01Icon,
            color: 'purple',
            type: 'icon',
          }"
          label="Left icon"
        />
        <Badge
          :color="props.color"
          :variant="props.variant"
          :left="{ color: 'pink',
                   type: 'dot' }"
          label="Left dot"
        />
        <Badge
          :color="props.color"
          :variant="props.variant"
          :left="{ name: 'John Doe',
                   type: 'avatar' }"
          label="Left avatar"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Badge group
      </p>
      <BadgeGroup>
        <Badge
          v-for="colorItem in colors"
          :key="colorItem"
          :color="colorItem"
          :variant="props.variant"
          :label="colorItem"
        />
      </BadgeGroup>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        With actions
      </p>
      <div class="flex items-center gap-6">
        <Badge
          :color="props.color"
          :variant="props.variant"
          :actions="actions"
          label="With actions"
        />
        <Badge
          :color="props.color"
          :variant="props.variant"
          :actions="actions"
          label="Small"
          size="sm"
        />
        <Badge
          :color="props.color"
          :variant="props.variant"
          :actions="actions"
          label="Large"
          size="lg"
        />
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <p class="text-sm font-medium text-secondary">
        All colors &amp; variants
      </p>
      <div
        v-for="variantItem in variants"
        :key="variantItem"
        class="flex flex-col gap-2"
      >
        <p class="text-xs text-tertiary">
          {{ variantItem }}
        </p>
        <div class="flex items-center gap-3">
          <Badge
            v-for="colorItem in colors"
            :key="colorItem"
            :color="colorItem"
            :variant="variantItem"
            :label="colorItem"
          />
        </div>
      </div>
    </div>
  </div>
</template>
