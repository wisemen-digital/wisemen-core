<script setup lang="ts">
import {
  computed,
  useSlots,
} from 'vue'

import { UIColumnLayout } from '@/ui/column-layout'
import type { MenuItemProps } from '@/ui/menu-item/menuItem.props'
import type { MenuItemStyle } from '@/ui/menu-item/menuItem.style'
import { createMenuItemStyle } from '@/ui/menu-item/menuItem.style'
import MenuItemLeftAvatar from '@/ui/menu-item/MenuItemLeftAvatar.vue'
import MenuItemLeftDot from '@/ui/menu-item/MenuItemLeftDot.vue'
import MenuItemLeftIcon from '@/ui/menu-item/MenuItemLeftIcon.vue'
import MenuItemLeftImage from '@/ui/menu-item/MenuItemLeftImage.vue'
import MenuItemRightIcon from '@/ui/menu-item/MenuItemRightIcon.vue'
import MenuItemRightIconText from '@/ui/menu-item/MenuItemRightIconText.vue'
import MenuItemRightShortcut from '@/ui/menu-item/MenuItemRightShortcut.vue'
import MenuItemRightText from '@/ui/menu-item/MenuItemRightText.vue'
import { UIRowLayout } from '@/ui/row-layout'
import { UIText } from '@/ui/text'

const props = withDefaults(defineProps<MenuItemProps>(), {
  isDisabled: false,
  config: null,
  size: 'md',
})

const slots = useSlots()

const hasLeftContent = computed<boolean>(() => props.config?.left != null)

const hasRightContent = computed<boolean>(() =>
  props.config?.right != null || slots.right != null)

const hasBlockDescription = computed<boolean>(() =>
  props.config?.description?.layout === 'block')

const style = computed<MenuItemStyle>(() => createMenuItemStyle({
  hasLeftContent: hasLeftContent.value,
  hasRightContent: hasRightContent.value,
  isDisabled: props.isDisabled,
  size: props.size,
}))
</script>

<template>
  <UIRowLayout
    v-if="props.config === null"
    :class="style.base()"
  >
    <UIText
      :text="props.label"
      :class="{
        'text-xs': props.size === 'sm',
        'text-sm': props.size === 'md',
      }"
      class="shrink-0 text-secondary select-none"
    />
  </UIRowLayout>

  <UIRowLayout
    v-else
    :class="[
      style.base(),
      hasBlockDescription && 'py-xs',
    ]"
    :gap="props.size === 'md' ? 'sm' : 'xs'"
  >
    <template v-if="props.config.left != null">
      <MenuItemLeftAvatar
        v-if="props.config.left.type === 'avatar'"
        :left="props.config.left"
        :has-block-description="hasBlockDescription"
      />
      <MenuItemLeftImage
        v-else-if="props.config.left.type === 'image'"
        :left="props.config.left"
        :alt="props.label"
        :size="props.size"
        :has-block-description="hasBlockDescription"
      />
      <MenuItemLeftIcon
        v-else-if="props.config.left.type === 'icon'"
        :left="props.config.left"
        :size="props.size"
        :has-block-description="hasBlockDescription"
      />
      <MenuItemLeftDot
        v-else-if="props.config.left.type === 'dot'"
        :left="props.config.left"
        :size="props.size"
        :has-block-description="hasBlockDescription"
      />
    </template>
    <UIRowLayout
      :class="props.config.description?.layout === 'inline' && props.config.description != null
        ? 'min-w-0 overflow-hidden'
        : 'shrink-0'"
      align="center"
      gap="sm"
      class="flex-1"
    >
      <UIRowLayout
        v-if="props.config?.description?.layout === 'inline' && props.config.description != null"
        align="baseline"
        gap="xs"
        class="min-w-0 overflow-hidden"
      >
        <UIText
          :text="props.label"
          :class="{
            'text-xs': props.size === 'sm',
            'text-sm': props.size === 'md',
          }"
          class="shrink-0 text-secondary select-none"
        />
        <UIText
          :text="props.config.description.value"
          class="min-w-0 truncate text-xs text-disabled select-none"
        />
      </UIRowLayout>

      <UIColumnLayout
        v-else
        gap="none"
      >
        <UIText
          :text="props.label"
          :class="{
            'text-xs': props.size === 'sm',
            'text-sm': props.size === 'md',
          }"
          class="text-secondary select-none"
        />

        <UIText
          v-if="props.config?.description != null"
          :text="props.config.description.value"
          :truncate="2"
          class="text-xs text-disabled select-none"
        />
      </UIColumnLayout>
    </UIRowLayout>

    <UIRowLayout
      align="center"
      gap="sm"
      class="min-w-0"
    >
      <template v-if="props.config.right != null">
        <MenuItemRightText
          v-if="props.config.right.type === 'text'"
          :right="props.config.right"
        />
        <MenuItemRightIconText
          v-else-if="props.config.right.type === 'icon-text'"
          :right="props.config.right"
        />
        <MenuItemRightIcon
          v-else-if="props.config.right.type === 'icon'"
          :right="props.config.right"
        />
        <MenuItemRightShortcut
          v-else-if="props.config.right.type === 'shortcut'"
          :right="props.config.right"
        />
      </template>
      <slot name="right" />
    </UIRowLayout>
  </UIRowLayout>
</template>
