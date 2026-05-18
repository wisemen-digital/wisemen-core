<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
const propsData = [
  {
    "default": "\"start\"",
    "description": "<p>Controls the vertical alignment of items within the column.</p>\n",
    "name": "align",
    "required": false,
    "type": "\"center\" | \"end\" | \"start\""
  },
  {
    "default": "\"div\"",
    "description": "<p>The HTML element to render as the container.</p>\n",
    "name": "as",
    "required": false,
    "type": "string"
  },
  {
    "default": "\"md\"",
    "description": "<p>Controls the spacing between items.</p>\n",
    "name": "gap",
    "required": false,
    "type": "LayoutGap"
  },
  {
    "default": "\"start\"",
    "description": "<p>Controls the horizontal distribution of items within the column.</p>\n",
    "name": "justify",
    "required": false,
    "type": "\"center\" | \"end\" | \"start\" | \"between\""
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
      propsData,
      slotsData,
    }
  },
}
</script>

<PropsTable :data="propsData" />

<SlotsTable :data="slotsData" />