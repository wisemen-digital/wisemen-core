<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
const propsData = [
  {
    "default": "0",
    "description": "<p>The padding between the context menu content and the collision boundaries.</p>\n",
    "name": "collisionPadding",
    "required": false,
    "type": "number"
  },
  {
    "default": "false",
    "description": "<p>Disables updating the content's position on layout shifts.</p>\n",
    "name": "disableUpdateOnLayoutShift",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "false",
    "description": "<p>Constrain the content to remain within the viewport. This may cause it\nto overlap the trigger element, which might be undesirable.</p>\n",
    "name": "prioritizePosition",
    "required": false,
    "type": "boolean"
  }
]

const slotsData = [
  {
    "description": "",
    "name": "content",
    "type": "-"
  },
  {
    "description": "",
    "name": "trigger",
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