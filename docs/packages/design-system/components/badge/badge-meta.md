<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
import { badgeVariants } from '@/ui/badge/badge.style'

const propsData = [
  {
    "default": "null",
    "description": "<p>Accessible label for screen readers. Use when the badge content alone is not descriptive enough.</p>\n",
    "name": "ariaLabel",
    "required": false,
    "type": "string | null"
  },
  {
    "default": "null",
    "description": "<p>An avatar configuration object. When provided, renders an avatar (xxs size) inside the badge.</p>\n",
    "name": "avatar",
    "required": false,
    "type": "BadgeAvatarConfig | null"
  },
  {
    "default": "\"gray\"",
    "description": "<p>The background color of the badge.</p>\n",
    "name": "color",
    "required": false,
    "type": "BadgeColor"
  },
  {
    "default": "null",
    "description": "<p>A dot configuration object. When provided, a dot indicator is shown inside the badge.\nPass an empty object <code>{}</code> to show a dot that inherits the badge color.</p>\n",
    "name": "dot",
    "required": false,
    "type": "BadgeDotConfig | null"
  },
  {
    "default": "null",
    "description": "<p>An icon component to display inside the badge.</p>\n",
    "name": "icon",
    "required": false,
    "type": "Component | null"
  },
  {
    "default": "null",
    "description": "<p>The text label displayed inside the badge.</p>\n",
    "name": "label",
    "required": false,
    "type": "string | null"
  },
  {
    "default": "\"default\"",
    "description": "<p>The border radius of the badge.</p>\n",
    "name": "rounded",
    "required": false,
    "type": "\"default\" | \"full\""
  },
  {
    "default": "\"md\"",
    "description": "<p>The size of the badge.</p>\n",
    "name": "size",
    "required": false,
    "type": "\"md\" | \"lg\" | \"sm\""
  },
  {
    "default": "\"translucent\"",
    "description": "<p>The visual style variant of the badge.</p>\n",
    "name": "variant",
    "required": false,
    "type": "\"translucent\" | \"outline\" | \"solid\""
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
      badgeVariants,
      propsData,
      slotsData,
    }
  },
}
</script>

<PropsTable :data="propsData" />

<SlotsTable :data="slotsData" />

<ClassConfig :style-function="badgeVariants" />