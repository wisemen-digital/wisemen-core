import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import { ref } from 'vue'

import CheckboxGroupCheckbox from '@/ui/checkbox-group/CheckboxGroupCheckbox.vue'
import CheckboxGroupIndeterminateCheckbox from '@/ui/checkbox-group/CheckboxGroupIndeterminateCheckbox.vue'
import CheckboxGroupPlayground from '@/ui/checkbox-group/CheckboxGroupPlayground.vue'
import CheckboxGroupRoot from '@/ui/checkbox-group/CheckboxGroupRoot.vue'

const meta = {
  title: 'Components/CheckboxGroup',
  argTypes: {
    isDisabled: {
      control: 'boolean',
      description: 'Disables every checkbox in the group',
    },
    disabledReason: {
      control: 'text',
      description: 'Tooltip text shown when the checkbox group is disabled',
    },
    modelValue: {
      table: {
        disable: true,
      },
    },
    orientation: {
      control: 'select',
      description: 'Controls whether the checkbox group is laid out horizontally or vertically',
      options: [
        'vertical',
        'horizontal',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: CheckboxGroupPlayground,
} satisfies Meta<typeof CheckboxGroupPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    isDisabled: false,
    disabledReason: null,
    modelValue: [],
    orientation: 'vertical',
  },
  render: (args) => ({
    components: {
      CheckboxGroupCheckbox,
      CheckboxGroupRoot,
    },
    setup() {
      const modelValue = ref<string[]>([])

      return {
        args,
        modelValue,
      }
    },
    template: `
      <div class="p-xl">
        <CheckboxGroupRoot
          v-model="modelValue"
          :disabled-reason="args.disabledReason"
          :is-disabled="args.isDisabled"
          :orientation="args.orientation"
        >
          <CheckboxGroupCheckbox
            label="Option 1"
            value="option1"
          />
          <CheckboxGroupCheckbox
            label="Option 2"
            value="option2"
          />
          <CheckboxGroupCheckbox
            label="Option 3"
            value="option3"
          />
        </CheckboxGroupRoot>
      </div>
    `,
  }),
}

export const Indeterminate: Story = {
  args: {
    isDisabled: false,
    disabledReason: null,
    modelValue: [],
    orientation: 'vertical',
  },
  render: (args) => ({
    components: {
      CheckboxGroupCheckbox,
      CheckboxGroupIndeterminateCheckbox,
      CheckboxGroupRoot,
    },
    setup() {
      const modelValue = ref<string[]>([
        'option1',
      ])

      return {
        args,
        modelValue,
      }
    },
    template: `
      <div class="p-xl">
        <CheckboxGroupRoot
          v-model="modelValue"
          :disabled-reason="args.disabledReason"
          :is-disabled="args.isDisabled"
          :orientation="args.orientation"
        >
          <CheckboxGroupIndeterminateCheckbox
            label="Select All"
          />
          <CheckboxGroupCheckbox
            label="Option 1"
            value="option1"
          />
          <CheckboxGroupCheckbox
            label="Option 2"
            value="option2"
          />
          <CheckboxGroupCheckbox
            label="Option 3"
            value="option3"
          />
        </CheckboxGroupRoot>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    isDisabled: true,
    disabledReason: 'Selections are locked for this example',
    modelValue: [],
    orientation: 'vertical',
  },
  render: (args) => ({
    components: {
      CheckboxGroupCheckbox,
      CheckboxGroupIndeterminateCheckbox,
      CheckboxGroupRoot,
    },
    setup() {
      const modelValue = ref<string[]>([
        'option2',
      ])

      return {
        args,
        modelValue,
      }
    },
    template: `
      <div class="p-xl">
        <CheckboxGroupRoot
          v-model="modelValue"
          :disabled-reason="args.disabledReason"
          :is-disabled="args.isDisabled"
          :orientation="args.orientation"
        >
          <CheckboxGroupIndeterminateCheckbox
            label="Select All"
          />
          <CheckboxGroupCheckbox
            label="Option 1"
            value="option1"
          />
          <CheckboxGroupCheckbox
            label="Option 2"
            value="option2"
          />
          <CheckboxGroupCheckbox
            label="Option 3"
            value="option3"
          />
        </CheckboxGroupRoot>
      </div>
    `,
  }),
}

export const HorizontalOrientation: Story = {
  args: {
    isDisabled: false,
    disabledReason: null,
    modelValue: [],
    orientation: 'horizontal',
  },
  render: (args) => ({
    components: {
      CheckboxGroupCheckbox,
      CheckboxGroupIndeterminateCheckbox,
      CheckboxGroupRoot,
    },
    setup() {
      const modelValue = ref<string[]>([])

      return {
        args,
        modelValue,
      }
    },
    template: `
      <div class="p-xl">
        <CheckboxGroupRoot
          v-model="modelValue"
          :disabled-reason="args.disabledReason"
          :is-disabled="args.isDisabled"
          :orientation="args.orientation"
        >
          <div class="flex flex-col items-start gap-lg">
            <CheckboxGroupIndeterminateCheckbox
              label="Select All"
            />
            <div class="flex items-center gap-lg">
              <CheckboxGroupCheckbox
                label="Option 1"
                value="option1"
              />
              <CheckboxGroupCheckbox
                label="Option 2"
                value="option2"
              />
              <CheckboxGroupCheckbox
                label="Option 3"
                value="option3"
              />
            </div>
          </div>
        </CheckboxGroupRoot>
      </div>
    `,
  }),
}

export const Playground: Story = {
  args: {
    isDisabled: false,
    disabledReason: null,
    modelValue: [],
    orientation: 'vertical',
  },
  render: (args) => ({
    components: {
      CheckboxGroupPlayground,
    },
    setup() {
      const modelValue = ref<string[]>([])

      return {
        args,
        modelValue,
      }
    },
    template: `
      <CheckboxGroupPlayground
        v-model="modelValue"
        v-bind="args"
      />
    `,
  }),
}
