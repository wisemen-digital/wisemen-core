<script setup lang="ts">
import {
  DeleteIcon,
  Edit02Icon,
} from '@wisemen/vue-core-icons'
import { useForm } from 'formango'
import {
  computed,
  ref,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { z } from 'zod'

import type { Address } from '@/ui/address-autocomplete/addressAutocomplete.type'
import { useAddressAutocompleteCountry } from '@/ui/address-autocomplete/addressAutocompleteCountry.composable'
import {
  UIButton,
  UIIconButton,
} from '@/ui/button'
import { UIColumnLayout } from '@/ui/column-layout'
import { useInjectConfigContext } from '@/ui/config-provider'
import {
  UIFormFieldGrid,
  UIFormFieldGroup,
  UIFormFieldSet,
} from '@/ui/field'
import {
  UIForm,
  UIFormSubmitButton,
} from '@/ui/form'
import { UIPopover } from '@/ui/popover'
import { UIRowLayout } from '@/ui/row-layout'
import RowLayout from '@/ui/row-layout/RowLayout.vue'
import { UISelect } from '@/ui/select'
import { UIText } from '@/ui/text'
import { UITextField } from '@/ui/text-field'
import { toFormField } from '@/utils/toFormField.util'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isLoading?: boolean
  isReadonly?: boolean
  address: Address
  class?: string | null
}>(), {
  isDisabled: false,
  isLoading: false,
  isReadonly: false,
  class: null,
})

const emit = defineEmits<{
  'clear': []
  'error': [error: unknown]
  'update:modelValue': [address: Address]
}>()

const {
  t,
} = useI18n()

const configContext = useInjectConfigContext()

const form = useForm({
  initialState: {
    bus: props.address.bus,
    city: props.address.city,
    country: props.address.country,
    postalCode: props.address.postalCode,
    street: props.address.street,
    streetNumber: props.address.streetNumber,
  },
  schema: z.object({
    bus: z.string().nullable(),
    city: z.string(),
    country: z.string(),
    postalCode: z.string(),
    street: z.string(),
    streetNumber: z.string(),
  }),
  onSubmit: async (): Promise<void> => {
    await onSave()
  },
})

const busField = form.register('bus')
const cityField = form.register('city')
const countryField = form.register('country')
const postalCodeField = form.register('postalCode')
const streetField = form.register('street')
const streetNumberField = form.register('streetNumber')

const adapter = configContext.addressAutocompleteAdapter.value!

const {
  countryItems,
  currentCountryCode,
  displayCountry,
  getCountryItemConfig,
  onCountrySearch,
  onCountrySelect,
} = useAddressAutocompleteCountry(countryField)

const isEditOpen = ref(false)

watch(() => props.address, (address) => {
  busField.setValue(address.bus)
  cityField.setValue(address.city)
  countryField.setValue(address.country)
  postalCodeField.setValue(address.postalCode)
  streetField.setValue(address.street)
  streetNumberField.setValue(address.streetNumber)
})

watch(isEditOpen, (open) => {
  if (open) {
    busField.setValue(props.address.bus)
    cityField.setValue(props.address.city)
    countryField.setValue(props.address.country)
    postalCodeField.setValue(props.address.postalCode)
    streetField.setValue(props.address.street)
    streetNumberField.setValue(props.address.streetNumber)
  }
})

const mainText = computed<string>(() => {
  const parts = [
    props.address.street,
    props.address.streetNumber,
    props.address.bus,
  ].filter(Boolean)

  return parts.join(' ')
})

const secondaryText = computed<string>(() => {
  const locationParts = [
    props.address.postalCode,
    props.address.city,
  ].filter(Boolean)
  const location = locationParts.join(' ')
  const parts = [
    location,
    props.address.country,
  ].filter(Boolean)

  return parts.join(', ')
})

const isInteractionDisabled = computed<boolean>(() => props.isDisabled || props.isReadonly || props.isLoading)

async function onSave(): Promise<void> {
  try {
    const searchTerm = [
      `${streetField.modelValue.value} ${streetNumberField.modelValue.value}`,
      `${postalCodeField.modelValue.value} ${cityField.modelValue.value}`,
      countryField.modelValue.value,
    ]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(', ')

    const results = await adapter.searchAddresses(searchTerm)

    const manualAddress: Address = {
      placeId: null,
      bus: busField.modelValue.value ?? '',
      city: cityField.modelValue.value ?? '',
      coordinates: {
        lat: null,
        lng: null,
      },
      country: countryField.modelValue.value ?? '',
      postalCode: postalCodeField.modelValue.value ?? '',
      street: streetField.modelValue.value ?? '',
      streetNumber: streetNumberField.modelValue.value ?? '',
    }

    if (results.length > 0) {
      const resolved = await adapter.getAddressByPlaceId(results[0]!.placeId)

      emit('update:modelValue', {
        ...manualAddress,
        placeId: resolved.placeId,
        coordinates: resolved.coordinates,
      })
    }
    else {
      emit('update:modelValue', manualAddress)
    }

    isEditOpen.value = false
  }
  catch (error) {
    emit('error', error)
  }
}

