<script setup lang="ts" generic="TValue extends BaseFileInfo | null | BaseFileInfo[]">
import {
  PlusIcon,
  XCloseIcon,
} from '@wisemen/vue-core-icons'
import {
  AnimatePresence,
  Motion,
  MotionConfig,
} from 'motion-v'
import {
  computed,
  useAttrs,
  useId,
} from 'vue'
import { useI18n } from 'vue-i18n'

import {
  INPUT_DEFAULTS,
  INPUT_META_DEFAULTS,
} from '@/types/input.type'
import { UIAnimateHeight } from '@/ui/animate-height'
import type {
  BaseFileInfo,
  BaseFileUploadRejectedFile,
} from '@/ui/base-file-upload'
import {
  UIBaseFileUploadClipboard,
  UIBaseFileUploadClipboardRemove,
  UIBaseFileUploadClipboardUpload,
  UIBaseFileUploadDropzone,
  UIBaseFileUploadRoot,
  UIBaseFileUploadTrigger,
} from '@/ui/base-file-upload'
import {
  UIButton,
  UIIconButton,
} from '@/ui/button'
import { UIColumnLayout } from '@/ui/column-layout'
import type { FormFileUploadProps } from '@/ui/form-file-upload/formFileUpload.props'
import type { FormFileUploadErrorLabels } from '@/ui/form-file-upload/formFileUpload.util'
import {
  getFormFileUploadErrorMessage,
  pickFormFileUploadTriggerAttrs,
} from '@/ui/form-file-upload/formFileUpload.util'
import { UIInputWrapper } from '@/ui/input-wrapper'
import { UIRowLayout } from '@/ui/row-layout'
import { useToast } from '@/ui/toast'

import FormFileUploadDropzoneOverlay from './parts/FormFileUploadDropzoneOverlay.vue'
import FormFileUploadEmptyState from './parts/FormFileUploadEmptyState.vue'
import FormFileUploadImage from './parts/FormFileUploadImage.vue'
import FormFileUploadList from './parts/FormFileUploadList.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<FormFileUploadProps>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  isPublic: false,
  isValidFile: null,
  preprocess: null,
})

const modelValue = defineModel<TValue>({
  required: true,
})

const attrs = useAttrs()
const i18n = useI18n()
const id = props.id ?? useId()
const toast = useToast()

const isMultiple = computed<boolean>(() => Array.isArray(modelValue.value))
const triggerAttrs = computed<Record<string, unknown>>(() => pickFormFileUploadTriggerAttrs(attrs))
const errorLabels = computed<FormFileUploadErrorLabels>(() => ({
  invalidType: i18n.t('component.form_file_upload.error.invalid_type'),
  preprocessingFailed: i18n.t('component.form_file_upload.error.preprocessing_failed'),
  uploadFailed: i18n.t('component.form_file_upload.error.upload_failed'),
}))

function onFilesRejected(files: BaseFileUploadRejectedFile[]): void {
  for (const file of files) {
    toast.show({
      title: file.file.name,
      message: getFormFileUploadErrorMessage(file.error, errorLabels.value),
    })
  }
}

function fileToUrl(file: File): string {
  return URL.createObjectURL(file)
}
</script>

