<script setup lang="ts">
import type { VcKeyboardShortcutProps } from '@wisemen/vue-core-components'
import {
  VcIconButton,
  VcKeyboardShortcut,
  VcKeyboardShortcutProvider,
  VcTextFieldIconLeft,
  VcTextFieldInput,
  VcTextFieldRoot,
} from '@wisemen/vue-core-components'
import {
  AnimatePresence,
  Motion,
} from 'motion-v'
import { ListboxFilter } from 'reka-ui'
import {
  computed,
  useId,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { useInjectSettingsContext } from '@/modules/settings/settings.context'

const {
  searchTerm,
} = useInjectSettingsContext()

const {
  t,
} = useI18n()
const id = useId()

const SHORTCUT_KEYS: VcKeyboardShortcutProps['keyboardKeys'] = [
  'meta',
  'f',
]

function onClearSearchTerm(): void {
  searchTerm.value = ''
}

const hasSearchTerm = computed<boolean>(() => searchTerm.value.trim().length > 0)
</script>

<template>
  <div class="p-3xl pb-0">
    <VcKeyboardShortcutProvider
      :keyboard-keys="SHORTCUT_KEYS"
      :prevent-default="true"
    >
      <label
        :for="id"
        class="sr-only"
      >
        {{ t('module.settings.search.placeholder') }}
      </label>

      <VcTextFieldRoot
        :id="id"
        v-model="searchTerm"
        :placeholder="t('module.settings.search.placeholder')"
        icon-left="search"
      >
        <VcTextFieldIconLeft />

        <ListboxFilter :as-child="true">
          <VcTextFieldInput />
        </ListboxFilter>

        <Motion
          :layout="true"
          :data-has-search="hasSearchTerm"
          :transition="{
            type: 'spring',
            bounce: 0.2,
            duration: 0.2,
          }"
        >
          <AnimatePresence>
            <VcIconButton
              v-if="hasSearchTerm"
              :label="t('module.settings.search.clear.label')"
              :class-config="{
                icon: 'size-4',
                root: 'size-7 shrink-0 rounded-[0.3rem]',
              }"
              class="mr-sm"
              icon="close"
              size="sm"
              variant="tertiary"
              @click="onClearSearchTerm"
            />

            <VcKeyboardShortcut
              v-else
              :keyboard-keys="SHORTCUT_KEYS"
              :class-config="{
                keyboardKey: {
                  key: 'bg-secondary shadow-none',
                },
              }"
              class="mr-md"
            />
          </AnimatePresence>
        </Motion>
      </VcTextFieldRoot>
    </VcKeyboardShortcutProvider>
  </div>
</template>
