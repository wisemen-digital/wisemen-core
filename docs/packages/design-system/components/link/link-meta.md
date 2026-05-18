<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
import { createLinkStyle } from '@/ui/button/link/link.style'

const propsData = [
  {
    "default": "null",
    "description": "<p>Icon displayed before the button label.</p>\n",
    "name": "iconLeft",
    "required": false,
    "type": "Component | null"
  },
  {
    "default": "null",
    "description": "<p>Icon displayed after the button label.</p>\n",
    "name": "iconRight",
    "required": false,
    "type": "Component | null"
  },
  {
    "default": "null",
    "description": "<p>Keyboard shortcut to display alongside this item.</p>\n",
    "name": "keyboardShortcut",
    "required": false,
    "type": "KeyboardShortcut | null"
  },
  {
    "description": "<p>Text label displayed inside the button.</p>\n",
    "name": "label",
    "required": true,
    "type": "string"
  },
  {
    "default": "null",
    "description": "<p>The link attributes when using a standard anchor link.</p>\n",
    "name": "link",
    "required": false,
    "type": "{ href: string; rel?: string; target?: \"_blank\" | \"_parent\" | \"_self\" | \"_top\"; } | null"
  },
  {
    "default": "\"md\"",
    "description": "<p>Controls the button size.</p>\n",
    "name": "size",
    "required": false,
    "type": "\"md\" | \"lg\" | \"sm\" | \"xs\""
  },
  {
    "default": "null",
    "description": "<p>The link destination. Uses Vue Router's <code>router-link</code> when provided.</p>\n",
    "name": "to",
    "required": false,
    "type": "string | vt | mt | null"
  },
  {
    "default": "null",
    "description": "<p>Tooltip text shown on hover or focus.</p>\n",
    "name": "tooltipLabel",
    "required": false,
    "type": "string | null"
  },
  {
    "default": "\"top\"",
    "description": "<p>Position of the tooltip relative to the link.</p>\n",
    "name": "tooltipSide",
    "required": false,
    "type": "\"top\" | \"bottom\" | \"left\" | \"right\""
  },
  {
    "default": "\"primary\"",
    "description": "<p>Visual style variant of the button.</p>\n",
    "name": "variant",
    "required": false,
    "type": "\"primary\" | \"destructive-primary\" | \"destructive-tertiary\" | \"secondary\" | \"tertiary\""
  }
]

export default {
  setup() {
    return {
      createLinkStyle,
      propsData,
    }
  },
}
</script>

<PropsTable :data="propsData" />

<ClassConfig :style-function="createLinkStyle" />