<template>
  <MotionConfig
    :transition="{
      duration: 0.3,
      type: 'spring',
      bounce: 0,
    }"
  >
    <UIBaseFileUploadRoot
      v-slot="{ items }"
      v-model="modelValue"
      :accept="props.accept"
      :disabled-reason="props.disabledReason"
      :is-disabled="props.isDisabled"
      :is-public="props.isPublic"
      :is-valid-file="props.isValidFile"
      :preprocess="props.preprocess"
      @files-rejected="onFilesRejected"
    >
      <UIInputWrapper
        :error-message="props.errorMessage"
        :is-disabled="props.isDisabled"
        :is-required="props.isRequired"
        :disabled-reason="props.disabledReason"
        :hint="props.hint"
        :label="props.label"
        :class="props.class"
        :style="props.style"
        :for="id"
        :help-text="props.helpText"
        :hide-error-message="props.hideErrorMessage"
      >
        <template #label-left>
          <slot name="label-left" />
        </template>

        <template #label-right>
          <div class="relative ml-auto size-4">
            <AnimatePresence :initial="false">
              <Motion
                v-if="items.length > 0 && isMultiple"
                :initial="{ opacity: 0 }"
                :animate="{ opacity: 1 }"
                :exit="{ opacity: 0 }"
                class="absolute top-1/2 right-0 -translate-y-1/2"
              >
                <UIBaseFileUploadTrigger v-slot="{ isDisabled }">
                  <UIIconButton
                    v-bind="triggerAttrs"
                    :id="id"
                    :icon="PlusIcon"
                    :is-disabled="isDisabled"
                    :label="i18n.t('component.form_file_upload.action.add_files')"
                    size="xs"
                    variant="tertiary"
                  />
                </UIBaseFileUploadTrigger>
              </Motion>
            </AnimatePresence>
          </div>
        </template>

        <UIBaseFileUploadDropzone v-slot="{ isHoveringOverPage, isHoveringOverDropzone }">
          <div class="relative">
            <FormFileUploadDropzoneOverlay
              :is-hovering-over-page="isHoveringOverPage"
              :is-hovering-over-dropzone="isHoveringOverDropzone"
            />

            <UIAnimateHeight>
              <FormFileUploadList
                v-if="items.length > 0"
                :items="items"
              />

              <FormFileUploadEmptyState
                v-else
                :id="id"
                :is-hovering-over-dropzone="isHoveringOverDropzone"
                :is-multiple="isMultiple"
                :description="props.description"
                :trigger-attrs="triggerAttrs"
              />
            </UIAnimateHeight>

            <UIBaseFileUploadClipboard v-slot="{ files }">
              <AnimatePresence>
                <Motion
                  v-if="files[0] !== undefined"
                  :initial="{
                    opacity: 0,
                    y: 10,
                  }"
                  :animate="{
                    opacity: 1,
                    y: 0,
                  }"
                  :exit="{
                    opacity: 0,
                    y: 10,
                  }"
                  :transition="{
                    duration: 0.3,
                    type: 'spring',
                    bounce: 0,
                  }"
                  class="
                    absolute bottom-3 left-1/2 w-[95%] -translate-x-1/2
                    translate-y-full overflow-hidden rounded-xl border
                    border-tertiary bg-primary p-sm pr-md shadow-lg/5
                  "
                >
                  <UIRowLayout
                    justify="between"
                    class="overflow-hidden"
                  >
                    <UIRowLayout class="overflow-hidden">
                      <FormFileUploadImage
                        :src="fileToUrl(files[0])"
                        :is-zoom-enabled="true"
                        :alt="files[0].name"
                        fit="cover"
                        class="size-8 shrink-0 rounded-md"
                      />

                      <UIColumnLayout
                        gap="none"
                        class="overflow-hidden"
                      >
                        <span class="text-xs font-medium text-primary">
                          {{ i18n.t('component.form_file_upload.clipboard.title') }}
                        </span>

                        <span
                          class="max-w-full truncate text-xxs/4 text-tertiary"
                        >
                          {{ files[0].name }}
                        </span>
                      </UIColumnLayout>
                    </UIRowLayout>

                    <UIRowLayout gap="xs">
                      <UIBaseFileUploadClipboardUpload>
                        <UIButton
                          :label="i18n.t('component.form_file_upload.action.upload')"
                          size="sm"
                          variant="secondary"
                        />
                      </UIBaseFileUploadClipboardUpload>

                      <UIBaseFileUploadClipboardRemove>
                        <UIIconButton
                          :icon="XCloseIcon"
                          :label="i18n.t('component.form_file_upload.action.hide_clipboard_suggestion')"
                          variant="tertiary"
                          size="sm"
                        />
                      </UIBaseFileUploadClipboardRemove>
                    </UIRowLayout>
                  </UIRowLayout>
                </Motion>
              </AnimatePresence>
            </UIBaseFileUploadClipboard>
          </div>
        </UIBaseFileUploadDropzone>
      </UIInputWrapper>
    </UIBaseFileUploadRoot>
  </MotionConfig>
</template>
