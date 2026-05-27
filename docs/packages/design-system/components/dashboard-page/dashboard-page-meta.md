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
    "default": "false",
    "description": "",
    "name": "isTitleHidden",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "[]",
    "description": "",
    "name": "tabs",
    "required": false,
    "type": "PageTab[]"
  },
  {
    "description": "",
    "name": "title",
    "required": true,
    "type": "string"
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
      slotsData,
    }
  },
}
</script>

<PropsTable :data="propsData" />

<SlotsTable :data="slotsData" />