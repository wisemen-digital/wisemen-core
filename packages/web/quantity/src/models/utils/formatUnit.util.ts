export function formatUnitValue(
  value: number,
  unit: string,
  intlUnit?: string,
): string {
  if (intlUnit !== undefined) {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 1,
      style: 'unit',
      unit: intlUnit,
      unitDisplay: 'short',
    }).format(value)
  }

  return `${new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  }).format(value)} ${unit}`
}
