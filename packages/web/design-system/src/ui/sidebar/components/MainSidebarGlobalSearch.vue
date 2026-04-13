<script setup lang="ts">
import { SearchLgIcon } from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

import { UIIconButton } from '@/ui/button/index'

const emit = defineEmits<{
  click: []
}>()
const i18n = useI18n()

function onClick(): void {
  emit('click')
}
</script>

<template>
  <UIIconButton
    :icon="SearchLgIcon"
    :label="i18n.t('components.sidebar.global_search.label')"
    variant="tertiary"
    @click="onClick"
  />
</template>
