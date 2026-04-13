/* eslint-disable ts/no-empty-object-type */
import type { VariantProps } from 'tailwind-variants'

import type { createAvatarStyle } from '@/components/avatar/avatar.style'
import type { createBadgeStyle } from '@/components/badge/badge.style'
import type { createButtonStyle } from '@/components/button/default-button/button.style'
import type { createIconButtonStyle } from '@/components/button/icon-button/iconButton.style'
import type { createRouterLinkButtonStyle } from '@/components/button/router-link-button/routerLinkButton.style'
import type { createCheckboxStyle } from '@/components/checkbox/checkbox.style'
import type { createDateFieldStyle } from '@/components/date-field/dateField.style'
import type { createDateRangePickerStyle } from '@/components/date-picker/range/dateRangePicker.style'
import type { createDatePickerStyle } from '@/components/date-picker/single/datePicker.style'
import type { createDateRangeFieldStyle } from '@/components/date-range-field/dateRangeField.style'
import type { createDialogStyle } from '@/components/dialog/dialog.style'
import type { createDropdownMenuStyle } from '@/components/dropdown-menu/dropdownMenu.style'
import type { createFormFieldStyle } from '@/components/form-field/formField.style'
import type { createKeyboardKeyStyle } from '@/components/keyboard-key/keyboardKey.style'
import type { createKeyboardShortcutStyle } from '@/components/keyboard-shortcut/keyboardShortcut.style'
import type { createNumberFieldStyle } from '@/components/number-field/numberField.style'
import type { createPhoneNumberFieldStyle } from '@/components/phone-number-field/phoneNumberField.style'
import type { createPopoverStyle } from '@/components/popover/popover.style'
import type { createRadioGroupItemStyle } from '@/components/radio-group-item/radioGroupItem.style'
import type { createSelectStyle } from '@/components/select/style/select.style'
import type { createSwitchStyle } from '@/components/switch/switch.style'
import type { createTableStyle } from '@/components/table/table.style'
import type { createTabsStyle } from '@/components/tabs/shared/tabs.style'
import type { createTextFieldStyle } from '@/components/text-field/textField.style'
import type { createTextareaStyle } from '@/components/textarea/textarea.style'
import type { createTimeFieldStyle } from '@/components/time-field/timeField.style'
import type { createToastStyle } from '@/components/toast/toast.style'
import type { createTooltipStyle } from '@/components/tooltip/tooltip.style'

export interface ComponentMap {
  avatar: {
    style: typeof createAvatarStyle
    children: {}
  }
  badge: {
    style: typeof createBadgeStyle
    children: {
      removeButton: 'iconButton'
    }
  }
  button: {
    style: typeof createButtonStyle
    children: {}
  }
  checkbox: {
    style: typeof createCheckboxStyle
    children: {}
  }
  dateField: {
    style: typeof createDateFieldStyle
    children: {
      datePicker: 'datePicker'
    }
  }
  datePicker: {
    style: typeof createDatePickerStyle
    children: {}
  }
  dateRangeField: {
    style: typeof createDateRangeFieldStyle
    children: {
      datePicker: 'dateRangePicker'
    }
  }
  dateRangePicker: {
    style: typeof createDateRangePickerStyle
    children: {}
  }
  dialog: {
    style: typeof createDialogStyle
    children: {
      closeButton: 'iconButton'
    }
  }
  dropdownMenu: {
    style: typeof createDropdownMenuStyle
    children: {}
  }
  formField: {
    style: typeof createFormFieldStyle
    children: {}
  }
  iconButton: {
    style: typeof createIconButtonStyle
    children: {}
  }
  keyboardKey: {
    style: typeof createKeyboardKeyStyle
    children: {}
  }
  keyboardShortcut: {
    style: typeof createKeyboardShortcutStyle
    children: {
      keyboardKey: 'keyboardKey'
    }
  }
  numberField: {
    style: typeof createNumberFieldStyle
    children: {
      decrement: 'iconButton'
      increment: 'iconButton'
    }
  }
  phoneNumberField: {
    style: typeof createPhoneNumberFieldStyle
    children: {
      input: 'textField'
      select: 'select'
    }
  }
  popover: {
    style: typeof createPopoverStyle
    children: {
      closeButton: 'iconButton'
    }
  }
  radioGroupItem: {
    style: typeof createRadioGroupItemStyle
    children: {}
  }
  routerLinkButton: {
    style: typeof createRouterLinkButtonStyle
    children: {}
  }
  select: {
    style: typeof createSelectStyle
    children: {
      dropdownSearchInput: 'textField'
      popover: 'popover'
    }
  }
  switch: {
    style: typeof createSwitchStyle
    children: {}
  }
  table: {
    style: typeof createTableStyle
    children: {
      headerCellButton: 'button'
    }
  }
  tabs: {
    style: typeof createTabsStyle
    children: {
      scrollButton: 'iconButton'
    }
  }
  textarea: {
    style: typeof createTextareaStyle
    children: {}
  }
  textField: {
    style: typeof createTextFieldStyle
    children: {}
  }
  timeField: {
    style: typeof createTimeFieldStyle
    children: { }
  }
  toast: {
    style: typeof createToastStyle
    children: {
      closeButton: 'iconButton'
    }
  }
  tooltip: {
    style: typeof createTooltipStyle
    children: {}
  }
}

/**
 * This is a placeholder for the variants defined by the user.
 */
export interface ComponentVariants {}

export type GetComponentSlots<TComponent extends keyof ComponentMap>
  = ReturnType<ComponentMap[TComponent]['style']>

export type GetComponentProps<TComponent extends keyof ComponentMap> = {
  [K in keyof VariantProps<ComponentMap[TComponent]['style']>]: VariantProps<ComponentMap[TComponent]['style']>[K] extends undefined
    ? null
    : VariantProps<ComponentMap[TComponent]['style']>[K]
}

/**
 * Return the predefined values and the custom values defined by the user
 */
export type GetComponentProp<
  TComponent extends keyof ComponentMap, TProp extends keyof GetComponentProps<TComponent>,
> = (ComponentVariants extends { variants: Array<infer TVariant> }
  ? TVariant extends CustomClassVariant<TComponent, TProp, infer TTargetPropValue>
    ? TTargetPropValue
    : never
  : never) | GetComponentProps<TComponent>[TProp]

export type ResolvedClassConfig<TComponent extends keyof ComponentMap> = {
  [KSlot in keyof GetComponentSlots<TComponent>]?: string
} & {
  [KChild in keyof ComponentMap[TComponent]['children']]?: ResolvedClassConfig<
    ComponentMap[TComponent]['children'][KChild] extends keyof ComponentMap
      ? ComponentMap[TComponent]['children'][KChild]
      : never
  >
}

export interface CustomizableElement<TComponent extends keyof ComponentMap> {
  /**
   * The class configuration for the component. This allows customizating the default styles
   * by overriding them with custom values.
   */
  classConfig?: ResolvedClassConfig<TComponent> | null
}

export interface CustomClassVariant<
  TComponent extends keyof ComponentMap,
  TTargetProp extends keyof GetComponentProps<TComponent>,
  TTargetPropNewValue extends string,
> {
  config: ResolvedClassConfig<TComponent>
  target?: {
    prop: TTargetProp
    value: GetComponentProps<TComponent>[TTargetProp] | TTargetPropNewValue
  }
  theme?: string & {} | 'default'
  component: TComponent
}

export type CustomComponentVariant<TComponent extends keyof ComponentMap> = {
  [KSlot in keyof GetComponentSlots<TComponent>]: string
}
