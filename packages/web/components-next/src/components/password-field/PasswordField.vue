<script setup lang="ts">
import {
  computed,
  ref,
} from 'vue'
import { useI18n } from 'vue-i18n'

import IconButton from '@/components/button/icon-button/IconButton.vue'
import type { PasswordFieldProps } from '@/components/password-field/passwordField.props'
import TextField from '@/components/text-field/TextField.vue'
import type { Icon } from '@/icons/icons'

const props = defineProps<PasswordFieldProps>()

const modelValue = defineModel<string | null>({
  required: true,
})

const {
  t,
} = useI18n()

const isPasswordVisible = ref<boolean>(false)

const inputType = computed<'password' | 'text'>(() => {
  if (isPasswordVisible.value) {
    return 'text'
  }

  return 'password'
})

const toggleButtonIcon = computed<Icon>(() => {
  if (isPasswordVisible.value) {
    return 'eyeOff'
  }

  return 'eye'
})

const toggleButtonLabel = computed<string>(() => {
  if (isPasswordVisible.value) {
    return t('component.password_field.hide_password')
  }

  return t('component.password_field.show_password')
})

function togglePasswordVisibility(): void {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>

<template>
  <TextField
    v-bind="props"
    v-model="modelValue"
    :type="inputType"
  >
    <template #left>
      <slot name="left" />
    </template>

    <template #label>
      <slot name="label" />
    </template>

    <template #error>
      <slot name="error" />
    </template>

    <template #hint>
      <slot name="hint" />
    </template>

    <template #right>
      <IconButton
        :icon="toggleButtonIcon"
        :label="toggleButtonLabel"
        :is-disabled="props.isDisabled"
        :class-config="{
          icon: 'size-4',
          root: 'min-w-7 h-7 rounded-[0.3rem]',
        }"
        variant="tertiary"
        size="sm"
        class="mr-[0.3rem]"
        @click="togglePasswordVisibility"
      />
    </template>
  </TextField>
</template>
