<script setup lang="ts" generic="TValue extends AutocompleteValue">
import { ChevronDownIcon } from '@wisemen/vue-core-icons'
import {
  ComboboxAnchor as RekaComboboxAnchor,
  ComboboxInput as RekaComboboxInput,
  ComboboxRoot as RekaComboboxRoot,
  ComboboxTrigger as RekaComboboxTrigger,
} from 'reka-ui'
import {
  computed,
  ref,
  useAttrs,
  useId,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { useInput } from '@/composables/input.composable'
import { useIsMobileViewport } from '@/composables/isMobileViewport.composable'
import {
  AUTOCOMPLETE_INPUT_DEFAULTS,
  INPUT_DEFAULTS,
  INPUT_FIELD_DEFAULTS,
  INPUT_META_DEFAULTS,
  omit,
} from '@/types/input.type'
import { useProvideAutocompleteContext } from '@/ui/autocomplete/autocomplete.context'
import type { AutocompleteProps } from '@/ui/autocomplete/autocomplete.props'
import { createAutocompleteStyle } from '@/ui/autocomplete/autocomplete.style'
import type { AutocompleteValue } from '@/ui/autocomplete/autocomplete.type'
import AutocompleteContent from '@/ui/autocomplete/AutocompleteContent.vue'
import { useRegisterAsDialogNestedLayer } from '@/ui/dialog/dialogNestedLayer.composable'
import FieldWrapper from '@/ui/field-wrapper/FieldWrapper.vue'
import InputWrapper from '@/ui/input-wrapper/InputWrapper.vue'
import type { ResponsiveDrawerProps } from '@/ui/responsive-drawer/responsiveDrawer.props'
import ResponsiveDrawer from '@/ui/responsive-drawer/ResponsiveDrawer.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<AutocompleteProps<TValue>>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  ...omit(INPUT_FIELD_DEFAULTS, 'iconRight'),
  ...AUTOCOMPLETE_INPUT_DEFAULTS,
  isPrioritizedPosition: true,
  isSideFlipDisabled: true,
  isTriggerHidden: true,
  getItemConfig: null,
  getItemKey: null,
  popoverAlign: 'center',
  popoverCollisionPadding: 8,
  popoverSide: 'bottom',
  popoverSideOffset: 4,
  popoverWidth: 'anchor-width',
  searchMode: 'remote',
  size: 'md',
})

const emit = defineEmits<{
  'blur': []
  'nextPage': []
  'update:search': [searchTerm: string]
}>()

const modelValue = defineModel<TValue | null>({
  required: true,
})

const id = props.id ?? useId()
const attrs = useAttrs()
const i18n = useI18n()

const isMobileDrawer = useIsMobileViewport()

const isOpen = ref<boolean>(false)

const drawerProps = computed<ResponsiveDrawerProps>(() => ({
  title: i18n.t('component.autocomplete.dropdown_title'),
}))

const {
  isError,
  ariaBusy,
  ariaDescribedBy,
  ariaInvalid,
  ariaRequired,
} = useInput(id, props)

const autocompleteStyle = computed(() => createAutocompleteStyle({
  size: props.size,
}))

function displayValueFn(value: TValue | null): string {
  if (value == null) {
    return ''
  }

  return props.displayFn(value as NonNullable<TValue>)
}

const valueLabel = computed<string>(() => displayValueFn(modelValue.value))

useRegisterAsDialogNestedLayer(isOpen)

function onOpenChange(isOpenValue: boolean): void {
  isOpen.value = isOpenValue

  if (!isOpenValue) {
    emit('blur')
  }
}

useProvideAutocompleteContext({
  getItemConfig: props.getItemConfig ?? null,
  size: computed(() => props.size),
})
</script>

