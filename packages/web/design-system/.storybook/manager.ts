import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

// Mirrors the design system's dark theme (.storybook/theme.css, `.default.dark`).
const theme = create({
  appBg: '#0d121c', // --gray-950
  appBorderColor: '#22262f', // --gray-800
  appBorderRadius: 8,
  appContentBg: '#0d121c',
  appPreviewBg: '#0d121c',
  barBg: '#0d121c',
  barHoverColor: '#9e77ed', // --brand-500
  barSelectedColor: '#9e77ed', // --brand-500
  barTextColor: '#85888e', // --gray-500
  base: 'dark',
  booleanBg: '#13161b',
  booleanSelectedBg: '#22262f',
  brandImage: './wisemen-logo.png',
  brandTarget: '_blank',
  brandTitle: 'Wisemen',
  brandUrl: 'https://www.wisemen.digital',
  buttonBg: '#13161b', // --gray-900
  buttonBorder: '#22262f', // --gray-800
  colorPrimary: '#9e77ed', // --brand-500
  colorSecondary: '#7f56d9', // --brand-600
  fontBase: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  inputBg: '#0d121c',
  inputBorder: '#22262f',
  inputBorderRadius: 6,
  inputTextColor: '#f0f1f1',
  textColor: '#f0f1f1', // --gray-100
  textInverseColor: '#13161b', // --gray-900
  textMutedColor: '#85888e', // --gray-500
})

addons.setConfig({
  theme,
})
