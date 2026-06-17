<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
const propsData = [
  {
    "default": "null",
    "description": "<p>Configuration object for content layout (left, description, right).</p>\n",
    "name": "config",
    "required": false,
    "type": "MenuItemConfig | null"
  },
  {
    "default": "null",
    "description": "<p>When provided, the item is visually disabled and a tooltip is shown with this text explaining why.</p>\n",
    "name": "disabledReason",
    "required": false,
    "type": "string | null"
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
    "name": "right",
    "type": "-"
  }
]

export default {
  setup() {
    return {
      propsData,
      slotsData,
    }
  },
}
</script>

<PropsTable :data="propsData" />

<SlotsTable :data="slotsData" />