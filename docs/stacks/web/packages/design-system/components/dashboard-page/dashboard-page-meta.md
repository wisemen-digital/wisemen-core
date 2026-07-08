<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
const propsData = [
  {
    "default": "[]",
    "description": "",
    "name": "actions",
    "required": false,
    "type": "any[]"
  },
  {
    "default": "[]",
    "description": "",
    "name": "breadcrumbs",
    "required": false,
    "type": "PageBreadcrumb[]"
  },
  {
    "default": "null",
    "description": "",
    "name": "detailPane",
    "required": false,
    "type": "DetailPaneConfig | null"
  },
  {
    "default": "true",
    "description": "",
    "name": "isDetailPaneOpen",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "false",
    "description": "",
    "name": "isTitleHidden",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "",
    "name": "title",
    "required": true,
    "type": "string"
  }
]

const eventsData = [
  {
    "description": "",
    "name": "update:isDetailPaneOpen",
    "type": "[value: boolean]"
  }
]

const slotsData = [
  {
    "name": "default",
    "type": "-"
  },
  {
    "name": "detail-pane",
    "type": "-"
  },
  {
    "name": "page-actions-left",
    "type": "-"
  },
  {
    "name": "page-actions-right",
    "type": "-"
  }
]

export default {
  setup() {
    return {
      propsData,
      eventsData,
      slotsData,
    }
  },
}
</script>

<PropsTable :data="propsData" />

<EmitsTable :data="eventsData" />

<SlotsTable :data="slotsData" />