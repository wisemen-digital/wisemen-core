<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { UIClickableElement } from '@/ui/clickable-element'

const i18n = useI18n()
</script>

<template>
  <UIClickableElement>
    <a
      href="#main-content"
      class="
        absolute top-2 left-2 z-99 rounded-sm bg-primary p-xs text-sm
        text-primary
        not-focus-visible:sr-only
      "
    >
      {{ i18n.t('component.skip_to_main_content_link.label') }}
    </a>
  </UIClickableElement>
</template>
