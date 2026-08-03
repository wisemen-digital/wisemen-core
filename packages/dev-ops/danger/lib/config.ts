/**
 * Default configuration for all rules
 *
 * This configuration is used when no explicit configuration is provided.
 * Client repositories can override these defaults in their Dangerfile.
 */

// Type for individual rule configuration
export interface RuleConfig {
  enabled?: boolean
  [key: string]: unknown
}

// Type for all rule configurations
export interface RuleConfigs {
  [ruleId: string]: RuleConfig
}

// Type for global configuration
export interface GlobalConfig {
  failOnError?: boolean
  postReview?: boolean
  deleteOldComments?: boolean
  commentPrefix?: string
  /**
   * Base path this config applies to, e.g. `apps/api`.
   * Empty string / undefined means "whole repo" (root scope).
   * Rules are only run when changed files fall under this path -
   * see `lib/scope.ts` and `createRuleRunner.run` for enforcement.
   */
  scope?: string
}

// Type for full configuration
export interface DefaultConfig extends GlobalConfig {
  rules: RuleConfigs
}

// Default config for each built-in rule
export const defaultRuleConfigs = {
  'conventional-commits': {
    enabled: false,
    types: ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore'],
    requireScope: false,
    requireSubject: true
  },
  'changelog-updated': {
    enabled: true
  }
} as const

/**
 * Global default configuration
 */
export const defaultGlobalConfig: GlobalConfig = {
  // Whether to fail the build if any rule fails
  failOnError: true,
  // Whether to post comments as PR reviews
  postReview: true,
  // Whether to delete old comments before posting new ones
  deleteOldComments: true,
  // Prefix for Danger comments
  commentPrefix: '🚨 Danger'
}

/**
 * Full default configuration
 */
export const defaultConfig: DefaultConfig = {
  ...defaultGlobalConfig,
  rules: { ...defaultRuleConfigs }
}

/**
 * Merge user config with defaults
 * @param userConfig - Partial configuration to merge with defaults
 * @returns Merged configuration
 */
export function mergeConfig (userConfig: Partial<DefaultConfig> = {}): DefaultConfig {
  const merged: DefaultConfig = { ...defaultConfig }

  // Merge global config
  if (userConfig.failOnError !== undefined) {
    merged.failOnError = userConfig.failOnError
  }
  if (userConfig.postReview !== undefined) {
    merged.postReview = userConfig.postReview
  }
  if (userConfig.deleteOldComments !== undefined) {
    merged.deleteOldComments = userConfig.deleteOldComments
  }
  if (userConfig.commentPrefix !== undefined) {
    merged.commentPrefix = userConfig.commentPrefix
  }
  if (userConfig.scope !== undefined) {
    merged.scope = userConfig.scope
  }

  // Merge rule configs
  if (userConfig.rules) {
    for (const [ruleId, ruleConfig] of Object.entries(userConfig.rules)) {
      if (ruleId in merged.rules) {
        merged.rules[ruleId] = { ...merged.rules[ruleId], ...ruleConfig }
      } else {
        merged.rules[ruleId] = ruleConfig
      }
    }
  }

  return merged
}
