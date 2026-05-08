<script setup lang="ts">
import {
  computed,
  useSlots,
} from 'vue'

import { UIAvatar } from '@/ui/avatar'
import { UIColumnLayout } from '@/ui/column-layout'
import { UIDot } from '@/ui/dot'
import KeyboardShortcut from '@/ui/keyboard-shortcut/KeyboardShortcut.vue'
import type { MenuItemProps } from '@/ui/menu-item/menuItem.props'
import type { MenuItemStyle } from '@/ui/menu-item/menuItem.style'
import { createMenuItemStyle } from '@/ui/menu-item/menuItem.style'
import { UIRowLayout } from '@/ui/row-layout'
import { UIText } from '@/ui/text'

const props = withDefaults(defineProps<MenuItemProps>(), {
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
  >
    <UIRowLayout v-if="props.config.left != null">
      <UIAvatar
        v-if="props.config.left.type === 'avatar'"
        :name="props.config.left.name"
        :src="props.config.left.src"
        :image-alt="props.config.left.imageAlt"
        :size="props.config.description != null && props.config.description.layout !== 'inline' ? 'sm' : 'xs'"
      />

      <div
        v-if="props.config?.left?.type === 'image'"
        :class="style.iconWrapper()"
      >
        <img
          :alt="props.label"
          :src="props.config.left.src"
          :class="{
            'w-3.5': props.config.left.aspect === undefined || props.config.left.aspect === 'square',
            'h-3.5 w-5': props.config.left.aspect === 'rectangle',
          }"
          class="rounded-xxs object-contain"
        >
      </div>

      <div
        v-if="props.config?.left?.type === 'icon'"
        :class="style.iconWrapper()"
      >
        <Component
          :is="props.config.left.icon"
          class="size-3.5 text-tertiary"
        />
      </div>

      <div
        v-if="props.config?.left?.type === 'dot'"
        :class="style.dotWrapper()"
      >
        <UIDot :color="props.config.left.color ?? 'gray'" />
      </div>
    </UIRowLayout>
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
        <UIText
          v-if="props.config.right.type === 'text'"
          :text="props.config.right.text"
          class="min-w-0 text-xs text-disabled select-none"
        />

        <template v-else-if="props.config?.right?.type === 'icon-text'">
          <Component
            :is="props.config.right.icon"
            class="size-3.5 shrink-0 text-disabled"
          />
          <UIText
            :text="props.config.right.text"
            class="min-w-0 text-xs text-disabled select-none"
          />
        </template>

        <Component
          :is="props.config.right.icon"
          v-else-if="props.config?.right?.type === 'icon'"
          class="size-3.5 text-disabled"
        />

        <KeyboardShortcut
          v-else-if="props.config?.right?.type === 'shortcut'"
          :keyboard-shortcut="props.config.right.keyboardShortcut"
        />
      </template>
      <slot name="right" />
    </UIRowLayout>
  </UIRowLayout>
</template>
