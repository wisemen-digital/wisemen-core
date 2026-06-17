<script setup lang="ts">
import {
  DotsVerticalIcon,
  PlusIcon,
  Settings01Icon,
} from '@wisemen/vue-core-icons'

import { UIBadge } from '@/ui/badge'
import { UIBaseHeader } from '@/ui/base-header'
import type { BaseHeaderLeftConfig } from '@/ui/base-header/baseHeader.type'
import {
  UIButton,
  UIIconButton,
} from '@/ui/button'
import { UIRowLayout } from '@/ui/row-layout'

interface HeaderVariant {
  title: string
  hasActions?: boolean
  hasSubtitle?: boolean
  hasTitleEnd?: boolean
  key: string
  left: BaseHeaderLeftConfig | null
}

const avatarSrc = '../../../storybook-assets/profile-picture.jpg'
const logoSrc = '../../../storybook-assets/wisemen-logo.png'

const headers: HeaderVariant[] = [
  {
    title: 'Default header',
    key: 'default',
    left: null,
  },
  {
    title: 'Icon header',
    key: 'icon',
    left: {
      icon: Settings01Icon,
      type: 'icon',
    },
  },
  {
    title: 'Featured icon header',
    hasSubtitle: true,
    key: 'featured-icon',
    left: {
      color: 'brand',
      icon: Settings01Icon,
      type: 'featured-icon',
    },
  },
  {
    title: 'Avatar header',
    key: 'avatar',
    left: {
      name: 'Olivia Roy',
      src: avatarSrc,
      type: 'avatar',
    },
  },
  {
    title: 'Dot header',
    key: 'dot',
    left: {
      color: 'success',
      type: 'dot',
    },
  },
  {
    title: 'Logo header',
    key: 'logo',
    left: {
      alt: 'Wisemen logo',
      src: logoSrc,
      type: 'logo',
    },
  },
  {
    title: 'Header with subtitle',
    hasSubtitle: true,
    key: 'subtitle',
    left: null,
  },
  {
    title: 'Header with title end',
    hasTitleEnd: true,
    key: 'title-end',
    left: null,
  },
  {
    title: 'Header with actions',
    hasActions: true,
    key: 'actions',
    left: null,
  },
  {
    title: 'Complete header',
    hasActions: true,
    hasSubtitle: true,
    hasTitleEnd: true,
    key: 'complete',
    left: {
      color: 'brand',
      icon: Settings01Icon,
      type: 'featured-icon',
    },
  },
]
</script>

<template>
  <div class="flex w-full max-w-3xl flex-col gap-xl">
    <div
      v-for="header in headers"
      :key="header.key"
      class="
        border-b border-secondary pb-xl
        last:border-b-0 last:pb-0
      "
    >
      <UIBaseHeader
        :title="header.title"
        :left="header.left"
      >
        <template
          v-if="header.hasTitleEnd"
          #title-end
        >
          <UIBadge
            color="success"
            label="Active"
            rounded="full"
            size="sm"
          />
        </template>

        <template
          v-if="header.hasSubtitle"
          #subtitle
        >
          <UIRowLayout
            gap="sm"
            class="mt-1"
          >
            <UIBadge
              color="brand"
              label="10 assets"
              size="sm"
            />

            <UIBadge
              color="gray"
              label="4 users"
              size="sm"
              variant="outline"
            />
          </UIRowLayout>
        </template>

        <template
          v-if="header.hasActions"
          #actions
        >
          <UIButton
            :icon-left="PlusIcon"
            label="Create"
            size="sm"
          />

          <UIIconButton
            :icon="DotsVerticalIcon"
            :is-tooltip-disabled="true"
            label="More options"
            size="sm"
            variant="tertiary"
          />
        </template>
      </UIBaseHeader>
    </div>
  </div>
</template>
