<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
import { createAvatarGroupStyle } from '@/ui/avatar/avatar-group/avatarGroup.style'

const propsData = [
  {
    "description": "<p>The list of avatars to display.</p>\n",
    "name": "avatars",
    "required": true,
    "type": "AvatarProps[]"
  },
  {
    "default": "AVATAR_GROUP_DEFAULTS.max",
    "description": "<p>The maximum number of avatars to show before displaying a &quot;+X&quot; indicator.</p>\n",
    "name": "max",
    "required": false,
    "type": "number"
  },
  {
    "default": "AVATAR_GROUP_DEFAULTS.size",
    "description": "<p>The size of the avatars in the group.</p>\n",
    "name": "size",
    "required": false,
    "type": "\"md\" | \"sm\" | \"xs\""
  }
]

export default {
  setup() {
    return {
      createAvatarGroupStyle,
      propsData,
    }
  },
}
</script>

<PropsTable :data="propsData" />

<ClassConfig :style-function="createAvatarGroupStyle" />