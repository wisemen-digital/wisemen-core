<script setup lang="ts">
import {
  toFormField,
  UICheckbox,
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
import z from 'zod'
import { useI18n } from 'vue-i18n'

import CustomViewColorPicker from '@/components/CustomViewColorPicker.vue'
import CustomViewIconPicker from '@/components/CustomViewIconPicker.vue'
import type {
  CustomView,
  UpdateCustomViewMeta,
} from '@/types/customView.type'
import { CustomViewColor } from '@/types/customViewColor.type'
import { CustomViewIcon } from '@/types/customViewIcon.type'

const props = defineProps<{
  view: CustomView
}>()

const emit = defineEmits<{
  save: [values: UpdateCustomViewMeta]
}>()

const form = useForm({
  initialState: () => props.view,
  schema: z.object({
    isDefault: z.boolean(),
    name: z.string().min(1).max(20),
    color: z.enum(Object.values(CustomViewColor) as [CustomViewColor, ...CustomViewColor[]]),
    icon: z.enum(Object.values(CustomViewIcon) as [CustomViewIcon, ...CustomViewIcon[]]),
  }),
  onSubmit: (values) => {
    emit('save', values)
  },
})

const i18n = useI18n()

const nameField = form.register('name')
const iconField = form.register('icon', CustomViewIcon.ACTIVITY)
const colorField = form.register('color')
const isDefault = form.register('isDefault', false)
</script>

<template>
  <UIFormDialog
    :form="form"
    size="xs"
  >
    <UIDialogHeader
      :hide-description="true"
      :title="i18n.t('component.custom_view_update_dialog.title')"
      :description="i18n.t('component.custom_view_update_dialog.description')"
    />

    <UIDialogBody>
      <UIFormLayout>
        <UITextField
          v-bind="toFormField(nameField)"
          :is-required="true"
          :placeholder="i18n.t('component.custom_view_update_dialog.name_placeholder')"
          :label="i18n.t('component.custom_view_update_dialog.name_label')"
        />

        <UIRowLayout gap="2xl">
          <CustomViewIconPicker :field="iconField" />
          <CustomViewColorPicker :field="colorField" />
        </UIRowLayout>

        <UICheckbox
          v-bind="toFormField(isDefault)"
          :label="i18n.t('component.custom_view_update_dialog.is_default_label')"
          :hint="i18n.t('component.custom_view_update_dialog.is_default_hint')"
        />
      </UIFormLayout>
    </UIDialogBody>

    <UIDialogFooter>
      <UIDialogFooterCancel />
      <UIDialogFooterSubmit :label="i18n.t('component.custom_view_update_dialog.submit')" />
    </UIDialogFooter>
  </UIFormDialog>
</template>
