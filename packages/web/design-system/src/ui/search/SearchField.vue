<script setup lang="ts">
import { useHotkey } from '@tanstack/vue-hotkeys'
import {
  SearchLgIcon,
  XCloseIcon,
} from '@wisemen/vue-core-icons'
import { StringUtil } from '@wisemen/vue-core-utils'
import {
  AnimatePresence,
  Motion,
} from 'motion-v'
import {
  useId,
  useTemplateRef,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { UIIconButton } from '@/ui/button'
import type { Search } from '@/ui/search/search.composable'
import { UITextField } from '@/ui/text-field'

const props = defineProps<{
  search: Search
}>()

const textFieldRef = useTemplateRef('textField')

const id = useId()
const i18n = useI18n()

useHotkey('Meta+F', () => {
  textFieldRef.value?.input?.focus()
}, {
  preventDefault: true,
})
</script>

<template>
  <UITextField
    :id="id"
    ref="textField"
    :model-value="props.search.search.value"
    :placeholder="i18n.t('component.search_input.placeholder')"
    :icon-left="SearchLgIcon"
    :aria-label=" i18n.t('component.search_input.placeholder') "
    size="sm"
    class="w-44"
    @update:model-value="(value) => props.search.updateSearch(value ?? '')"
  >
    <template #right>
      <AnimatePresence :initial="false">
        <Motion
          v-if="!StringUtil.isEmpty(props.search.search.value)"
          :transition="{
            duration: 0.2,
            type: 'spring',
            bounce: 0,
          }"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          class="mr-xxs flex items-center justify-center"
        >
          <UIIconButton
            :label="i18n.t('component.search_input.clear')"
            :icon="XCloseIcon"
            variant="tertiary"
            size="xs"
            @click="props.search.clear()"
          />
        </Motion>
      </AnimatePresence>
    </template>
  </UITextField>
</template>
