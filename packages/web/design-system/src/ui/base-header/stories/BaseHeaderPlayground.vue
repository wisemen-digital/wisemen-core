<script setup lang="ts">
import {
  DotsVerticalIcon,
  PlusIcon,
  Settings01Icon,
} from '@wisemen/vue-core-icons'
import { computed } from 'vue'

import { UIBadge } from '@/ui/badge'
import { UIBaseHeader } from '@/ui/base-header'
import type { BaseHeaderLeftConfig } from '@/ui/base-header/baseHeader.type'
import {
  UIButton,
  UIIconButton,
} from '@/ui/button'
import { UIRowLayout } from '@/ui/row-layout'

type BaseHeaderLeftVariant = 'avatar' | 'dot' | 'featured-icon' | 'icon' | 'logo' | 'none'

const props = withDefaults(defineProps<{
  title?: string
  hasActions?: boolean
  hasSubtitle?: boolean
  hasTitleEnd?: boolean
  leftVariant?: BaseHeaderLeftVariant
}>(), {
  title: 'Project settings',
  hasActions: false,
  hasSubtitle: false,
  hasTitleEnd: false,
  leftVariant: 'none',
})

const avatarSrc = '../../../storybook-assets/profile-picture.jpg'
const logoSrc = '../../../storybook-assets/wisemen-logo.png'

const left = computed<BaseHeaderLeftConfig | null>(() => {
  switch (props.leftVariant) {
    case 'avatar':
      return {
        name: 'Olivia Roy',
        src: avatarSrc,
        type: 'avatar',
      }
    case 'dot':
      return {
        color: 'success',
        type: 'dot',
      }
    case 'featured-icon':
      return {
        color: 'brand',
        icon: Settings01Icon,
        type: 'featured-icon',
      }
    case 'icon':
      return {
        icon: Settings01Icon,
        type: 'icon',
      }
    case 'logo':
      return {
        alt: 'Wisemen logo',
        src: logoSrc,
        type: 'logo',
      }
    case 'none':
      return null
  }

  return null
})
</script>

<template>
  <div class="w-full max-w-3xl">
    <UIBaseHeader
      :title="props.title"
      :left="left"
    >
      <template
        v-if="props.hasTitleEnd"
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
        v-if="props.hasSubtitle"
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
        v-if="props.hasActions"
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
</template>
