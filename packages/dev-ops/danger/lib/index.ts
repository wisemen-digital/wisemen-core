/**
 * Danger Rules Index
 *
 * This is the main entry point for the danger-rules package.
 * It exports all rules, the rule runner, and configuration utilities.
 */

import type { DangerDSLType } from 'danger'

import type { Rule, RuleResult, RuleContext } from './interface.js'
import { isValidRule, createRule, BaseRule, ResultType } from './interface.js'
import type { DefaultConfig, RuleConfigs, GlobalConfig, RuleConfig } from './config.js'
import { defaultConfig, defaultRuleConfigs, mergeConfig } from './config.js'
import type { ScopedFiles } from './scope.js'
import { getScopedFiles, isInScope } from './scope.js'

// Import all built-in rules
import { conventionalCommitsRule } from './rules/conventional-commits.js'
import { changelogUpdatedRule } from './rules/changelog.js'

// Danger injects `fail`/`warn`/`message` onto the process `global` at runtime rather than
// exporting them as real module exports - importing them from 'danger' throws at runtime.
type DangerReporterFn = (message: string, file?: string, line?: number) => void
const dangerGlobals = globalThis as unknown as {
  fail: DangerReporterFn
  warn: DangerReporterFn
  message: DangerReporterFn
}

/**
 * All built-in rules
 */
export const builtInRules: Record<string, Rule> = {
  'conventional-commits': conventionalCommitsRule,
  'changelog-updated': changelogUpdatedRule
}

/**
 * Load local rules from a directory
 * Local rules should conform to the Rule interface
 * @param directoryPath - Path to directory containing local rules
 * @returns Promise with object of rules
 */
export function loadLocalRules (directoryPath: string): Promise<Record<string, Rule>> {
  const rules: Record<string, Rule> = {}

  // Try to use dynamic import for ESM modules
  // This is a simplified implementation - in reality, you'd need to:
  // 1. Read the directory
  // 2. Import each .js or .ts file
  // 3. Validate that it's a valid rule

  // For now, we'll return an empty object
  // A real implementation would use import() with dynamic paths
  console.log(`Loading local rules from: ${directoryPath}`)

  return Promise.resolve(rules)
}

/**
 * Get all available rules (built-in + local)
 * @param localRules - Object with local rules to include
 * @returns Object with all rules
 */
export function getAllRules (localRules: Record<string, Rule> = {}): Record<string, Rule> {
  return { ...builtInRules, ...localRules }
}

/**
 * Result of running all rules
 */
export interface RuleRunnerResult {
  ruleId: string
  ruleName: string
  result: RuleResult
}

/**
 * Rule runner interface
 */
export interface RuleRunner {
  config: DefaultConfig
  run(danger: DangerDSLType, additionalRules?: Record<string, Rule>): Promise<RuleRunnerResult[]>
  reportResult(ruleId: string, ruleName: string, result: RuleResult): void
}

/**
 * Create a rule runner with the given configuration
 * @param config - Configuration to use
 * @returns Rule runner object
 */
export function createRuleRunner (config: Partial<DefaultConfig> = {}): RuleRunner {
  const mergedConfig = mergeConfig(config)

  return {
    config: mergedConfig,

    /**
     * Run all enabled rules
     * @param danger - Danger DSL object
     * @param additionalRules - Additional rules to include
     * @returns Promise with results
     */
    async run (
      this: RuleRunner,
      danger: DangerDSLType,
      additionalRules: Record<string, Rule> = {}
    ): Promise<RuleRunnerResult[]> {
      const allRules = getAllRules(additionalRules)
      const results: RuleRunnerResult[] = []

      const scope = mergedConfig.scope ?? ''
      const scopedFiles: ScopedFiles = getScopedFiles(danger, scope)
      const hasChangesInScope = scopedFiles.all.length > 0

      for (const [ruleId, rule] of Object.entries(allRules)) {
        const ruleConfig = { ...rule.defaultConfig, ...mergedConfig.rules?.[ruleId] }

        // Check if rule is enabled
        if (ruleConfig.enabled === false) {
          continue
        }

        // Scoped rules (non-root) should only run when this PR actually touches
        // their folder - e.g. an api-only rule must not fail a web-only PR.
        if (scope !== '' && !hasChangesInScope) {
          continue
        }

        try {
          const context = {
            danger,
            config: ruleConfig,
            globalConfig: mergedConfig,
            scope,
            scopedFiles,
            hasChangesInScope
          }

          const result = await rule.run(context)

          results.push({ ruleId, ruleName: rule.name, result })

          // Report the result
          this.reportResult(ruleId, rule.name, result)
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error)

          console.error(`Error running rule ${ruleId}:`, error)

          const result: RuleResult = {
            passed: false,
            message: `Error: ${errorMessage}`,
            type: ResultType.FAIL
          }

          results.push({ ruleId, ruleName: rule.name, result })

          // Report the error so it actually surfaces on the PR instead of failing silently
          this.reportResult(ruleId, rule.name, result)
        }
      }

      return results
    },

    /**
     * Report a rule result
     * @param ruleId - The rule identifier
     * @param ruleName - The rule name
     * @param result - The rule result
     */
    reportResult (_ruleId: string, ruleName: string, result: RuleResult): void {
      // Passing rules stay silent - only surface something when a rule actually fails/warns.
      if (result.passed) {
        return
      }

      const msg = `[${ruleName}] ${result.message}`

      switch (result.type) {
        case ResultType.FAIL:
          dangerGlobals.fail(msg)

          break
        case ResultType.WARN:
          dangerGlobals.warn(msg)

          break
        default:
          dangerGlobals.message(msg)
      }
    }
  }
}

/**
 * Main function to run Danger with all rules
 * This is the primary entry point used by the default Dangerfile
 *
 * @param danger - Danger DSL object
 * @param userConfig - User configuration (optional)
 * @param localRules - Local rules to include (optional)
 * @returns Promise
 */
export async function runDangerWithRules (
  danger: DangerDSLType,
  userConfig: Partial<DefaultConfig> = {},
  localRules: Record<string, Rule> = {}
): Promise<void> {
  const runner = createRuleRunner(userConfig)

  await runner.run(danger, localRules)
}

// Re-export everything for convenience
export { defaultConfig, defaultRuleConfigs, mergeConfig }
export type { DefaultConfig, GlobalConfig, RuleConfig, RuleConfigs }
export { isValidRule, createRule, BaseRule, ResultType }
export type { Rule, RuleResult, RuleContext }
export { getScopedFiles, isInScope }
export type { ScopedFiles }

// Export for CommonJS compatibility
if (typeof module !== 'undefined') {
  module.exports = {
    runDangerWithRules,
    createRuleRunner,
    getAllRules,
    loadLocalRules,
    builtInRules,
    defaultConfig,
    defaultRuleConfigs,
    mergeConfig,
    isValidRule,
    createRule,
    BaseRule,
    getScopedFiles,
    isInScope
  }
}
