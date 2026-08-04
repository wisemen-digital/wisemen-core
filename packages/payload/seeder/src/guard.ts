/**
 * The local package deliberately has no environment kill switch. The `seed`
 * command is explicitly destructive, and access to the HTTP endpoint remains
 * protected by its configured access rule.
 */
export const seedingEnabled = (): boolean => true

export const SEED_DISABLED_MESSAGE = 'Seeding is disabled by the plugin configuration.'
