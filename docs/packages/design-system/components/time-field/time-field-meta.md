<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
import { createTimeFieldStyle } from '@/ui/time-field/timeField.style'

const propsData = [
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
    "default": "\"minute\"",
    "description": "<p>The granularity to use for formatting and inputting times.\nDetermines which time segments are displayed and editable.</p>\n<ul>\n<li><code>'hour'</code> — shows hours only</li>\n<li><code>'minute'</code> — shows hours and minutes</li>\n<li><code>'second'</code> — shows hours, minutes, and seconds</li>\n</ul>\n",
    "name": "granularity",
    "required": false,
    "type": "\"minute\" | \"hour\" | \"second\""
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
    "description": "",
    "name": "modelValue",
    "required": true,
    "type": "Temporal.PlainTime | null"
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
    "description": "<p>The size of the time field.</p>\n",
    "name": "size",
    "required": false,
    "type": "\"md\" | \"sm\""
  },
  {
    "default": "null",
    "description": "<p>The stepping interval for each time segment.\nDefines the increment applied when using the arrow keys or spinner controls.\nFor example, a step of <code>{ minute: 15 }</code> increments minutes in 15-minute intervals.\nPass <code>null</code> to apply the default of 1.</p>\n",
    "name": "step",
    "required": false,
    "type": "DateStep | null"
  },
  {
    "default": "false",
    "description": "<p>Whether to snap the value to the nearest step increment after the user finishes input.\nWhen <code>true</code>, any manually typed value is rounded to the closest valid step.</p>\n",
    "name": "stepSnapping",
    "required": false,
    "type": "boolean"
  }
]

const eventsData = [
  {
    "description": "",
    "name": "update:modelValue",
    "type": "[value: Temporal.PlainTime | null]"
  }
]

const slotsData = [
  {
    "description": "",
    "name": "label-left",
    "type": "-"
  },
  {
    "description": "",
    "name": "label-right",
    "type": "-"
  }
]

export default {
  setup() {
    return {
      createTimeFieldStyle,
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

<ClassConfig :style-function="createTimeFieldStyle" />