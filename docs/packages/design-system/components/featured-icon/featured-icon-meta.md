<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
const propsData = [
  {
    "default": "\"gray\"",
    "description": "<p>The color of the featured icon.</p>\n",
    "name": "color",
    "required": false,
    "type": "FeaturedIconColor"
  },
  {
    "description": "<p>The icon component to display.</p>\n",
    "name": "icon",
    "required": true,
    "type": "Component"
  },
  {
    "default": "\"md\"",
    "description": "<p>The size of the featured icon. <code>md</code> = 30px.</p>\n",
    "name": "size",
    "required": false,
    "type": "FeaturedIconSize"
  },
  {
    "default": "\"translucent\"",
    "description": "<p>The visual style variant.</p>\n",
    "name": "variant",
    "required": false,
    "type": "FeaturedIconVariant"
  }
]

export default {
  setup() {
    return {
      propsData,
    }
  },
}
</script>

<PropsTable :data="propsData" />