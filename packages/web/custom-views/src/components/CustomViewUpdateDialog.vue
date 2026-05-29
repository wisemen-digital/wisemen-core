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
      title="Update view"
      description="Give your view a name, icon and color"
    />

    <UIDialogBody>
      <UIFormLayout>
        <UITextField
          v-bind="toFormField(nameField)"
          :is-required="true"
          placeholder="Enter a name for your view"
          label="Name"
        />

        <UIRowLayout gap="2xl">
          <CustomViewIconPicker :field="iconField" />
          <CustomViewColorPicker :field="colorField" />
        </UIRowLayout>

        <UICheckbox
          v-bind="toFormField(isDefault)"
          label="Set as default"
          hint="This view will automatically be applied every time you visit this page."
        />
      </UIFormLayout>
    </UIDialogBody>

    <UIDialogFooter>
      <UIDialogFooterCancel />
      <UIDialogFooterSubmit label="Save" />
    </UIDialogFooter>
  </UIFormDialog>
</template>
