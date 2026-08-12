/**
 * Split an env value string containing a comma separated set of values into individual values.
 * Empty values are omitted.
 */
export function parseEnvList (envValue: string | undefined): string[] {
  if (envValue === undefined) {
    return []
  }

  return envValue.split(',')
    .map(value => value.trim())
    .filter(value => value.length > 0)
}
