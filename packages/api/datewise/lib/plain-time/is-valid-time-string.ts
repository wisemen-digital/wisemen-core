export const TIME_REGEX = /^(?:([01][0-9]|2[0-3]):[0-5][0-9]$|([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](?:\.\d{1,3})?$|24:00$|24:00:00(?:\.0{1,3})?)$/

export function isValidTimeString (timeString?: string | null): boolean {
  return timeString != null && TIME_REGEX.test(timeString)
}
