<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
import { createTextStyle } from '@/ui/text/text.style'

const propsData = [
  {
    "default": "\"span\"",
    "description": "<p>The HTML element or component to render as the text container.</p>\n",
    "name": "as",
    "required": false,
    "type": "string"
  },
  {
    "default": "false",
    "description": "<p>If <code>true</code>, the tooltip will be disabled even if the text is truncated.</p>\n",
    "name": "disableTooltip",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>The text content to display.</p>\n",
    "name": "text",
    "required": true,
    "type": "string"
  },
  {
    "default": "true",
    "description": "<p>If <code>true</code>, the text will be truncated with an ellipsis if it overflows its container.\nIf a number between 2 and 6 is provided, the text will be clamped to that number of lines.</p>\n",
    "name": "truncate",
    "required": false,
    "type": "boolean | 2 | 3 | 4 | 5 | 6"
  }
]

export default {
  setup() {
    return {
      createTextStyle,
      propsData,
    }
  },
}
</script>

<PropsTable :data="propsData" />

<ClassConfig :style-function="createTextStyle" />