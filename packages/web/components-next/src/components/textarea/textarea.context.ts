import type {
  ComputedRef,
  Ref,
} from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { TextareaProps } from '@/components/textarea/textarea.props'
import type { CreateTextareaStyle } from '@/components/textarea/textarea.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface TextareaContext extends PropsToComputed<TextareaProps> {
  customClassConfig: ComputedRef<ResolvedClassConfig<'textarea'>>
  modelValue: Ref<string | null>
  style: ComputedRef<CreateTextareaStyle>
  onBlur: (event: FocusEvent) => void
  onFocus: (event: FocusEvent) => void
}

export const [
  useProvideTextareaContext,
  useInjectTextareaContext,
] = useContext<TextareaContext>('textareaContext')
