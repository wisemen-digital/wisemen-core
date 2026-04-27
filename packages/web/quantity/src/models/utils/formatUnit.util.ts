export function formatUnitValue(
  value: number,
  unit: string,
  intlUnit?: string,
): string {
  if (intlUnit !== undefined) {
    try {
      return new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 1,
        style: 'unit',
        unit: intlUnit,
        unitDisplay: 'short',
      }).format(value)
    }
    catch {
      // Some BE units do not have a valid Intl unit mapping in all runtimes.
    }
  }

  return `${new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  }).format(value)} ${unit}`
}
