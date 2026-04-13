import type { ButtonProps } from '@/components/button/default-button/button.props'
import type { IconButtonProps } from '@/components/button/icon-button/iconButton.props'
import type { RouterLinkButtonProps } from '@/components/button/router-link-button/routerLinkButton.props'

export type VcButtonProps = Omit<ButtonProps, 'classConfig' | 'size' | 'variant'>

export { createButtonStyle } from '@/components/button/default-button/button.style'
export { default as VcButton } from '@/components/button/default-button/Button.vue'
export { default as VcButtonContent } from '@/components/button/default-button/parts/ButtonContent.vue'
export { default as VcButtonIconLeft } from '@/components/button/default-button/parts/ButtonIconLeft.vue'
export { default as VcButtonIconRight } from '@/components/button/default-button/parts/ButtonIconRight.vue'
export { default as VcButtonLoader } from '@/components/button/default-button/parts/ButtonLoader.vue'
export { default as VcButtonRoot } from '@/components/button/default-button/parts/ButtonRoot.vue'

// Router Link Button
export { default as VcRouterLinkButtonContent } from '@/components/button/router-link-button/parts/RouterLinkButtonContent.vue'
export { default as VcRouterLinkButtonIconLeft } from '@/components/button/router-link-button/parts/RouterLinkButtonIconLeft.vue'
export { default as VcRouterLinkButtonIconRight } from '@/components/button/router-link-button/parts/RouterLinkButtonIconRight.vue'
export { default as VcRouterLinkButtonRoot } from '@/components/button/router-link-button/parts/RouterLinkButtonRoot.vue'
export type { RouterLinkButtonProps } from '@/components/button/router-link-button/routerLinkButton.props'
export type VcRouterLinkButtonProps = Omit<RouterLinkButtonProps, 'classConfig' | 'size' | 'variant'>
export { createRouterLinkButtonStyle } from '@/components/button/router-link-button/routerLinkButton.style'
export { default as VcRouterLinkButton } from '@/components/button/router-link-button/RouterLinkButton.vue'

// Icon Button
export type { IconButtonProps } from '@/components/button/icon-button/iconButton.props'
export type VcIconButtonProps = Omit<IconButtonProps, 'classConfig' | 'size' | 'variant'>
export { createIconButtonStyle } from '@/components/button/icon-button/iconButton.style'
export { default as VcIconButton } from '@/components/button/icon-button/IconButton.vue'
export { default as VcIconButtonIcon } from '@/components/button/icon-button/parts/IconButtonIcon.vue'
export { default as VcIconButtonLoader } from '@/components/button/icon-button/parts/IconButtonLoader.vue'
export { default as VcIconButtonRoot } from '@/components/button/icon-button/parts/IconButtonRoot.vue'
