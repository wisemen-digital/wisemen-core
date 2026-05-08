<script setup lang="ts">
import { UIButton } from '@/ui/button'
import { UIColumnLayout } from '@/ui/column-layout'
import { UIRowLayout } from '@/ui/row-layout'
import { UIText } from '@/ui/text'

import type { EmptyStateProps } from './emptyState.props'
import UIEmptyStateIllustrationBox from './illustrations/UIEmptyStateIllustrationBox.vue'
import UIEmptyStateIllustrationCloudSearch from './illustrations/UIEmptyStateIllustrationCloudSearch.vue'
import UIEmptyStateIllustrationCreditCard from './illustrations/UIEmptyStateIllustrationCreditCard.vue'
import UIEmptyStateIllustrationDocuments from './illustrations/UIEmptyStateIllustrationDocuments.vue'
import UIEmptyStateIllustrationRouteCard from './illustrations/UIEmptyStateIllustrationRouteCard.vue'

const props = withDefaults(defineProps<EmptyStateProps>(), {
  description: null,
  icon: null,
  illustration: null,
  primaryAction: null,
  secondaryAction: null,
})

const ILLUSTRATION_MAP = {
  'box': UIEmptyStateIllustrationBox,
  'cloud-search': UIEmptyStateIllustrationCloudSearch,
  'credit-card': UIEmptyStateIllustrationCreditCard,
  'documents': UIEmptyStateIllustrationDocuments,
  'route-card': UIEmptyStateIllustrationRouteCard,
}
</script>

<template>
  <UIColumnLayout
    align="center"
    justify="center"
    gap="2xl"
  >
    <Component
      :is="ILLUSTRATION_MAP[props.illustration]"
      v-if="props.illustration !== null"
    />
    <div
      v-else-if="props.icon !== null"
      class="
        flex size-10 shrink-0 items-center justify-center rounded-lg border
        border-primary
      "
    >
      <Component
        :is="props.icon"
        class="size-5 text-primary"
      />
    </div>
    <UIColumnLayout
      gap="xs"
      align="center"
    >
      <UIText
        :text="props.title"
        class="text-sm font-semibold"
      />
      <UIText
        v-if="props.description !== null"
        :truncate="false"
        :text="props.description"
        class="text-center text-xs text-tertiary"
      />
    </UIColumnLayout>
    <UIRowLayout>
      <UIButton
        v-if="props.secondaryAction !== null"
        :icon-left="props.secondaryAction?.iconLeft"
        :icon-right="props.secondaryAction?.iconRight"
        :label="props.secondaryAction.label"
        variant="secondary"
        @click="props.secondaryAction?.onClick"
      />
      <UIButton
        v-if="props.primaryAction !== null"
        :icon-left="props.primaryAction?.iconLeft"
        :icon-right="props.primaryAction?.iconRight"
        :label="props.primaryAction?.label"
        @click="props.primaryAction?.onClick"
      />
    </UIRowLayout>
  </UIColumnLayout>
</template>
