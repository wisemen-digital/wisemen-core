import type { SwitchProps } from '@/components/switch/switch.props'

export { default as VcSwitchRoot } from '@/components/switch/parts/SwitchRoot.vue'
export { default as VcSwitchThumb } from '@/components/switch/parts/SwitchThumb.vue'
export { default as VcSwitchThumbIcon } from '@/components/switch/parts/SwitchThumbIcon.vue'
export type VcSwitchProps = Omit<SwitchProps, 'classConfig' | 'size' | 'variant'>
export { default as VcSwitch } from '@/components/switch/Switch.vue'
