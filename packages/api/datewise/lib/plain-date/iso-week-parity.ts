export enum IsoWeekParity {
  ODD = 'ODD',
  EVEN = 'EVEN',
}

export function getIsoWeekParity (weekNumber: number): IsoWeekParity {
  return weekNumber % 2 === 1
    ? IsoWeekParity.ODD
    : IsoWeekParity.EVEN
}
