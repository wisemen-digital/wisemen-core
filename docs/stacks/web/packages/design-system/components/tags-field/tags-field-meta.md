<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
const propsData = [
  {
    "default": "false",
    "description": "<p>Whether to add a tag when the input loses focus.</p>\n",
    "name": "addOnBlur",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "true",
    "description": "<p>Whether to add tags when pasting.</p>\n",
    "name": "addOnPaste",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "false",
    "description": "<p>Whether to add a tag when the Tab key is pressed.</p>\n",
    "name": "addOnTab",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "false",
    "description": "<p>Whether duplicate tags are allowed.</p>\n",
    "name": "allowDuplicate",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "\",\"",
    "description": "<p>The delimiter used to split pasted text into tags.</p>\n",
    "name": "delimiter",
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
    "description": "<p>The icon displayed on the left side of the input.</p>\n",
    "name": "iconLeft",
    "required": false,
    "type": "Component | null"
  },
  {
    "description": "<p>The icon displayed on the right side of the input.</p>\n",
    "name": "iconRight",
    "required": false,
    "type": "Component | null"
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
    "description": "<p>Whether the input is in a loading state.</p>\n",
    "name": "isLoading",
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
    "description": "<p>The label of the input.</p>\n",
    "name": "label",
    "required": false,
    "type": "string | null"
  },
  {
    "default": "null",
    "description": "<p>The maximum number of tags allowed. null means unlimited.</p>\n",
    "name": "max",
    "required": false,
    "type": "number | null"
  },
  {
    "description": "",
    "name": "modelValue",
    "required": true,
    "type": "string[]"
  },
  {
    "description": "<p>The name of the input.</p>\n",
    "name": "name",
    "required": false,
    "type": "string | null"
  },
  {
    "description": "<p>The placeholder text of the input.</p>\n",
    "name": "placeholder",
    "required": false,
    "type": "string | null"
  },
  {
    "default": "\"md\"",
    "description": "<p>The size of the tags field.</p>\n",
    "name": "size",
    "required": false,
    "type": "\"md\" | \"sm\""
  }
]

const eventsData = [
  {
    "description": "",
    "name": "blur",
    "type": "[event: FocusEvent]"
  },
  {
    "description": "",
    "name": "focus",
    "type": "[event: FocusEvent]"
  },
  {
    "description": "",
    "name": "update:modelValue",
    "type": "[value: string[]]"
  }
]

const slotsData = [
  {
    "name": "label-left",
    "type": "-"
  },
  {
    "name": "label-right",
    "type": "-"
  },
  {
    "name": "left",
    "type": "-"
  },
  {
    "name": "right",
    "type": "-"
  }
]

export default {
  setup() {
    return {
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