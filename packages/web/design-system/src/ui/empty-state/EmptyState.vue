<script setup lang="ts">
import { UIColumnLayout } from '@/ui/column-layout'
import EmptyStateAction from '@/ui/empty-state/EmptyStateAction.vue'
import UIEmptyStateIllustrationBox from '@/ui/empty-state/illustrations/UIEmptyStateIllustrationBox.vue'
import UIEmptyStateIllustrationCloudSearch from '@/ui/empty-state/illustrations/UIEmptyStateIllustrationCloudSearch.vue'
import UIEmptyStateIllustrationCreditCard from '@/ui/empty-state/illustrations/UIEmptyStateIllustrationCreditCard.vue'
import UIEmptyStateIllustrationDocuments from '@/ui/empty-state/illustrations/UIEmptyStateIllustrationDocuments.vue'
import UIEmptyStateIllustrationRouteCard from '@/ui/empty-state/illustrations/UIEmptyStateIllustrationRouteCard.vue'
import { UIRowLayout } from '@/ui/row-layout'
import { UIText } from '@/ui/text'

import type { EmptyStateProps } from './emptyState.props'

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
      <EmptyStateAction
        v-if="props.secondaryAction !== null"
        :action="props.secondaryAction"
        variant="secondary"
      />
      <EmptyStateAction
        v-if="props.primaryAction !== null"
        :action="props.primaryAction"
      />
    </UIRowLayout>
  </UIColumnLayout>
</template>
