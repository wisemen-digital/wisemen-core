<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
const propsData = [
  {
    "default": "false",
    "description": "<p>Whether or not to always display 6 weeks in the calendar.\nThis can be useful to prevent layout shifting.</p>\n",
    "name": "fixedWeeks",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "null",
    "description": "<p>The maximum selectable date.</p>\n",
    "name": "maxDate",
    "required": false,
    "type": "Temporal.PlainDate | null"
  },
  {
    "default": "null",
    "description": "<p>The minimum selectable date.</p>\n",
    "name": "minDate",
    "required": false,
    "type": "Temporal.PlainDate | null"
  },
  {
    "description": "",
    "name": "modelValue",
    "required": true,
    "type": "Temporal.PlainDate | null"
  },
  {
    "default": "\"md\"",
    "description": "<p>The size of the date picker.</p>\n",
    "name": "size",
    "required": false,
    "type": "\"md\" | \"sm\""
  }
]

const eventsData = [
  {
    "description": "",
    "name": "update:modelValue",
    "type": "[value: Temporal.PlainDate | null]"
  }
]

export default {
  setup() {
    return {
      propsData,
      eventsData,
    }
  },
}
</script>

<PropsTable :data="propsData" />

<EmitsTable :data="eventsData" />