function onCancel(): void {
  isEditOpen.value = false
}
</script>

<template>
  <div
    :class="props.class"
    class="
      flex max-w-full items-center justify-between gap-md rounded-lg border
      border-secondary bg-secondary px-lg py-md
    "
  >
    <div class="flex max-w-full flex-col gap-none overflow-hidden">
      <UIText
        :text="mainText"
        class="text-sm text-primary"
      />
      <UIText
        :text="secondaryText"
        class="text-xs text-tertiary"
      />
    </div>

    <UIRowLayout gap="xxs">
      <UIPopover
        v-model:is-open="isEditOpen"
        :popover-side-offset="8"
        popover-side="bottom"
        popover-align="end"
      >
        <template #trigger>
          <UIIconButton
            :icon="Edit02Icon"
            :is-disabled="isInteractionDisabled"
            :is-loading="props.isLoading"
            :label="t('component.address_autocomplete_selected_card.edit_address')"
            size="sm"
            variant="tertiary"
          />
        </template>

        <template #content>
          <div class="w-96 p-xl">
            <UIForm
              :is-unsaved-changes-prompt-enabled="false"
              :form="form"
            >
              <UIColumnLayout gap="3xl">
                <UIFormFieldSet :title="t('component.address_autocomplete_selected_card.edit_manually')">
                  <UIFormFieldGroup>
                    <UIFormFieldGrid
                      :lg="3"
                      :md="3"
                      :sm="3"
                    >
                      <UITextField
                        :is-required="true"
                        :label="t('component.address_autocomplete_selected_card.street.label')"
                        :placeholder="t('component.address_autocomplete_selected_card.street.placeholder')"
                        class="col-span-2"
                        v-bind="toFormField(streetField)"
                      />
                      <UITextField
                        :is-required="true"
                        :label="t('component.address_autocomplete_selected_card.number.label')"
                        :placeholder="t('component.address_autocomplete_selected_card.number.placeholder')"
                        v-bind="toFormField(streetNumberField)"
                      />
                    </UIFormFieldGrid>

                    <UIFormFieldGrid
                      :lg="2"
                      :md="2"
                      :sm="2"
                    >
                      <UITextField
                        :label="t('component.address_autocomplete_selected_card.bus.label')"
                        :placeholder="t('component.address_autocomplete_selected_card.bus.placeholder')"
                        v-bind="toFormField(busField)"
                      />

                      <UITextField
                        :is-required="true"
                        :label="t('component.address_autocomplete_selected_card.postal_code.label')"
                        :placeholder="t('component.address_autocomplete_selected_card.postal_code.placeholder')"
                        v-bind="toFormField(postalCodeField)"
                      />
                    </UIFormFieldGrid>

                    <UIFormFieldGrid
                      :lg="2"
                      :md="2"
                      :sm="2"
                    >
                      <UITextField
                        :is-required="true"
                        :label="t('component.address_autocomplete_selected_card.city.label')"
                        :placeholder="t('component.address_autocomplete_selected_card.city.placeholder')"
                        v-bind="toFormField(cityField)"
                      />

                      <UISelect
                        :is-required="true"
                        :model-value="currentCountryCode"
                        :items="countryItems"
                        :display-fn="displayCountry"
                        :get-item-config="getCountryItemConfig"
                        :error-message="countryField.isTouched.value
                          ? countryField.errors.value?.[0]?.message ?? null
                          : null"
                        :has-virtual-scroll="true"
                        :label="t('component.address_autocomplete_selected_card.country.label')"
                        :is-prioritized-position="false"
                        popover-align="end"
                        content-width-class="w-[20rem]"
                        search="remote"
                        popover-width="content-width"
                        @update:model-value="onCountrySelect"
                        @update:search="onCountrySearch"
                        @blur="countryField.onBlur"
                      />
                    </UIFormFieldGrid>
                  </UIFormFieldGroup>
                </UIFormFieldSet>

                <RowLayout
                  class="w-full"
                  justify="end"
                >
                  <UIButton
                    :label="t('component.address_autocomplete_selected_card.cancel')"
                    variant="secondary"
                    @click="onCancel"
                  />
                  <UIFormSubmitButton
                    :label="t('component.address_autocomplete_selected_card.save')"
                  />
                </RowLayout>
              </UIColumnLayout>
            </UIForm>
          </div>
        </template>
      </UIPopover>

      <UIIconButton
        :icon="DeleteIcon"
        :is-disabled="isInteractionDisabled"
        :label="t('component.address_autocomplete_selected_card.clear_address')"
        variant="tertiary"
        @click="emit('clear')"
      />
    </UIRowLayout>
  </div>
</template>
