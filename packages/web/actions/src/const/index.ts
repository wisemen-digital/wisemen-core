export const DEFAULT_MIN_SEARCH_INPUT_LENGTH = 2
export const DEFAULT_MAX_SUB_ACTIONS = 99
export const DEFAULT_MIN_APPLICABILITY_SCORE = 0.24
export const SECONDARY_SCORE_WEIGHT = 0.85
export const PARENT_ACTION_SCORE_PENALTY = -0.15
export const SCORE_GROUP_PRIORITY_THRESHOLD = 0.05
/**
 * Same idea as SCORE_GROUP_PRIORITY_THRESHOLD, but used when grouping is
 * disabled (flat list, no section headers). Narrower than the grouped
 * threshold so group priority only breaks near-ties caused by score noise
 * (e.g. two prefix matches of slightly different length) rather than
 * overriding a real relevance gap between matches.
 */
export const DISABLED_GROUPING_SCORE_GROUP_PRIORITY_THRESHOLD = 0.02
