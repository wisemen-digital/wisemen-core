import type { StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import CheckboxGroupCheckbox from './CheckboxGroupCheckbox.vue'
import CheckboxGroupIndeterminateCheckbox from './CheckboxGroupIndeterminateCheckbox.vue'
import CheckboxGroupPlayground from './CheckboxGroupPlayground.vue'
import CheckboxGroupRoot from './CheckboxGroupRoot.vue'

const meta = {
  title: 'Components/CheckboxGroup',
  tags: [
    'autodocs',
  ],
  component: CheckboxGroupRoot<string>,
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    modelValue: [],
  },
  render: () => ({
    components: {
      CheckboxGroupCheckbox,
      CheckboxGroupIndeterminateCheckbox,
      CheckboxGroupRoot,
    },
    setup() {
      const modelValue = ref<string[]>([])

      return {
        modelValue,
      }
    },
    template: `
      <div class="p-xl">
        <CheckboxGroupRoot
          v-model="modelValue"
        >
          <CheckboxGroupCheckbox
            label="option 1"
            value="option1"
          />
          <CheckboxGroupCheckbox
            label="option 2"
            value="option2"
          />
          <CheckboxGroupCheckbox
            label="option 3"
            value="option3"
          />
        </CheckboxGroupRoot>
      </div>
    `,
  }),
}

export const Indeterminate: Story = {
  args: {
    modelValue: [],
  },
  render: () => ({
    components: {
      CheckboxGroupCheckbox,
      CheckboxGroupIndeterminateCheckbox,
      CheckboxGroupRoot,
    },
    setup() {
      const modelValue = ref<string[]>([])

      return {
        modelValue,
      }
    },
    template: `
      <div class="p-xl">
        <CheckboxGroupRoot
          v-model="modelValue"
        >
          <CheckboxGroupIndeterminateCheckbox
            label="Select All"
          />
          <CheckboxGroupCheckbox
            label="option 1"
            value="option1"
          />
          <CheckboxGroupCheckbox
            label="option 2"
            value="option2"
          />
          <CheckboxGroupCheckbox
            label="option 3"
            value="option3"
          />
        </CheckboxGroupRoot>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    modelValue: [],
  },
  render: () => ({
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
        modelValue,
      }
    },
    template: `
      <div class="p-xl">
        <CheckboxGroupRoot
          v-model="modelValue"
          is-disabled
        >
          <CheckboxGroupIndeterminateCheckbox
            label="Select All"
          />
            <CheckboxGroupCheckbox
              label="option 1"
              value="option1"
            />
            <CheckboxGroupCheckbox
              label="option 2"
              value="option2"
            />
            <CheckboxGroupCheckbox
              label="option 3"
              value="option3"
            />
        </CheckboxGroupRoot>
      </div>
    `,
  }),
}

export const HorizontalOrientation: Story = {
  args: {
    modelValue: [],
  },
  render: () => ({
    components: {
      CheckboxGroupCheckbox,
      CheckboxGroupIndeterminateCheckbox,
      CheckboxGroupRoot,
    },
    setup() {
      const modelValue = ref<string[]>([])

      return {
        modelValue,
      }
    },
    template: `
      <div class="p-xl">
        <CheckboxGroupRoot
          v-model="modelValue"
          orientation="horizontal"
        >
          <div class="flex flex-col items-start gap-lg">
            <CheckboxGroupIndeterminateCheckbox
              label="Select All"
            />
            <div class="flex items-center gap-lg">
              <CheckboxGroupCheckbox
                label="option 1"
                value="option1"
              />
              <CheckboxGroupCheckbox
                label="option 2"
                value="option2"
              />
              <CheckboxGroupCheckbox
                label="option 3"
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
    modelValue: [],
  },
  render: () => ({
    components: {
      CheckboxGroupPlayground,
    },
    setup() {
      const modelValue = ref<string[]>([])

      return {
        modelValue,
      }
    },
    template: `
      <CheckboxGroupPlayground v-model="modelValue" />
    `,
  }),
}
