<script setup lang="ts">
import CheckboxGroupCheckbox from '@/ui/checkbox-group/CheckboxGroupCheckbox.vue'
import CheckboxGroupIndeterminateCheckbox from '@/ui/checkbox-group/CheckboxGroupIndeterminateCheckbox.vue'
import CheckboxGroupRoot from '@/ui/checkbox-group/CheckboxGroupRoot.vue'
import ColumnLayout from '@/ui/column-layout/ColumnLayout.vue'
import { UIText } from '@/ui/text/index'

const modelValue = defineModel<string[]>({
  required: true,
})

const options = [
  {
    title: 'Big Cool Item',
    description: 'With a very cool description',
    value: 'option1',
  },
  {
    title: 'Another Item',
    description: 'Some other description',
    value: 'option2',
  },
  {
    title: 'Third Option',
    description: 'Yet another description',
    value: 'option3',
  },
]
</script>

<template>
  <div class="p-xl">
    <CheckboxGroupRoot
      v-model="modelValue"
    >
      <CheckboxGroupIndeterminateCheckbox
        label="Check them all!"
        class="mb-xl"
      />
      <!-- eslint-disable vuejs-accessibility/label-has-for -->
      <ColumnLayout>
        <label
          v-for="option in options"
          :key="option.value"
          :for="`id-${option.value}`"
        >
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
            <CheckboxGroupCheckbox
              :id="`id-${option.value}`"
              :is-label-hidden="true"
              :value="option.value"
            />
          </div>
        </label>
      </ColumnLayout>
      <!-- eslint-enable vuejs-accessibility/label-has-for -->
    </CheckboxGroupRoot>
  </div>
</template>
