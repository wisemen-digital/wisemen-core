<script setup lang="ts">
import { ref } from 'vue'

import {
  UIFormFieldGrid,
  UIFormFieldGroup,
  UIFormFieldSeperator,
  UIFormFieldSet,
  UIFormLayout,
} from '@/ui/field'
import { UISwitch } from '@/ui/switch'
import TextField from '@/ui/text-field/TextField.vue'

const email = ref<string | null>(null)
const phone = ref<string | null>(null)
</script>

<template>
  <UIFormLayout class="w-full">
    <UIFormFieldSet
      description="Who should receive invoices and payment reminders"
      horizontal-alignment="start"
      title="Billing contact"
    >
      <UIFormFieldGroup>
        <UIFormFieldGrid
          :lg="2"
          :md="2"
          :sm="2"
        >
          <TextField
            v-model="email"
            label="Billing email"
            placeholder="billing@company.com"
            type="email"
          />
          <TextField
            v-model="phone"
            label="Phone number"
            placeholder="+32 470 12 34 56"
            type="tel"
          />
        </UIFormFieldGrid>
        <UIFormFieldGrid
          :lg="2"
          :md="2"
          :sm="2"
        >
          <TextField
            v-model="phone"
            label="Mobile number"
            placeholder="+32 478 98 76 54"
            type="tel"
          />
        </UIFormFieldGrid>
      </UIFormFieldGroup>
    </UIFormFieldSet>

    <UIFormFieldSeperator />

    <UIFormFieldSet
      description="Default terms applied to new invoices"
      title="Payment terms"
    >
      <UIFormFieldGrid
        :lg="2"
        :md="2"
        :sm="2"
      >
        <TextField
          v-model="email"
          label="Accounting email"
          placeholder="accounting@company.com"
          type="email"
        />
      </UIFormFieldGrid>
    </UIFormFieldSet>

    <UIFormFieldSeperator />

    <UIFormFieldSet
      horizontal-alignment="end"
      description="Automatically send reminders for overdue invoices"
      title="Automatic reminders"
    >
      <div class="flex h-full items-center">
        <UISwitch
          :is-label-hidden="true"
          :model-value="true"
          label="Enable automatic reminders"
        />
      </div>
    </UIFormFieldSet>
  </UIFormLayout>
</template>
