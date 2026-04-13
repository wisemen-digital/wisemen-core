<script setup lang="ts" generic="TValue extends SelectValueType">
import { useId } from 'vue'

import FormField from '@/components/form-field/FormField.vue'
import SelectBase from '@/components/select/parts/SelectBase.vue'
import SelectContent from '@/components/select/parts/SelectContent.vue'
import SelectDropdownSearchInput from '@/components/select/parts/SelectDropdownSearchInput.vue'
import SelectEmpty from '@/components/select/parts/SelectEmpty.vue'
import SelectIconLeft from '@/components/select/parts/SelectIconLeft.vue'
import SelectIconRight from '@/components/select/parts/SelectIconRight.vue'
import SelectLoader from '@/components/select/parts/SelectLoader.vue'
import SelectPopover from '@/components/select/parts/SelectPopover.vue'
import SelectRoot from '@/components/select/parts/SelectRoot.vue'
import SelectVirtualList from '@/components/select/parts/SelectVirtualList.vue'
import type { SelectEmits } from '@/components/select/select.emits'
import type {
  SelectProps,
  SelectValue as SelectValueType,
} from '@/components/select/select.props'

const props = withDefaults(defineProps<SelectProps<TValue>>(), {
  // Vue automatically defaults boolean props to false, even if no value is provided
  remainOpenOnSelect: null,
})

const emit = defineEmits<SelectEmits>()

const modelValue = defineModel<TValue>({
  required: true,
})

const searchTerm = defineModel<string>('searchTerm', {
  required: false,
})

const isOpen = defineModel<boolean>('isOpen', {
  default: false,
  required: false,
})

const id = props.id ?? useId()
</script>

<template>
  <FormField
    :error-message="props.errorMessage"
    :hint="props.hint"
    :is-required="props.isRequired"
    :is-touched="props.isTouched"
    :label="props.label"
    :for="id"
  >
    <template #label>
      <slot name="label" />
    </template>

    <template #error>
      <slot name="error" />
    </template>

    <template #hint>
      <slot name="hint" />
    </template>

    <SelectRoot
      v-bind="props"
      :id="id"
      v-model="modelValue"
      v-model:search-term="searchTerm"
      v-model:is-open="isOpen"
      @blur="emit('blur')"
      @focus="emit('focus')"
    >
      <SelectPopover>
        <template #anchor>
          <slot name="anchor" />
        </template>

        <template #inline-content>
          <slot name="left" />

          <slot name="icon-left">
            <SelectIconLeft />
          </slot>

          <slot name="base">
            <SelectBase>
              <template #badge="{ value }">
                <slot
                  :value="value"
                  name="badge"
                />
              </template>
            </SelectBase>
          </slot>

          <slot name="icon-right">
            <SelectIconRight />
          </slot>

          <slot name="loader">
            <SelectLoader />
          </slot>

          <slot name="right" />
        </template>

        <template #content>
          <SelectDropdownSearchInput />

          <SelectContent>
            <SelectVirtualList>
              <template #item="{ item }">
                <slot
                  :item="item"
                  name="virtual-list-item"
                />
              </template>
            </SelectVirtualList>

            <slot />

            <SelectEmpty />
          </SelectContent>
        </template>
      </SelectPopover>
    </SelectRoot>
  </FormField>
</template>
