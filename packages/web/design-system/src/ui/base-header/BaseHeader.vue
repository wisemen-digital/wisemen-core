<script setup lang="ts">
import {
  computed,
  useSlots,
} from 'vue'

import { UIAvatar } from '@/ui/avatar'
import { UIColumnLayout } from '@/ui/column-layout'
import { UIDot } from '@/ui/dot'
import { UIFeaturedIcon } from '@/ui/featured-icon'
import { UILogo } from '@/ui/logo'
import { UIRowLayout } from '@/ui/row-layout'
import { UIText } from '@/ui/text'

import type { BaseHeaderProps } from './baseHeader.props'

const props = withDefaults(defineProps<BaseHeaderProps>(), {
  left: null,
})

const slots: ReturnType<typeof useSlots> = useSlots()

const hasSubtitle = computed<boolean>(() => {
  return slots.subtitle !== undefined
})
</script>

<template>
  <UIRowLayout
    :align="hasSubtitle ? 'stretch' : 'center'"
    :gap="hasSubtitle ? 'xl' : 'lg'"
  >
    <template v-if="props.left !== null">
      <Component
        :is="props.left.icon"
        v-if="props.left.type === 'icon'"
        :class="{
          'size-6': hasSubtitle,
          'size-4': !hasSubtitle,
        }"
        class="shrink-0 self-center text-tertiary"
      />

      <UIFeaturedIcon
        v-else-if="props.left.type === 'featured-icon'"
        :icon="props.left.icon"
        :size="hasSubtitle ? 'xl' : 'md'"
        :color="props.left.color ?? 'gray'"
        class="self-center"
        variant="outline"
      />

      <UIAvatar
        v-else-if="props.left.type === 'avatar'"
        :name="props.left.name"
        :src="props.left.src ?? null"
        :logo-alt="props.left.imageAlt ?? null"
        :size="hasSubtitle ? 'md' : 'sm'"
        class="shrink-0 self-center"
      />

      <UIDot
        v-else-if="props.left.type === 'dot'"
        :color="props.left.color ?? 'gray'"
        class="shrink-0 self-center"
      />

      <UILogo
        v-else-if="props.left.type === 'logo'"
        :src="props.left.src"
        :alt="props.left.alt"
        :size="hasSubtitle ? 'md' : 'sm'"
        class="shrink-0 self-center"
      />
    </template>

    <UIColumnLayout
      gap="none"
      class="min-w-0 flex-1 overflow-hidden"
    >
      <UIRowLayout
        align="center"
        gap="sm"
        class="min-h-0 min-w-0 flex-1"
      >
        <UIText
          :text="props.title"
          as="h1"
          class="text-md font-semibold text-primary"
        />
        <slot name="title-end" />
      </UIRowLayout>

      <div class="flex min-h-0 flex-1 items-end">
        <slot name="subtitle" />
      </div>
    </UIColumnLayout>

    <UIRowLayout
      v-if="$slots.actions"
      gap="sm"
      class="shrink-0 self-center"
    >
      <slot name="actions" />
    </UIRowLayout>
  </UIRowLayout>
</template>
