<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
import { createSeparatorStyle } from '@/ui/separator/separator.style'

const propsData = [
  {
    "default": "\"horizontal\"",
    "description": "<p>The orientation of the separator.</p>\n",
    "name": "orientation",
    "required": false,
    "type": "\"horizontal\" | \"vertical\""
  }
]

export default {
  setup() {
    return {
      createSeparatorStyle,
      propsData,
    }
  },
}
</script>

<PropsTable :data="propsData" />

<ClassConfig :style-function="createSeparatorStyle" />