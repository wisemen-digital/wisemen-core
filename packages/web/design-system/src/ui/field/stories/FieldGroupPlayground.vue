<script setup lang="ts">
import { ref } from 'vue'

import {
  UIFormFieldGrid,
  UIFormFieldGroup,
  UIFormFieldSet,
  UIFormLayout,
} from '@/ui/field'
import { UINumberField } from '@/ui/number-field'
import TextField from '@/ui/text-field/TextField.vue'

const firstName = ref<string | null>(null)
const lastName = ref<string | null>(null)
const email = ref<string | null>(null)
const phone = ref<string | null>(null)
</script>

<template>
  <UIFormLayout class="w-full">
    <UIFormFieldSet
      :is-stacked="true"
      title="Personal information"
    >
      <UIFormFieldGroup>
        <UIFormFieldGrid
          :sm="1"
          :lg="2"
        >
          <TextField
            v-model="firstName"
            label="First name"
            placeholder="Jane"
          />
          <TextField
            v-model="lastName"
            label="Last name"
            placeholder="Doe"
          />
        </UIFormFieldGrid>

        <UIFormFieldGrid
          :sm="1"
          :lg="1"
        >
          <TextField
            v-model="email"
            label="Email address"
            placeholder="jane.doe@example.com"
            type="email"
          />
        </UIFormFieldGrid>

        <UIFormFieldGrid
          :sm="1"
          :lg="2"
        >
          <UINumberField
            :model-value="null"
            placeholder="28"
            label="Age"
          />
        </UIFormFieldGrid>
      </UIFormFieldGroup>
    </UIFormFieldSet>

    <UIFormFieldSet
      :is-stacked="true"
      title="Contact details"
    >
      <UIFormFieldGroup>
        <UIFormFieldGrid
          :sm="1"
          :lg="2"
          variant="card"
        >
          <TextField
            v-model="email"
            label="Email address"
            placeholder="jane.doe@example.com"
            type="email"
          />
          <TextField
            v-model="phone"
            label="Phone number"
            placeholder="+32 470 12 34 56"
            type="tel"
          />
        </UIFormFieldGrid>
      </UIFormFieldGroup>
    </UIFormFieldSet>
  </UIFormLayout>
</template>
