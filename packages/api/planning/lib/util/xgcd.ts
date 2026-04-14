export function xgcd (a: number, b: number): [number, number, number] {
  let [oldR, r] = [a, b]
  let [oldS, s] = [1, 0]
  let [oldT, t] = [0, 1]

  while (r !== 0) {
    const quotient = Math.floor(oldR / r);

    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
    [oldT, t] = [t, oldT - quotient * t]
  }

  return [oldR, oldS, oldT]
}
