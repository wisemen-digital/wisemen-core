<script setup lang="ts">
/* eslint-disable @intlify/vue-i18n/no-raw-text */
import {
  PlusIcon,
  Settings01Icon,
  Trash01Icon,
} from '@wisemen/vue-core-icons'

import IconButton from '@/ui/button/icon/IconButton.vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Loading
      </p>
      <div class="flex items-center gap-2">
        <IconButton
          :icon="Settings01Icon"
          :is-loading="true"
          label="Loading"
          variant="primary"
        />
        <IconButton
          :icon="Settings01Icon"
          :is-loading="true"
          label="Loading"
          variant="secondary"
        />
        <IconButton
          :icon="Settings01Icon"
          :is-loading="true"
          label="Loading"
          variant="tertiary"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Disabled
      </p>
      <div class="flex items-center gap-2">
        <IconButton
          :icon="Settings01Icon"
          :is-disabled="true"
          label="Disabled"
          variant="primary"
        />
        <IconButton
          :icon="Settings01Icon"
          :is-disabled="true"
          label="Disabled"
          variant="secondary"
        />
        <IconButton
          :icon="Settings01Icon"
          :is-disabled="true"
          label="Disabled"
          variant="tertiary"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        With tooltip
      </p>
      <div>
        <IconButton
          :icon="PlusIcon"
          label="Add item"
          tooltip-label="Click to add a new item"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        With keyboard shortcut
      </p>
      <div>
        <IconButton
          :icon="Settings01Icon"
          keyboard-shortcut="⌘,"
          label="Open Settings"
          tooltip-label="Settings"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Destructive
      </p>
      <div class="flex items-center gap-2">
        <IconButton
          :icon="Trash01Icon"
          label="Delete"
          variant="destructive-primary"
        />
        <IconButton
          :icon="Trash01Icon"
          label="Delete"
          variant="destructive-tertiary"
        />
      </div>
    </div>
  </div>
</template>
