export function formatUnitValue(
  value: number,
  unit: string,
  intlUnit?: string,
): string {
  if (intlUnit !== undefined) {
    try {
      // TODO: make maximumFractionDigits configurable
      return new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 1,
        style: 'unit',
        unit: intlUnit,
        unitDisplay: 'short',
      }).format(value)
    }
    catch {
      // Fall through to plain formatting when the unit identifier is unsupported
    }
  }

  return `${new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  }).format(value)} ${unit}`
}
