import type { PackageDocNavigation } from '@docs/packages/navigation.utils'

export const COMPONENTS_DOC_NAVIGATION: PackageDocNavigation = {
  link: 'getting-started/installation',
  title: 'Components',
  path: 'components',
  sidebar: [
    {
      items: [
        {
          text: 'Changelog',
          link: 'changelog',
        },
      ],
    },
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: 'getting-started/installation',
        },
        {
          text: 'Theming',
          link: 'getting-started/theming',
        },
        {
          text: 'Icons',
          link: 'getting-started/icons',
        },
        {
          text: 'Customization',
          link: 'getting-started/customization',
        },
        {
          text: 'Composition',
          link: 'getting-started/composition',
        },
      ],
    },
    {
      text: 'Components',
      items: [
        {
          text: 'Buttons & Links',
          items: [
            {
              text: 'Button',
              link: 'components/button/button',
            },
            {
              text: 'Icon Button',
              link: 'components/icon-button/icon-button',
            },
            {
              text: 'Router Link Button',
              link: 'components/router-link-button/router-link-button',
            },
          ],
        },
        {
          text: 'Forms & Inputs',
          items: [
            {
              text: 'Autocomplete',
              link: 'components/autocomplete/autocomplete',
            },
            {
              text: 'Address Autocomplete',
              link: 'components/address-autocomplete/address-autocomplete',
            },
            {
              text: 'Checkbox Group',
              link: 'components/checkbox-group/checkbox-group',
            },
            {
              text: 'Checkbox',
              link: 'components/checkbox/checkbox',
            },
            {
              text: 'Date Field',
              link: 'components/date-field/date-field',
            },
            {
              text: 'Date Range Field',
              link: 'components/date-range-field/date-range-field',
            },
            {
              text: 'File Upload',
              link: 'components/file-upload/file-upload',
            },
            {
              text: 'Form Field',
              link: 'components/form-field/form-field',
            },
            {
              text: 'Number Field',
              link: 'components/number-field/number-field',
            },
            {
              text: 'Password Field',
              link: 'components/password-field/password-field',
            },
            {
              text: 'Phone Number Field',
              link: 'components/phone-number-field/phone-number-field',
            },
            {
              text: 'Radio Group',
              link: 'components/radio-group/radio-group',
            },
            {
              text: 'Select',
              link: 'components/select/select',
            },
            {
              text: 'Switch',
              link: 'components/switch/switch',
            },
            {
              text: 'Text Field',
              link: 'components/text-field/text-field',
            },
            {
              text: 'Textarea',
              link: 'components/textarea/textarea',
            },
            {
              text: 'Time Field',
              link: 'components/time-field/time-field',
            },
          ],
        },
        {
          text: 'Navigation & Layout',
          items: [
            {
              text: 'Dialog',
              link: 'components/dialog/dialog',
            },
            {
              text: 'Dropdown Menu',
              link: 'components/dropdown-menu/dropdown-menu',
            },
            {
              text: 'Popover',
              link: 'components/popover/popover',
            },
            {
              text: 'Router Link Tabs',
              link: 'components/router-link-tabs/router-link-tabs',
            },
            {
              text: 'Table',
              link: 'components/table/table',
            },
            {
              text: 'Tabs',
              link: 'components/tabs/tabs',
            },
            {
              text: 'Tooltip',
              link: 'components/tooltip/tooltip',
            },
          ],
        },
        {
          text: 'Keyboard & Shortcuts',
          items: [
            {
              text: 'Keyboard Key',
              link: 'components/keyboard-key/keyboard-key',
            },
            {
              text: 'Keyboard Shortcut',
              link: 'components/keyboard-shortcut/keyboard-shortcut',
            },
            {
              text: 'Keyboard Shortcut Provider',
              link: 'components/keyboard-shortcut-provider/keyboard-shortcut-provider',
            },
          ],
        },
        {
          text: 'Miscellaneous',
          items: [
            {
              text: 'Avatar',
              link: 'components/avatar/avatar',
            },
            {
              text: 'Badge',
              link: 'components/badge/badge',
            },
            {
              text: 'Date Picker',
              link: 'components/date-picker/date-picker',
            },
            {
              text: 'Date Range Picker',
              link: 'components/date-range-picker/date-range-picker',
            },
            {
              text: 'Toast',
              link: 'components/toast/toast',
            },
          ],
        },
      ],
    },
  ],
}
