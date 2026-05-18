<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
import { tabsVariants } from '@/ui/tabs/tabs.style'

const propsData = [
  {
    "default": "false",
    "description": "<p>Whether the tabs should stretch to fill the full width of the container.</p>\n",
    "name": "isFullWidth",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "",
    "name": "modelValue",
    "required": true,
    "type": "string"
  },
  {
    "default": "\"horizontal\"",
    "description": "<p>Defines the orientation of the tabs.</p>\n",
    "name": "orientation",
    "required": false,
    "type": "\"horizontal\" | \"vertical\""
  },
  {
    "default": "\"none\"",
    "description": "<p>Controls the horizontal padding of the scroll container. Only applies to the <code>underline</code> variant.</p>\n",
    "name": "underlineTabsHorizontalListPadding",
    "required": false,
    "type": "TabsHorizontalListPadding"
  },
  {
    "default": "\"underline\"",
    "description": "<p>Defines the visual style of the tabs.</p>\n",
    "name": "variant",
    "required": false,
    "type": "TabsVariant"
  }
]

const eventsData = [
  {
    "description": "",
    "name": "update:modelValue",
    "type": "[value: string]"
  }
]

const slotsData = [
  {
    "description": "",
    "name": "default",
    "type": "-"
  }
]

export default {
  setup() {
    return {
      tabsVariants,
      propsData,
      eventsData,
      slotsData,
    }
  },
}
</script>

<PropsTable :data="propsData" />

<EmitsTable :data="eventsData" />

<SlotsTable :data="slotsData" />

<ClassConfig :style-function="tabsVariants" />