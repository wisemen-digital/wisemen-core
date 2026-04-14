<script setup lang="ts">
import { computed } from 'vue'

import Avatar from '@/ui/avatar/avatar/Avatar.vue'
import type { AvatarLabelProps } from '@/ui/avatar/avatar-label/avatarLabel.props'
import { AVATAR_LABEL_DEFAULTS } from '@/ui/avatar/avatar-label/avatarLabel.props'
import type { AvatarLabelStyle } from '@/ui/avatar/avatar-label/avatarLabel.style'
import { createAvatarLabelStyle } from '@/ui/avatar/avatar-label/avatarLabel.style'
import ColumnLayout from '@/ui/column-layout/ColumnLayout.vue'
import Text from '@/ui/text/Text.vue'

const props = withDefaults(defineProps<AvatarLabelProps>(), {
  ...AVATAR_LABEL_DEFAULTS,
})

const avatarLabelStyle = computed<AvatarLabelStyle>(
  () => createAvatarLabelStyle({
    size: props.size,
  }),
)
</script>

<template>
  <div :class="avatarLabelStyle.root()">
    <Avatar
      :logo="props.logo"
      :logo-alt="props.logoAlt"
      :name="props.name"
      :size="props.size"
      :src="props.src"
      :status="props.status"
    />
    <ColumnLayout
      :class="avatarLabelStyle.textContainer()"
      gap="none"
    >
      <Text
        :class="avatarLabelStyle.name()"
        :text="props.name"
      />
      <Text
        v-if="props.supportingText != null"
        :class="avatarLabelStyle.supportingText()"
        :text="props.supportingText"
      />
    </ColumnLayout>
  </div>
</template>
