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
import type {
  CustomView,
  UpdateCustomViewMeta,
} from '@/types/customView.type'
import { CUSTOM_VIEW_COLOR } from '@/types/customViewColor.type'
import { CUSTOM_VIEW_ICON } from '@/types/customViewIcon.type'

const props = defineProps<{
  view: CustomView
}>()

const emit = defineEmits<{
  save: [values: UpdateCustomViewMeta]
}>()

const form = useForm({
  initialState: () => ({
    ...props.view,
    icon: props.view.icon ?? CUSTOM_VIEW_ICON.ACTIVITY,
  }),
  schema: z.object({
    name: z.string().min(1).max(20),
    color: z.enum(CUSTOM_VIEW_COLOR),
    icon: z.enum(CUSTOM_VIEW_ICON),
  }),
  onSubmit: (values) => {
    emit('save', values)
  },
})

const i18n = useI18n()

const nameField = form.register('name')
const iconField = form.register('icon', CUSTOM_VIEW_ICON.ACTIVITY)
const colorField = form.register('color')
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
      </UIFormLayout>
    </UIDialogBody>

    <UIDialogFooter>
      <UIDialogFooterCancel />
      <UIDialogFooterSubmit :label="i18n.t('component.custom_view_update_dialog.submit')" />
    </UIDialogFooter>
  </UIFormDialog>
</template>
