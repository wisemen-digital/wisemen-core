<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
import { createAvatarStyle } from '@/ui/avatar/avatar/avatar.style'

const propsData = [
  {
    "description": "<p>By default, the avatar's background color is generated based on\nthe provided name to ensure consistency across renders.\nSetting this prop to <code>true</code> will disable this behavior and\nuse a static background color instead.</p>\n",
    "name": "isStaticColor",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>The image source URL for the avatar's logo.\nFalls back to initials when not provided.</p>\n",
    "name": "logo",
    "required": false,
    "type": "string | null"
  },
  {
    "description": "<p>The alt text for the avatar's logo image.</p>\n",
    "name": "logoAlt",
    "required": false,
    "type": "string | null"
  },
  {
    "description": "<p>The name used to generate fallback initials.</p>\n",
    "name": "name",
    "required": true,
    "type": "string"
  },
  {
    "description": "<p>The size of the avatar.</p>\n",
    "name": "size",
    "required": false,
    "type": "\"md\" | \"lg\" | \"sm\" | \"xs\" | \"xl\" | \"xxs\" | \"2xl\""
  },
  {
    "description": "<p>The image source URL for the avatar.\nFalls back to initials when not provided.</p>\n",
    "name": "src",
    "required": false,
    "type": "string | null"
  },
  {
    "description": "<p>The online status indicator shown at the bottom-right of the avatar.</p>\n",
    "name": "status",
    "required": false,
    "type": "AvatarStatus | null"
  }
]

export default {
  setup() {
    return {
      createAvatarStyle,
      propsData,
    }
  },
}
</script>

<PropsTable :data="propsData" />

<ClassConfig :style-function="createAvatarStyle" />