<script setup lang="ts">
import { UIIconButton } from '@wisemen/vue-core-design-system'
import { XCloseIcon } from '@wisemen/vue-core-icons'
import { DialogClose } from 'reka-ui'
</script>

<template>
  <DialogClose :as-child="true">
    <UIIconButton
      :keyboard-shortcut-keys="['escape']"
      :icon="XCloseIcon"
      variant="tertiary"
      label="Close preferences"
    />
  </DialogClose>
</template>
