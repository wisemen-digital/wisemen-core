<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
import { createAutocompleteStyle } from '@/ui/autocomplete/autocomplete.style'

const propsData = [
  {
    "description": "<p>The autocomplete attribute of the input.</p>\n",
    "name": "autocomplete",
    "required": false,
    "type": "string"
  },
  {
    "description": "<p>Provides a reason why the element is disabled,\nwhen provided a tooltip will be shown on hover with the provided text.</p>\n",
    "name": "disabledReason",
    "required": false,
    "type": "string | null"
  },
  {
    "default": "true",
    "description": "<p>Disables flipping the popper to the opposite side when there is insufficient space.</p>\n",
    "name": "disableSideFlip",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>Disables updating the popper's position on layout shifts.</p>\n",
    "name": "disableUpdateOnLayoutShift",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>Function to display the item label.</p>\n",
    "name": "displayFn",
    "required": true,
    "type": "AutocompleteDisplayFn<TValue>"
  },
  {
    "description": "<p>The error associated with the input.</p>\n",
    "name": "errorMessage",
    "required": false,
    "type": "string | null"
  },
  {
    "description": "<p>The id of the element the label is for.</p>\n",
    "name": "for",
    "required": false,
    "type": "string | null"
  },
  {
    "default": "null",
    "description": "<p>Maps a value to its visual config (avatar, icon, status, etc.).\nUsed in each dropdown option.</p>\n",
    "name": "getItemConfig",
    "required": false,
    "type": "((value: NonNullable<TValue>) => MenuItemConfig | null) | null"
  },
  {
    "description": "<p>The help text displayed in a tooltip next to the label.\nWhen provided, a help circle icon is shown next to the label.</p>\n",
    "name": "helpText",
    "required": false,
    "type": "string | null"
  },
  {
    "description": "<p>Determines whether to hide the error message visually.</p>\n",
    "name": "hideErrorMessage",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>The hint text of the input.</p>\n",
    "name": "hint",
    "required": false,
    "type": "string | null"
  },
  {
    "description": "<p>The icon displayed on the left side of the input.</p>\n",
    "name": "iconLeft",
    "required": false,
    "type": "Component | null"
  },
  {
    "description": "<p>The id of the element.</p>\n",
    "name": "id",
    "required": false,
    "type": "string | null"
  },
  {
    "description": "<p>Determines whether the element is disabled. When <code>true</code>, the element becomes non-interactive.</p>\n",
    "name": "isDisabled",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>Whether the label and hint are displayed horizontally.</p>\n",
    "name": "isHorizontal",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>Whether the label is visually hidden but still accessible to screen readers.</p>\n",
    "name": "isLabelHidden",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>Whether the input is in a loading state.</p>\n",
    "name": "isLoading",
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
    "description": "<p>Whether the input is read-only. When <code>true</code>, the input value cannot be changed.</p>\n",
    "name": "isReadonly",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>Whether the input is required.</p>\n",
    "name": "isRequired",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>The items to display in the autocomplete dropdown.</p>\n",
    "name": "items",
    "required": true,
    "type": "AutocompleteItem<TValue>[]"
  },
  {
    "description": "<p>The label of the input.</p>\n",
    "name": "label",
    "required": false,
    "type": "string | null"
  },
  {
    "description": "",
    "name": "modelValue",
    "required": true,
    "type": "TValue | null"
  },
  {
    "description": "<p>The name of the input.</p>\n",
    "name": "name",
    "required": false,
    "type": "string | null"
  },
  {
    "description": "<p>The placeholder text of the input.</p>\n",
    "name": "placeholder",
    "required": false,
    "type": "string | null"
  },
  {
    "default": "\"center\"",
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
    "default": "8",
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
    "default": "\"bottom\"",
    "description": "<p>Defines which side the content should appear on.\nOptions are 'top', 'right', 'bottom', or 'left'.</p>\n",
    "name": "popoverSide",
    "required": false,
    "type": "PopperSide"
  },
  {
    "default": "4",
    "description": "<p>The distance in pixels between the popper content and the trigger element.</p>\n",
    "name": "popoverSideOffset",
    "required": false,
    "type": "number"
  },
  {
    "default": "\"anchor-width\"",
    "description": "<p>Determines the width of the popper content.</p>\n<ul>\n<li><code>anchor-width</code>: Matches the width of the trigger element.</li>\n<li><code>available-width</code>: Expands to fit the available space.</li>\n<li><code>null</code>: Uses the natural width of the content.</li>\n</ul>\n",
    "name": "popoverWidth",
    "required": false,
    "type": "PopperWidth | null"
  },
  {
    "default": "true",
    "description": "<p>Constrain the content to remain within the viewport. This may cause it\nto overlap the reference element, which might be undesirable.</p>\n",
    "name": "prioritizePosition",
    "required": false,
    "type": "boolean"
  },
  {
    "default": "\"remote\"",
    "description": "<p>The search mode of the autocomplete.</p>\n<ul>\n<li><code>local</code>: filtering is done on the client side</li>\n<li><code>remote</code>: filtering is done on the server side. Handle the <code>update:search</code> event to fetch results.</li>\n</ul>\n",
    "name": "searchMode",
    "required": false,
    "type": "\"local\" | \"remote\""
  },
  {
    "default": "\"md\"",
    "description": "<p>The size of the autocomplete.</p>\n",
    "name": "size",
    "required": false,
    "type": "\"md\" | \"sm\""
  }
]

const eventsData = [
  {
    "description": "",
    "name": "blur",
    "type": "[]"
  },
  {
    "description": "",
    "name": "nextPage",
    "type": "[]"
  },
  {
    "description": "",
    "name": "update:modelValue",
    "type": "[value: TValue | null]"
  },
  {
    "description": "",
    "name": "update:search",
    "type": "[searchTerm: string]"
  }
]

const slotsData = [
  {
    "description": "",
    "name": "label-left",
    "type": "-"
  },
  {
    "description": "",
    "name": "label-right",
    "type": "-"
  },
  {
    "description": "",
    "name": "left",
    "type": "-"
  }
]

export default {
  setup() {
    return {
      createAutocompleteStyle,
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

<ClassConfig :style-function="createAutocompleteStyle" />