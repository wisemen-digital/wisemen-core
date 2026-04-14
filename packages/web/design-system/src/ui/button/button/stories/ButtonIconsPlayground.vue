<script setup lang="ts">
/* eslint-disable @intlify/vue-i18n/no-raw-text */
import {
  ArrowRightIcon,
  PlusIcon,
  Trash01Icon,
} from '@wisemen/vue-core-icons'

import Button from '@/ui/button/button/Button.vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Icon left
      </p>
      <div>
        <Button
          :icon-left="PlusIcon"
          label="Add Item"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Icon right
      </p>
      <div>
        <Button
          :icon-right="ArrowRightIcon"
          label="Continue"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Both icons
      </p>
      <div>
        <Button
          :icon-left="PlusIcon"
          :icon-right="ArrowRightIcon"
          label="Add and Continue"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        With keyboard shortcut
      </p>
      <div>
        <Button
          keyboard-shortcut="⌘S"
          label="Save"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        With tooltip
      </p>
      <div class="flex items-center gap-2">
        <Button
          label="Hover me"
          tooltip-label="This is a helpful tooltip"
        />
        <Button
          :is-disabled="true"
          disabled-reason="You need permission to perform this action"
          label="Disabled"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Destructive with icon
      </p>
      <div class="flex items-center gap-2">
        <Button
          :icon-left="Trash01Icon"
          label="Delete"
          variant="destructive-primary"
        />
        <Button
          :icon-left="Trash01Icon"
          label="Delete"
          variant="destructive-tertiary"
        />
      </div>
    </div>
  </div>
</template>
