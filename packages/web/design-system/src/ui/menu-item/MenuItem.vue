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
  label: null,
  size: 'md',
})

const slots = useSlots()

const resolvedLabel = computed<string | null>(() => props.config?.label ?? props.label ?? null)

const hasLeftContent = computed<boolean>(() =>
  props.config?.avatar != null || props.config?.icon != null || props.config?.dot != null)

const hasRightContent = computed<boolean>(() =>
  props.config?.right != null || slots.right != null)

const style = computed<MenuItemStyle>(() => createMenuItemStyle({
  hasLeftContent: hasLeftContent.value,
  hasRightContent: hasRightContent.value,
  size: props.size,
}))
</script>

<template>
  <UIRowLayout
    :class="style.base()"
    justify="between"
  >
    <UIRowLayout
      :class="props.config?.descriptionLayout === 'inline' && props.config.description != null
        ? 'min-w-0 overflow-hidden'
        : 'shrink-0'"
      align="center"
      gap="lg"
    >
      <UIAvatar
        v-if="props.config?.avatar != null"
        :name="props.config.avatar.name"
        :src="props.config.avatar.src"
        :image-alt="props.config.avatar.imageAlt"
        :size="props.config.description ? 'sm' : 'xs'"
      />

      <div
        v-else-if="props.config?.icon != null"
        :class="style.iconWrapper()"
      >
        <Component
          :is="props.config.icon"
          class="size-3.5 text-tertiary"
        />
      </div>

      <div
        v-else-if="props.config?.dot != null"
        :class="style.dotWrapper()"
      >
        <UIDot :color="props.config.dot.color ?? 'gray'" />
      </div>

      <UIRowLayout
        v-if="props.config?.descriptionLayout === 'inline' && props.config.description != null"
        align="baseline"
        gap="xs"
        class="min-w-0 overflow-hidden"
      >
        <UIText
          v-if="resolvedLabel !== null"
          :text="resolvedLabel"
          :class="{
            'text-xs': props.size === 'sm',
            'text-sm': props.size === 'md',
          }"
          class="shrink-0 text-secondary select-none"
        />
        <UIText
          :text="props.config.description"
          class="min-w-0 truncate text-xs text-disabled select-none"
        />
      </UIRowLayout>

      <UIColumnLayout
        v-else
        gap="none"
      >
        <UIText
          v-if="resolvedLabel !== null"
          :text="resolvedLabel"
          :class="{
            'text-xs': props.size === 'sm',
            'text-sm': props.size === 'md',
          }"
          class="text-secondary select-none"
        />

        <UIText
          v-if="props.config?.description != null"
          :text="props.config.description"
          class="text-xs text-disabled select-none"
        />
      </UIColumnLayout>
    </UIRowLayout>

    <UIRowLayout
      align="center"
      gap="sm"
      class="min-w-0"
    >
      <UIText
        v-if="props.config?.right?.type === 'text'"
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

      <slot name="right" />
    </UIRowLayout>
  </UIRowLayout>
</template>
