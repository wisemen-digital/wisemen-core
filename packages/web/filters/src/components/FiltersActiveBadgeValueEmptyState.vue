<script setup lang="ts">
import { UIText } from '@wisemen/vue-core-design-system'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
</script>

<template>
  <UIText
    :aria-label="i18n.t('component.filters.no_value')"
    text="..."
    class="text-xs text-placeholder"
  />
</template>
