<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
import { createIconButtonStyle } from '@/ui/button/icon/iconButton.style'

const propsData = [
  {
    "default": "null",
    "description": "<p>Provides a reason why the element is disabled,\nwhen provided a tooltip will be shown on hover with the provided text.</p>\n",
    "name": "disabledReason",
    "required": false,
    "type": "string | null"
  },
  {
    "default": "null",
    "description": "<p>The form ID the button is associated with.</p>\n",
    "name": "form",
    "required": false,
    "type": "string | null"
  },
  {
    "description": "<p>Icon displayed inside the button.</p>\n",
    "name": "icon",
    "required": true,
    "type": "Component"
  },
  {
    "default": "false",
    "description": "<p>Determines whether the element is disabled. When <code>true</code>, the element becomes non-interactive.</p>\n",
    "name": "isDisabled",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "false",
    "description": "<p>Shows a loading state and disables interaction.</p>\n",
    "name": "isLoading",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "false",
    "description": "<p>Disables tooltip display.</p>\n",
    "name": "isTooltipDisabled",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "null",
    "description": "<p>Keyboard shortcut to display alongside this item.</p>\n",
    "name": "keyboardShortcut",
    "required": false,
    "type": "KeyboardShortcut | null"
  },
  {
    "description": "<p>Text label displayed inside the button.</p>\n",
    "name": "label",
    "required": true,
    "type": "string"
  },
  {
    "default": "\"md\"",
    "description": "<p>Controls the button size.</p>\n",
    "name": "size",
    "required": false,
    "type": "\"md\" | \"lg\" | \"sm\" | \"xs\""
  },
  {
    "default": "null",
    "description": "<p>Tooltip text shown on hover or focus.</p>\n",
    "name": "tooltipLabel",
    "required": false,
    "type": "string | null"
  },
  {
    "default": "\"button\"",
    "description": "<p>Native button type attribute.</p>\n",
    "name": "type",
    "required": false,
    "type": "\"button\" | \"reset\" | \"submit\""
  },
  {
    "default": "\"primary\"",
    "description": "<p>Visual style variant of the button.</p>\n",
    "name": "variant",
    "required": false,
    "type": "\"primary\" | \"destructive-primary\" | \"destructive-tertiary\" | \"secondary\" | \"tertiary\""
  }
]

const eventsData = [
  {
    "description": "",
    "name": "click",
    "type": "[event: MouseEvent]"
  }
]

export default {
  setup() {
    return {
      createIconButtonStyle,
      propsData,
      eventsData,
    }
  },
}
</script>

<PropsTable :data="propsData" />

<EmitsTable :data="eventsData" />

<ClassConfig :style-function="createIconButtonStyle" />