<template>
  <InputWrapper
    :error-message="props.errorMessage"
    :is-disabled="props.isDisabled"
    :is-required="props.isRequired"
    :disabled-reason="props.disabledReason"
    :hint="props.hint"
    :help-text="props.helpText"
    :label="props.label"
    :class="props.class"
    :style="props.style"
    :for="id"
    :hide-error-message="props.hideErrorMessage"
    :is-error-message-hidden="props.isErrorMessageHidden"
  >
    <template #label-left>
      <slot name="label-left" />
    </template>

    <template #label-right>
      <slot name="label-right" />
    </template>

    <RekaComboboxRoot
      v-model="modelValue"
      v-model:open="isOpen"
      :display-value="displayValueFn"
      :ignore-filter="true"
      :open-on-click="props.items.length > 1"
      :disabled="props.isDisabled"
      class="block w-full"
      @update:open="onOpenChange"
    >
      <RekaComboboxAnchor class="block w-full">
        <FieldWrapper
          :icon-left="props.iconLeft"
          :icon-right="props.isTriggerHidden ? null : ChevronDownIcon"
          :is-loading="props.isLoading"
          :is-error="isError"
          :is-disabled="props.isDisabled"
          :is-readonly="props.isReadonly"
          :size="props.size"
        >
          <template #left>
            <slot name="left" />
          </template>

          <template #right>
            <RekaComboboxTrigger
              v-if="!props.isDisabled && !isMobileDrawer"
              class="absolute top-0 right-0 z-1 size-8 -translate-y-px"
            />
          </template>

          <template v-if="isMobileDrawer">
            <span
              :class="[autocompleteStyle.input(), { 'text-placeholder': valueLabel === '' }]"
              class="flex items-center truncate"
            >
              {{ valueLabel || props.placeholder }}
            </span>

            <RekaComboboxTrigger
              :as-child="true"
              :disabled="props.isDisabled"
            >
              <button
                v-bind="attrs"
                :id="id"
                :disabled="props.isDisabled"
                :aria-busy="ariaBusy"
                :aria-describedby="ariaDescribedBy"
                :aria-invalid="ariaInvalid"
                :aria-required="ariaRequired"
                type="button"
                class="
                  absolute inset-0 z-1 size-full outline-none
                  disabled:cursor-not-allowed
                "
                data-field-wrapper
              />
            </RekaComboboxTrigger>
          </template>

          <RekaComboboxInput
            v-else
            v-bind="attrs"
            :id="id"
            :display-value="displayValueFn"
            :name="props.name ?? undefined"
            :autocomplete="props.autocomplete ?? undefined"
            :placeholder="props.placeholder ?? undefined"
            :readonly="props.isReadonly"
            :disabled="props.isDisabled"
            :aria-describedby="ariaDescribedBy"
            :aria-required="ariaRequired"
            :aria-busy="ariaBusy"
            :aria-invalid="ariaInvalid"
            :class="autocompleteStyle.input()"
            data-field-wrapper
          />
        </FieldWrapper>
      </RekaComboboxAnchor>

      <ResponsiveDrawer
        v-if="isMobileDrawer"
        v-model:is-open="isOpen"
        v-bind="drawerProps"
      >
        <template #content>
          <AutocompleteContent
            :display-fn="props.displayFn"
            :get-item-key="props.getItemKey"
            :is-loading="props.isLoading"
            :items="props.items"
            :is-mobile-drawer="true"
            :search-mode="props.searchMode"
            @next-page="emit('nextPage')"
            @update:search="emit('update:search', $event)"
          />
        </template>
      </ResponsiveDrawer>

      <AutocompleteContent
        v-else
        :display-fn="props.displayFn"
        :get-item-key="props.getItemKey"
        :is-loading="props.isLoading"
        :items="props.items"
        :is-mobile-drawer="false"
        :popover-align="props.popoverAlign"
        :popover-align-offset="props.popoverAlignOffset"
        :popover-collision-padding="props.popoverCollisionPadding"
        :popover-side="props.popoverSide"
        :popover-side-offset="props.popoverSideOffset"
        :search-mode="props.searchMode"
        @next-page="emit('nextPage')"
        @update:search="emit('update:search', $event)"
      />
    </RekaComboboxRoot>
  </InputWrapper>
</template>
