<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
import { createMenuItemStyle } from '@/ui/menu-item/menuItem.style'

const propsData = [
  {
    "default": "null",
    "description": "<p>Configuration object for content layout (left, description, right).</p>\n",
    "name": "config",
    "required": false,
    "type": "MenuItemConfig | null"
  },
  {
    "default": "false",
    "description": "<p>Disable this menu item.</p>\n",
    "name": "isDisabled",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>The label text displayed in the menu item.</p>\n",
    "name": "label",
    "required": true,
    "type": "string"
  },
  {
    "default": "\"md\"",
    "description": "<p>The size of the menu item.</p>\n",
    "name": "size",
    "required": false,
    "type": "\"md\" | \"sm\""
  }
]

const slotsData = [
  {
    "description": "",
    "name": "right",
    "type": "-"
  }
]

export default {
  setup() {
    return {
      createMenuItemStyle,
      propsData,
      slotsData,
    }
  },
}
</script>

<PropsTable :data="propsData" />

<SlotsTable :data="slotsData" />

<ClassConfig :style-function="createMenuItemStyle" />