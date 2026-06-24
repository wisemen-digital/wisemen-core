export enum IsoWeekParity {
  ODD = 'odd',
  EVEN = 'even',
}

export function getIsoWeekParity (weekNumber: number): IsoWeekParity {
  return weekNumber % 2 === 1
    ? IsoWeekParity.ODD
    : IsoWeekParity.EVEN
}
