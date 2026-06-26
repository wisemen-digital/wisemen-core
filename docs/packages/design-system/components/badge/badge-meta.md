<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
const propsData = [
  {
    "default": "null",
    "description": "<p>An array of actions to display in a dropdown menu. When provided, a 3-dots icon button\nappears absolutely positioned on the right of the badge.</p>\n",
    "name": "actions",
    "required": false,
    "type": "Action<any>[] | null"
  },
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
    "default": "null",
    "description": "<p>Arbitrary metadata passed to the action context.</p>\n",
    "name": "metadata",
    "required": false,
    "type": "any"
  },
  {
    "default": "null",
    "description": "<p>The models passed to the action context.</p>\n",
    "name": "models",
    "required": false,
    "type": "ActionModel[] | null"
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