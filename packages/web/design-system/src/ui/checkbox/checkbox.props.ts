import type { BaseCheckboxProps } from '@/ui/checkbox/base/baseCheckbox.props'

export interface CheckboxProps extends Omit<BaseCheckboxProps, 'isIndeterminate'> {}
