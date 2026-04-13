import type { TextareaProps } from '@/components/textarea/textarea.props'

export { default as VcTextareaInput } from '@/components/textarea/parts/TextareaInput.vue'
export { default as VcTextareaRoot } from '@/components/textarea/parts/TextareaRoot.vue'
export type VcTextareaProps = Omit<TextareaProps, 'classConfig' | 'variant'>
export { default as VcTextarea } from '@/components/textarea/Textarea.vue'
