<script setup lang="ts">
/* eslint-disable @intlify/vue-i18n/no-raw-text */
import {
  ArrowRightIcon,
  LinkExternal01Icon,
  PlusIcon,
  Trash01Icon,
} from '@wisemen/vue-core-icons'

import Link from '@/ui/button/link/Link.vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Icon left
      </p>
      <div>
        <Link
          :icon-left="PlusIcon"
          :link="{ href: '#' }"
          label="Add Item"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Icon right
      </p>
      <div>
        <Link
          :icon-right="ArrowRightIcon"
          :link="{ href: '#' }"
          label="Continue"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Both icons
      </p>
      <div>
        <Link
          :icon-left="PlusIcon"
          :icon-right="ArrowRightIcon"
          :link="{ href: '#' }"
          label="Add and Continue"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        External link
      </p>
      <div>
        <Link
          :icon-right="LinkExternal01Icon"
          :link="{ href: 'https://example.com',
                   target: '_blank',
                   rel: 'noopener noreferrer' }"
          label="Visit Documentation"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Destructive with icon
      </p>
      <div class="flex items-center gap-2">
        <Link
          :icon-left="Trash01Icon"
          :link="{ href: '#' }"
          label="Delete Account"
          variant="destructive-primary"
        />
        <Link
          :icon-left="Trash01Icon"
          :link="{ href: '#' }"
          label="Delete Account"
          variant="destructive-tertiary"
        />
      </div>
    </div>
  </div>
</template>
