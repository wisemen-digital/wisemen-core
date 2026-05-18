<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
import { createDialogStyle } from '@/ui/dialog/dialog.style'

const propsData = [
  {
    "default": "null",
    "description": "<p>The chin configuration to display below the dialog.</p>\n",
    "name": "chin",
    "required": false,
    "type": "ChinConfig | null"
  },
  {
    "default": "false",
    "description": "",
    "name": "isOpen",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "false",
    "description": "<p>Whether to prevent closing the dialog by clicking outside.</p>\n",
    "name": "preventClickOutside",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "false",
    "description": "<p>Whether to prevent closing the dialog by pressing Escape.</p>\n",
    "name": "preventEsc",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "true",
    "description": "<p>Whether to show a close button in the dialog.</p>\n",
    "name": "showCloseButton",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "\"md\"",
    "description": "<p>The size of the dialog.</p>\n",
    "name": "size",
    "required": false,
    "type": "DialogSize"
  }
]

const eventsData = [
  {
    "description": "",
    "name": "afterLeave",
    "type": "[]"
  },
  {
    "description": "",
    "name": "close",
    "type": "[]"
  },
  {
    "description": "",
    "name": "update:isOpen",
    "type": "[value: boolean]"
  }
]

const slotsData = [
  {
    "description": "",
    "name": "default",
    "type": "-"
  }
]

export default {
  setup() {
    return {
      createDialogStyle,
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

<ClassConfig :style-function="createDialogStyle" />