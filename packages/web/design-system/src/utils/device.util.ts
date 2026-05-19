const MOBILE_REGEX = /Mobi|Android/i
const TABLET_REGEX = /Tablet|iPad/i

export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window
    || navigator.maxTouchPoints > 0
    || (navigator as any).msMaxTouchPoints > 0
  )
}

export function isMobileDevice(): boolean {
  return MOBILE_REGEX.test(navigator.userAgent)
}

export function isTabletDevice(): boolean {
  return TABLET_REGEX.test(navigator.userAgent)
}
