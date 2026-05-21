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

    if (results.length > 0) {
      const resolved = await adapter.getAddressByPlaceId(results[0]!.placeId)

      emit('update:modelValue', resolved)
    }
    else {
      emit('update:modelValue', {
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
      })
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
      flex items-center justify-between rounded-lg border border-secondary
      bg-secondary px-lg py-md
    "
  >
    <div class="flex flex-col gap-0.5">
      <UIText
        :text="mainText"
        class="text-sm text-primary"
      />
      <UIText
        :text="secondaryText"
        class="text-xs text-tertiary"
      />
    </div>

    <UIRowLayout>
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
            label="Edit address"
            size="sm"
            variant="tertiary"
          />
        </template>

        <template #content>
          <div class="w-96 p-xl">
            <UIForm
              :prompt-on-unsaved-changes="false"
              :form="form"
            >
              <UIColumnLayout gap="3xl">
                <UIFormFieldSet title="Edit manually">
                  <UIFormFieldGroup>
                    <UIFormFieldGrid
                      :lg="3"
                      :md="3"
                      :sm="3"
                    >
                      <UITextField
                        :is-required="true"
                        class="col-span-2"
                        v-bind="toFormField(streetField)"
                        label="Street"
                        placeholder="Street"
                      />
                      <UITextField
                        :is-required="true"
                        v-bind="toFormField(streetNumberField)"
                        label="Number"
                        placeholder="Number"
                      />
                    </UIFormFieldGrid>

                    <UIFormFieldGrid
                      :lg="2"
                      :md="2"
                      :sm="2"
                    >
                      <UITextField
                        v-bind="toFormField(busField)"
                        label="Bus"
                        placeholder="Buidling, apartment, etc"
                      />

                      <UITextField
                        :is-required="true"
                        v-bind="toFormField(postalCodeField)"
                        label="Postal code"
                        placeholder="Postal code"
                      />
                    </UIFormFieldGrid>

                    <UIFormFieldGrid
                      :lg="2"
                      :md="2"
                      :sm="2"
                    >
                      <UITextField
                        :is-required="true"
                        v-bind="toFormField(cityField)"
                        label="City"
                        placeholder="Brussels"
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
                        :prioritize-position="false"
                        popover-align="end"
                        label="Country"
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
                    label="Cancel"
                    variant="secondary"
                    @click="onCancel"
                  />
                  <UIFormSubmitButton
                    label="Save"
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
        label="Clear address"

        variant="tertiary"
        @click="emit('clear')"
      />
    </UIRowLayout>
  </div>
</template>
