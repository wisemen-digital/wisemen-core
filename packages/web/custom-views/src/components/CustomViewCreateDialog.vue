<script setup lang="ts">
import {
  toFormField,
  UIDialogBody,
  UIDialogFooter,
  UIDialogFooterCancel,
  UIDialogFooterSubmit,
  UIDialogHeader,
  UIFormDialog,
  UIFormLayout,
  UIRowLayout,
  UITextField,
} from '@wisemen/vue-core-design-system'
import { useForm } from 'formango'
import { useI18n } from 'vue-i18n'
import z from 'zod'

import CustomViewColorPicker from '@/components/CustomViewColorPicker.vue'
import CustomViewIconPicker from '@/components/CustomViewIconPicker.vue'
import type { CreateCustomViewMeta } from '@/types/customView.type'
import { CustomViewColor } from '@/types/customViewColor.type'
import { CustomViewIcon } from '@/types/customViewIcon.type'

const emit = defineEmits<{
  save: [values: CreateCustomViewMeta]
}>()

const i18n = useI18n()

const form = useForm({
  schema: z.object({
    name: z.string().min(1).max(20),
    color: z.enum(CustomViewColor),
    icon: z.enum(CustomViewIcon),
  }),
  onSubmit: (values) => {
    emit('save', values)
  },
})

const nameField = form.register('name', 'Untitled')
const iconField = form.register('icon', CustomViewIcon.LAYERS)
const colorField = form.register('color', CustomViewColor.DEFAULT)
</script>

<template>
  <UIFormDialog
    :form="form"
    size="xs"
  >
    <UIDialogHeader
      :title="i18n.t('component.custom_view_create_dialog.title')"
      :description="i18n.t('component.custom_view_create_dialog.description')"
    />

    <UIDialogBody>
      <UIFormLayout>
        <UITextField
          v-bind="toFormField(nameField)"
          :is-required="true"
          :placeholder="i18n.t('component.custom_view_create_dialog.name_placeholder')"
          :label="i18n.t('component.custom_view_create_dialog.name_label')"
        />

        <UIRowLayout gap="2xl">
          <CustomViewIconPicker :field="iconField" />
          <CustomViewColorPicker :field="colorField" />
        </UIRowLayout>
      </UIFormLayout>
    </UIDialogBody>

    <UIDialogFooter>
      <UIDialogFooterCancel />
      <UIDialogFooterSubmit :label="i18n.t('component.custom_view_create_dialog.submit')" />
    </UIDialogFooter>
  </UIFormDialog>
</template>
