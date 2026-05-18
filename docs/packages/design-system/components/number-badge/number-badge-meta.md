<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
import { numberBadgeVariants } from '@/ui/number-badge/numberBadge.style'

const propsData = [
  {
    "default": "null",
    "description": "<p>Accessible label for screen readers. When null, the badge value is used.</p>\n",
    "name": "ariaLabel",
    "required": false,
    "type": "string | null"
  },
  {
    "default": "\"gray\"",
    "description": "<p>The color of the badge.</p>\n",
    "name": "color",
    "required": false,
    "type": "UtilityColor"
  },
  {
    "default": "\"md\"",
    "description": "<p>The size of the badge.</p>\n",
    "name": "size",
    "required": false,
    "type": "\"md\" | \"lg\""
  },
  {
    "description": "<p>The number to display inside the badge. always use a formatted string here (e.g. 1.400, 4,5)</p>\n",
    "name": "value",
    "required": true,
    "type": "string"
  },
  {
    "default": "\"translucent\"",
    "description": "<p>The visual style variant of the badge.</p>\n",
    "name": "variant",
    "required": false,
    "type": "\"translucent\" | \"outline\" | \"solid\""
  }
]

export default {
  setup() {
    return {
      numberBadgeVariants,
      propsData,
    }
  },
}
</script>

<PropsTable :data="propsData" />

<ClassConfig :style-function="numberBadgeVariants" />