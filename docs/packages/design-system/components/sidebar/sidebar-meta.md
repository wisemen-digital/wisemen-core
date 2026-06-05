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
    "name": "bottom-navigation",
    "type": "-"
  },
  {
    "name": "footer",
    "type": "-"
  },
  {
    "name": "header",
    "type": "-"
  },
  {
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