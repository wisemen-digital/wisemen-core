<script setup lang="ts">
import { defineMeta } from 'sb-addon-vue-csf'
import {
  expect,
  userEvent,
  within,
} from 'storybook/test'

import SwitchPlayground from './SwitchPlayground.vue'
import SwitchSizesPlayground from './SwitchSizesPlayground.vue'
import SwitchStatesPlayground from './SwitchStatesPlayground.vue'
import SwitchWithIconsPlayground from './SwitchWithIconsPlayground.vue'

const {
  Story,
} = defineMeta({
  title: 'Components/Switch',
  argTypes: {
    isDisabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether the switch is required',
    },
    errorMessage: {
      control: 'text',
      description: 'The error message to display',
    },
    hint: {
      control: 'text',
      description: 'The hint text of the switch',
    },
    label: {
      control: 'text',
      description: 'The label of the switch',
    },
  },
  tags: [
    'autodocs',
  ],
  component: SwitchPlayground,
})

async function playDefault({
  canvasElement,
}: { canvasElement: HTMLElement }): Promise<void> {
  const canvas = within(canvasElement)
  const switchElement = canvas.getByRole('switch')

  await expect(switchElement).not.toBeChecked()

  await userEvent.click(switchElement)

  await expect(switchElement).toBeChecked()

  await userEvent.click(switchElement)

  await expect(switchElement).not.toBeChecked()
}

async function playAllStates({
  canvasElement,
}: { canvasElement: HTMLElement }): Promise<void> {
  const canvas = within(canvasElement)
  const switches = canvas.getAllByRole('switch')

  const disabledSwitches = switches.filter(
    (s) => (s as HTMLButtonElement).disabled,
  )

  for (const s of disabledSwitches) {
    await expect(s).toBeDisabled()
  }
}
</script>

<template>
  <Story
    :args="{ label: 'Switch Label' }"
    :play="playDefault"
    name="Default"
  />

  <Story
    :play="playAllStates"
    name="AllStates"
    as-child
  >
    <SwitchStatesPlayground />
  </Story>

  <Story
    name="AllSizes"
    as-child
  >
    <SwitchSizesPlayground />
  </Story>

  <Story
    name="WithIcons"
    as-child
  >
    <SwitchWithIconsPlayground />
  </Story>
</template>
