<script setup lang="ts">
import { XCloseIcon } from '@wisemen/vue-core-icons'
import { DialogClose as RekaDialogClose } from 'reka-ui'
import { useI18n } from 'vue-i18n'

import { UIIconButton } from '@/ui/button/index'

const i18n = useI18n()
</script>

<template>
  <RekaDialogClose
    :as-child="true"
  >
    <UIIconButton
      :icon="XCloseIcon"
      :label="i18n.t('component.dialog.close')"
      class="absolute top-0 right-0 z-10 m-lg"
      variant="tertiary"
    />
  </RekaDialogClose>
</template>
