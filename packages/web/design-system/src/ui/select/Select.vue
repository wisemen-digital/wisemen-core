<script setup lang="ts" generic="TValue extends SelectValue | SelectValue[]">
import { ChevronDownIcon } from '@wisemen/vue-core-icons'
import {
  computed,
  useAttrs,
  useId,
} from 'vue'

import { useInput } from '@/composables/input.composable'
import {
  AUTOCOMPLETE_INPUT_DEFAULTS,
  INPUT_DEFAULTS,
  INPUT_FIELD_DEFAULTS,
  INPUT_META_DEFAULTS,
} from '@/types/input.type'
import { UIAvatar } from '@/ui/avatar'
import type { BadgeData } from '@/ui/badge/BadgeGroupTruncate.vue'
import BadgeGroupTruncate from '@/ui/badge/BadgeGroupTruncate.vue'
import { UIDot } from '@/ui/dot'
import FieldWrapper from '@/ui/field-wrapper/FieldWrapper.vue'
import InputWrapper from '@/ui/input-wrapper/InputWrapper.vue'
import type { MenuItemConfig } from '@/ui/menu-item/menuItem.type'
import { UIRowLayout } from '@/ui/row-layout'
import { useSelectValue } from '@/ui/select/composables/selectValue.composable'
import type {
  GetValue,
  SelectProps,
} from '@/ui/select/select.props'
import type { SelectValue } from '@/ui/select/select.type'
import { UIText } from '@/ui/text'

import SelectDropdown from './SelectDropdown.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SelectProps<TValue>>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  ...INPUT_FIELD_DEFAULTS,
  ...AUTOCOMPLETE_INPUT_DEFAULTS,
  disableSideFlip: true,
  iconRight: ChevronDownIcon,
  keepDropdownOpenOnSelect: null,
  limit: null,
  popoverAlign: 'center',
  popoverCollisionPadding: 8,
  popoverSide: 'bottom',
  popoverSideOffset: 4,
  popoverWidth: 'anchor-width',
  prioritizePosition: true,
  search: null,
  size: 'md',
})

const emit = defineEmits<{
  'blur': []
  'nextPage': []
  'update:search': [searchTerm: string]
}>()

const modelValue = defineModel<TValue>({
  required: true,
})

const id = props.id ?? useId()

const attrs = useAttrs()

const {
  isMultiple, valueLabel,
} = useSelectValue<TValue>(modelValue, props.displayFn)

const {
  isError,
  ariaBusy,
  ariaDescribedBy,
  ariaInvalid,
  ariaRequired,
} = useInput(id, props)

const selectedBadges = computed<BadgeData[]>(() => {
  if (!isMultiple(modelValue.value)) {
    return []
  }

  return modelValue.value.map((v) => {
    const config = props.getItemConfig?.(v as NonNullable<GetValue<TValue>>) ?? null

    return {
      avatar: config?.avatar != null
        ? {
            name: config.avatar.name,
            src: config.avatar.src ?? null,
          }
        : null,
      dot: config?.dot != null
        ? {
            color: config.dot.color ?? 'gray',
          }
        : null,
      icon: config?.icon ?? null,
      label: props.displayFn(v as NonNullable<GetValue<TValue>>),
    }
  })
})

const selectedOptionConfig = computed<MenuItemConfig | null>(() => {
  if (isMultiple(modelValue.value) || modelValue.value === null) {
    return null
  }

  return props.getItemConfig?.(modelValue.value as NonNullable<GetValue<TValue>>) ?? null
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
  >
    <template #label-left>
      <slot name="label-left" />
    </template>

    <template #label-right>
      <slot name="label-right" />
    </template>

    <FieldWrapper
      :icon-left="props.iconLeft"
      :icon-right="props.iconRight"
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
        <slot name="right" />
      </template>

      <UIRowLayout
        :class="{
          'px-md': props.size === 'md',
          'px-sm': props.size === 'sm',
        }"
        class="size-full overflow-hidden text-left"
      >
        <slot
          v-if="isMultiple(modelValue) ? modelValue.length > 0 : modelValue !== null"
          name="value"
        >
          <BadgeGroupTruncate
            v-if="isMultiple(modelValue)"
            :badges="selectedBadges"
            class="-ml-xs w-full"
            size="sm"
            color="gray"
            variant="translucent"
          />

          <UIRowLayout
            v-else
            align="center"
          >
            <UIAvatar
              v-if="selectedOptionConfig?.avatar != null"
              :name="selectedOptionConfig.avatar.name"
              :src="selectedOptionConfig.avatar.src"
              :image-alt="selectedOptionConfig.avatar.imageAlt"
              size="xxs"
            />

            <Component
              :is="selectedOptionConfig.icon"
              v-else-if="selectedOptionConfig?.icon != null"
              class="size-3.5 shrink-0 text-tertiary"
            />

            <UIDot
              v-else-if="selectedOptionConfig?.dot != null"
              :color="selectedOptionConfig.dot.color"
            />

            <UIText
              :text="valueLabel!"
              :class="{
                'text-disabled': props.isDisabled,
                'text-primary': !props.isDisabled,
              }"
              class="text-xs"
            />
          </UIRowLayout>
        </slot>

        <UIText
          v-else-if="props.placeholder !== null"
          :text="props.placeholder"
          class="text-xs text-disabled"
        />
      </UIRowLayout>

      <SelectDropdown
        v-model="modelValue!"
        v-bind="props"
        @blur="emit('blur')"
        @next-page="emit('nextPage')"
        @update:search="emit('update:search', $event)"
      >
        <template #trigger="{ isOpen }">
          <button
            v-bind="attrs"
            :id="id"
            :disabled="props.isDisabled"
            :aria-expanded="isOpen"
            :aria-busy="ariaBusy"
            :aria-describedby="ariaDescribedBy"
            :aria-invalid="ariaInvalid"
            :aria-required="ariaRequired"
            :aria-controls="`${id}-listbox`"
            role="combobox"
            class="
              absolute inset-0 size-full outline-none
              disabled:cursor-not-allowed
            "
            data-field-wrapper
          >
            <span class="sr-only">
              {{ valueLabel }}
            </span>
          </button>
        </template>
      </SelectDropdown>
    </FieldWrapper>
  </InputWrapper>
</template>
