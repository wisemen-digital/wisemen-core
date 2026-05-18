<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
import { timelineVariants } from '@/ui/timeline/timeline.style'

const propsData = [
  {
    "default": "\"md\"",
    "description": "<p>Defines the size of the timeline indicators and connectors.</p>\n",
    "name": "size",
    "required": false,
    "type": "TimelineSize"
  },
  {
    "default": "\"solid\"",
    "description": "<p>Defines the visual style of the timeline indicators.</p>\n",
    "name": "variant",
    "required": false,
    "type": "TimelineVariant"
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
      timelineVariants,
      propsData,
      slotsData,
    }
  },
}
</script>

<PropsTable :data="propsData" />

<SlotsTable :data="slotsData" />

<ClassConfig :style-function="timelineVariants" />