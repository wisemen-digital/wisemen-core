<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
const propsData = [
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
    "type": "PlainDateRange"
  },
  {
    "default": "true",
    "description": "<p>Whether to show the presets sidebar.</p>\n",
    "name": "showPresets",
    "required": false,
    "type": "boolean"
  }
]

const eventsData = [
  {
    "description": "",
    "name": "update:modelValue",
    "type": "[value: PlainDateRange]"
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