function linearize(c: number): number {
  const s = c / 255

  return s <= 0.040_45 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

function getRelativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

function parseColorToRgb(color: string): [number, number, number] {
  const canvas = document.createElement('canvas')

  canvas.width = 1
  canvas.height = 1

  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)

  const data = ctx.getImageData(0, 0, 1, 1).data

  return [
    data[0]!,
    data[1]!,
    data[2]!,
  ]
}

function contrastRatio(lum1: number, lum2: number): number {
  const [
    l,
    d,
  ] = lum1 > lum2
    ? [
        lum1,
        lum2,
      ]
    : [
        lum2,
        lum1,
      ]

  return (l + 0.05) / (d + 0.05)
}

export function setupBrandTextColor(): void {
  const el = document.documentElement
  const styles = getComputedStyle(el)

  const brandBg = styles.getPropertyValue('--bg-brand-solid').trim()
  const darkTextColor = styles.getPropertyValue('--text-primary').trim()

  const brandLum = getRelativeLuminance(...parseColorToRgb(brandBg))
  const darkLum = getRelativeLuminance(...parseColorToRgb(darkTextColor))

  const contrastWithWhite = contrastRatio(1, brandLum)
  const contrastWithDark = contrastRatio(darkLum, brandLum)

  const chosen = contrastWithWhite >= contrastWithDark ? 'var(--white)' : 'var(--text-primary)'

  el.style.setProperty('--text-primary-on-brand', chosen)
}
