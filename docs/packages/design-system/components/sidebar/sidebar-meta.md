<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
const propsData = [
  {
    "default": "\"hidden\"",
    "description": "<p>Controls the visual layout variant of the sidebar when collapsed.</p>\n",
    "name": "collapsedVariant",
    "required": false,
    "type": "MainSidebarCollapsedVariant"
  }
]

const slotsData = [
  {
    "description": "",
    "name": "bottom-navigation",
    "type": "-"
  },
  {
    "description": "",
    "name": "footer",
    "type": "-"
  },
  {
    "description": "",
    "name": "header",
    "type": "-"
  },
  {
    "description": "",
    "name": "navigation",
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