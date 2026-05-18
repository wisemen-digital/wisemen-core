<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
import { createTooltipStyle } from '@/ui/tooltip/tooltip.style'

const propsData = [
  {
    "default": "300",
    "description": "<p>The duration in milliseconds to wait before showing the tooltip.</p>\n",
    "name": "delayDuration",
    "required": false,
    "type": "number"
  },
  {
    "default": "false",
    "description": "<p>When true, clicking on trigger won’t close the tooltip.</p>\n",
    "name": "disableCloseOnTriggerClick",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "false",
    "description": "<p>When true, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.</p>\n",
    "name": "disableHoverableContent",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "false",
    "description": "<p>When true, the tooltip will be hidden.</p>\n",
    "name": "isDisabled",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "false",
    "description": "",
    "name": "isOpen",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>Controls the visibility of the popper arrow.</p>\n",
    "name": "isPopoverArrowVisible",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>Defines how the popper content is aligned relative to the trigger element.\nOptions are 'center', 'start', or 'end'.</p>\n",
    "name": "popoverAlign",
    "required": false,
    "type": "PopperAlign"
  },
  {
    "description": "<p>An offset in pixels from the start or end alignment options.</p>\n",
    "name": "popoverAlignOffset",
    "required": false,
    "type": "number"
  },
  {
    "description": "<p>The HTML element that serves as the anchor point for the popover.\nIf set to <code>null</code>, the popover will be anchored to the trigger element.</p>\n",
    "name": "popoverAnchorReferenceElement",
    "required": false,
    "type": "ReferenceElement | null"
  },
  {
    "description": "<p>When specified, applies the given animation name to the popper content.\nThis allows for custom animations to be used when showing or hiding the popper.</p>\n",
    "name": "popoverAnimationName",
    "required": false,
    "type": "string | null"
  },
  {
    "description": "<p>Specifies the padding (in pixels) used when handling collision detection.\nA larger value increases the spacing between the popper and the container edges.</p>\n",
    "name": "popoverCollisionPadding",
    "required": false,
    "type": "number"
  },
  {
    "description": "<p>The HTML element in which the popper content should be rendered.\nBy default, the popper content is rendered inside the viewport.</p>\n",
    "name": "popoverContainerElement",
    "required": false,
    "type": "HTMLElement | null"
  },
  {
    "description": "<p>Defines which side the content should appear on.\nOptions are 'top', 'right', 'bottom', or 'left'.</p>\n",
    "name": "popoverSide",
    "required": false,
    "type": "PopperSide"
  },
  {
    "description": "<p>The distance in pixels between the popper content and the trigger element.</p>\n",
    "name": "popoverSideOffset",
    "required": false,
    "type": "number"
  },
  {
    "description": "<p>Determines the width of the popper content.</p>\n<ul>\n<li><code>anchor-width</code>: Matches the width of the trigger element.</li>\n<li><code>available-width</code>: Expands to fit the available space.</li>\n<li><code>null</code>: Uses the natural width of the content.</li>\n</ul>\n",
    "name": "popoverWidth",
    "required": false,
    "type": "PopperWidth | null"
  }
]

const eventsData = [
  {
    "description": "",
    "name": "update:isOpen",
    "type": "[value: boolean]"
  }
]

const slotsData = [
  {
    "description": "",
    "name": "content",
    "type": "-"
  },
  {
    "description": "",
    "name": "trigger",
    "type": "-"
  }
]

export default {
  setup() {
    return {
      createTooltipStyle,
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

<ClassConfig :style-function="createTooltipStyle" />