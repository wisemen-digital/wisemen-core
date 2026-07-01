/**
 * @file Defines the configuration structure for a feature flag using Go Feature Flag.
 * @see https://gofeatureflag.org/docs/configure_flag/create-flags#format-details
 */

import { JsonValue } from "@openfeature/nestjs-sdk"

type VariationName = string

export interface ProgressiveRollout {
  initial: {
    variation: VariationName
    /**
      * ISO 8601 format.
      */
    date: string
  }
  end: {
    variation: VariationName
    /**
      * ISO 8601 format.
      */
    date: string
  }
}

export interface Rule {
  /**
     * A unique name
     */
  name?: string
  /**
     * The query to evaluate for targeting users.
     * @see https://gofeatureflag.org/docs/configure_flag/target-with-flags#query-formats
     */
  query?: string
  variation?: VariationName
  /**
   * The sum of percentages should be 100.
   */
  percentage?: Record<VariationName, number>
  progressiveRollout?: ProgressiveRollout
  disabled?: boolean
}

export interface GoFeatureFlagConfig {
  variations: Record<VariationName, JsonValue>
  defaultRule: Rule
  targeting?: Rule[]
  scheduledRollout?: {
    /**
     * ISO 8601 format.
     */
    date: string
    targeting: Rule[]
  }[]
  experimentation?: {
    /**
     * ISO 8601 format.
     */
    start: string
    /**
     * ISO 8601 format.
     */
    end: string
  }
  disable?: boolean
  trackEvents?: boolean
  version?: string
  metadata?: Record<string, unknown>
}
