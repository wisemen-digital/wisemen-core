<script setup lang="ts">
import { ref } from 'vue'

import ClickableElement from '@/ui/clickable-element/ClickableElement.vue'
import ColumnLayout from '@/ui/column-layout/ColumnLayout.vue'
import RadioGroupItem from '@/ui/radio-group/RadioGroupItem.vue'
import RadioGroupRoot from '@/ui/radio-group/RadioGroupRoot.vue'
import { UIText } from '@/ui/text/index'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  orientation?: 'horizontal' | 'vertical'
}>(), {
  isDisabled: false,
  orientation: 'vertical',
})

const modelValue = ref<string | null>(null)

const options = [
  {
    title: 'Basic plan',
    description: 'Includes up to 10 users, 20 GB individual data and access to all features.',
    value: 'option1',
  },
  {
    title: 'Business plan',
    description: 'Includes up to 20 users, 40 GB individual data and access to all features.',
    value: 'option2',
  },
  {
    title: 'Enterprise plan',
    description: 'Includes up to 50 users, 100 GB individual data and access to all features.',
    value: 'option3',
  },
]
</script>

<template>
  <div class="p-xl">
    <RadioGroupRoot
      v-model="modelValue"
      :is-disabled="props.isDisabled"
      :orientation="props.orientation"
    >
      <!-- eslint-disable vuejs-accessibility/label-has-for -->
      <ColumnLayout>
        <label
          v-for="option in options"
          :key="option.value"
          :for="`id-${option.value}`"
        >
          <ClickableElement>
            <div
              class="
                flex w-xl items-center justify-between rounded-md border
                border-primary p-md px-lg
              "
            >
              <ColumnLayout gap="none">
                <UIText
                  :text="option.title"
                  class="text-xs"
                />
                <UIText
                  :text="option.description"
                  class="text-xxs"
                />
              </ColumnLayout>
              <RadioGroupItem
                :id="`id-${option.value}`"
                :is-label-hidden="true"
                :label="option.title"
                :value="option.value"
              />
            </div>
          </ClickableElement>
        </label>
      </ColumnLayout>
      <!-- eslint-enable vuejs-accessibility/label-has-for -->
    </RadioGroupRoot>
  </div>
</template>
