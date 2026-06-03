<script setup lang="ts">
import { DotsVerticalIcon } from '@wisemen/vue-core-icons'
import { computed } from 'vue'

import { toComputedRefs } from '@/composables/context.composable'
import { UIActionDropdownMenu } from '@/ui/action-dropdown-menu/index'
import { useProvideBadgeContext } from '@/ui/badge/badge.context'
import type {
  BadgeColor,
  BadgeProps,
} from '@/ui/badge/badge.props'
import type { BadgeVariants } from '@/ui/badge/badge.style'
import { badgeVariants } from '@/ui/badge/badge.style'
import BadgeAvatar from '@/ui/badge/BadgeAvatar.vue'
import BadgeDot from '@/ui/badge/BadgeDot.vue'
import BadgeIcon from '@/ui/badge/BadgeIcon.vue'
import BadgeLabel from '@/ui/badge/BadgeLabel.vue'
import { UIClickableElement } from '@/ui/clickable-element/index'
import { UIRowLayout } from '@/ui/row-layout/index'

const props = withDefaults(defineProps<BadgeProps>(), {
  actions: undefined,
  ariaLabel: null,
  avatar: null,
  color: 'gray',
  dot: null,
  icon: null,
  label: null,
  metadata: undefined,
  models: undefined,
  rounded: 'default',
  size: 'md',
  variant: 'translucent',
})

const effectiveDotColor = computed<BadgeColor>(() => props.dot?.color ?? props.color)

const variants = computed<BadgeVariants>(() =>
  badgeVariants({
    color: props.color,
    rounded: props.rounded,
    size: props.size,
    variant: props.variant,
  }))

useProvideBadgeContext({
  ...toComputedRefs(props),
  effectiveDotColor,
  variants,
})
</script>

<template>
  <UIRowLayout
    :class="[variants.base(), props.actions != null && 'group relative']"
    :aria-label="props.ariaLabel"
    gap="xs"
    role="status"
  >
    <BadgeDot v-if="props.dot != null" />

    <slot>
      <BadgeAvatar
        v-if="props.avatar != null"
        :name="props.avatar.name"
        :src="props.avatar.src"
      />
      <BadgeIcon
        v-if="props.icon"
        :icon="props.icon"
      />
      <BadgeLabel
        v-if="props.label"
        :label="props.label"
      />
    </slot>

    <div
      v-if="props.actions != null"
      class="
        absolute inset-0 flex items-center justify-end bg-linear-to-l
        from-primary via-primary via-30% opacity-0 transition-opacity
        duration-100
        group-focus-within:opacity-100
        group-hover:opacity-100
        pointer-coarse:opacity-100
      "
    >
      <UIActionDropdownMenu
        :actions="props.actions"
        :models="props.models ?? []"
        :metadata="props.metadata"
        :current-context-only="true"
        popover-side="bottom"
        popover-align="end"
      >
        <UIClickableElement>
          <button
            :class="variants.actionsButton()"
          >
            <DotsVerticalIcon
              :class="variants.actionsIcon()"
            />
          </button>
        </UIClickableElement>
      </UIActionDropdownMenu>
    </div>
  </UIRowLayout>
</template>
