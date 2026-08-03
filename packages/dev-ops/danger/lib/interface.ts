/**
 * Rule Interface for Danger Rules
 *
 * Each rule must conform to this interface to be compatible with the rules runner.
 */

import type { DangerDSLType } from 'danger'
import type { DefaultConfig, RuleConfig } from './config.js'
import type { ScopedFiles } from './scope.js'

// Enum for rule result types
export enum ResultType {
  WARN = 'warn',
  FAIL = 'fail',
  MESSAGE = 'message'
}

// Type for rule result
export interface RuleResult {
  passed: boolean
  message?: string
  type?: ResultType
}

// Type for rule context
export interface RuleContext {
  danger: DangerDSLType
  config: RuleConfig
  globalConfig: DefaultConfig
  /** Base path this rule is scoped to; `''` means the whole repo (root). */
  scope: string
  /** Git file lists pre-filtered to `scope`. Rules should read these instead of `danger.git.*`. */
  scopedFiles: ScopedFiles
  /** Whether any changed file falls under `scope`. Root scope is always `true`. */
  hasChangesInScope: boolean
}

// Type for a rule
export interface Rule {
  id: string
  name: string
  description: string
  defaultConfig: RuleConfig
  run(context: RuleContext): Promise<RuleResult>
}

/**
 * Base class that rules can extend for convenience
 * This is optional - rules can be plain objects as long as they conform to the interface
 */
export class BaseRule implements Rule {
  id: string
  name: string
  description: string
  defaultConfig: RuleConfig

  /**
   * @param id - Unique identifier
   * @param name - Human-readable name
   * @param description - Description
   * @param defaultConfig - Default configuration
   */
  constructor (id: string, name: string, description: string, defaultConfig: RuleConfig = {}) {
    this.id = id
    this.name = name
    this.description = description
    this.defaultConfig = defaultConfig
  }

  /**
   * Run the rule - must be implemented by subclasses
   * @param context - The rule context
   * @returns Promise with the rule result
   */
  run (_context: RuleContext): Promise<RuleResult> {
    throw new Error(`Rule ${this.id} must implement run() method`)
  }
}

/**
 * Helper to create a simple rule without extending BaseRule
 * @param id - Unique identifier
 * @param name - Human-readable name
 * @param description - Description of what the rule checks
 * @param run - The rule function
 * @param defaultConfig - Default configuration for the rule
 * @returns A valid Rule object
 */
export function createRule (
  id: string,
  name: string,
  description: string,
  run: (context: RuleContext) => Promise<RuleResult>,
  defaultConfig: RuleConfig = {}
): Rule {
  return {
    id,
    name,
    description,
    defaultConfig,
    run
  }
}

/**
 * Validate that a rule conforms to the interface
 * @param rule - The rule to validate
 * @returns true if the rule is valid
 */
export function isValidRule (rule: unknown): rule is Rule {
  return (
    typeof rule === 'object'
    && rule !== null
    && typeof (rule as Rule).id === 'string'
    && typeof (rule as Rule).name === 'string'
    && typeof (rule as Rule).description === 'string'
    && typeof (rule as Rule).defaultConfig === 'object'
    && typeof (rule as Rule).run === 'function'
  )
}
