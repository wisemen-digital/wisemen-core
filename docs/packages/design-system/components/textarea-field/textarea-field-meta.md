<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
import { createTextareaFieldStyle } from '@/ui/textarea-field/textareaField.style'

const propsData = [
  {
    "description": "<p>The autocomplete attribute of the input.</p>\n",
    "name": "autocomplete",
    "required": false,
    "type": "string"
  },
  {
    "description": "<p>Provides a reason why the element is disabled,\nwhen provided a tooltip will be shown on hover with the provided text.</p>\n",
    "name": "disabledReason",
    "required": false,
    "type": "string | null"
  },
  {
    "description": "<p>The error associated with the input.</p>\n",
    "name": "errorMessage",
    "required": false,
    "type": "string | null"
  },
  {
    "description": "<p>The id of the element the label is for.</p>\n",
    "name": "for",
    "required": false,
    "type": "string | null"
  },
  {
    "description": "<p>The help text displayed in a tooltip next to the label.\nWhen provided, a help circle icon is shown next to the label.</p>\n",
    "name": "helpText",
    "required": false,
    "type": "string | null"
  },
  {
    "description": "<p>Determines whether to hide the error message visually.</p>\n",
    "name": "hideErrorMessage",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>The hint text of the input.</p>\n",
    "name": "hint",
    "required": false,
    "type": "string | null"
  },
  {
    "description": "<p>The id of the element.</p>\n",
    "name": "id",
    "required": false,
    "type": "string | null"
  },
  {
    "description": "<p>Determines whether the element is disabled. When <code>true</code>, the element becomes non-interactive.</p>\n",
    "name": "isDisabled",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>Whether the label and hint are displayed horizontally.</p>\n",
    "name": "isHorizontal",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>Whether the label is visually hidden but still accessible to screen readers.</p>\n",
    "name": "isLabelHidden",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>Whether the input is read-only. When <code>true</code>, the input value cannot be changed.</p>\n",
    "name": "isReadonly",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>Whether the input is required.</p>\n",
    "name": "isRequired",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "false",
    "description": "<p>Whether the input is spell check enabled.</p>\n",
    "name": "isSpellCheckEnabled",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>The label of the input.</p>\n",
    "name": "label",
    "required": false,
    "type": "string | null"
  },
  {
    "default": "null",
    "description": "<p>The maximum height of the textarea (e.g. <code>'200px'</code>, <code>'10rem'</code>).</p>\n",
    "name": "maxHeight",
    "required": false,
    "type": "string | null"
  },
  {
    "default": "null",
    "description": "<p>The maximum number of characters allowed. When set, a character count\nis shown in place of the hint.</p>\n",
    "name": "maxLength",
    "required": false,
    "type": "number | null"
  },
  {
    "default": "null",
    "description": "<p>The minimum height of the textarea (e.g. <code>'100px'</code>, <code>'5rem'</code>).</p>\n",
    "name": "minHeight",
    "required": false,
    "type": "string | null"
  },
  {
    "description": "",
    "name": "modelValue",
    "required": true,
    "type": "string | null"
  },
  {
    "description": "<p>The name of the input.</p>\n",
    "name": "name",
    "required": false,
    "type": "string | null"
  },
  {
    "default": "null",
    "description": "<p>The placeholder text of the textarea.</p>\n",
    "name": "placeholder",
    "required": false,
    "type": "string | null"
  },
  {
    "default": "\"none\"",
    "description": "<p>Whether the textarea can be resized.</p>\n<ul>\n<li><code>'auto-vertical'</code>: The textarea will resize vertically depending on the content height.</li>\n<li><code>'none'</code>: The textarea cannot be resized.</li>\n<li><code>'vertical'</code>: The textarea can be resized vertically, but not horizontally.</li>\n</ul>\n",
    "name": "resize",
    "required": false,
    "type": "\"vertical\" | \"none\" | \"auto-vertical\""
  }
]

const eventsData = [
  {
    "description": "",
    "name": "update:modelValue",
    "type": "[value: string | null]"
  }
]

const slotsData = [
  {
    "description": "",
    "name": "bottom",
    "type": "-"
  },
  {
    "description": "",
    "name": "label-left",
    "type": "-"
  },
  {
    "description": "",
    "name": "label-right",
    "type": "-"
  },
  {
    "description": "",
    "name": "top",
    "type": "-"
  }
]

export default {
  setup() {
    return {
      createTextareaFieldStyle,
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

<ClassConfig :style-function="createTextareaFieldStyle" />