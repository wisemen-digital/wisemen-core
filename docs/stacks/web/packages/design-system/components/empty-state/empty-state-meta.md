<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
const propsData = [
  {
    "default": "null",
    "description": "<p>The description of the empty state.</p>\n",
    "name": "description",
    "required": false,
    "type": "string | null"
  },
  {
    "default": "null",
    "description": "<p>The icon of the empty state. Ignored when <code>illustration</code> is set.</p>\n",
    "name": "icon",
    "required": false,
    "type": "Component | null"
  },
  {
    "default": "null",
    "description": "<p>An illustration to display. Takes priority over <code>icon</code> when both are set.</p>\n",
    "name": "illustration",
    "required": false,
    "type": "EmptyStateIllustration | null"
  },
  {
    "default": "null",
    "description": "<p>The primary action of the empty state.</p>\n",
    "name": "primaryAction",
    "required": false,
    "type": "EmptyStateAction | null"
  },
  {
    "default": "null",
    "description": "<p>The secondary action of the empty state.</p>\n",
    "name": "secondaryAction",
    "required": false,
    "type": "EmptyStateAction | null"
  },
  {
    "description": "<p>The title of the empty state.</p>\n",
    "name": "title",
    "required": true,
    "type": "string"
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