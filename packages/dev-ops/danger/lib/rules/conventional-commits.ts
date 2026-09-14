/**
 * Conventional Commits Rule
 * Checks if the PR title, commit messages, and/or PR description follow the
 * conventional commits convention. Each source is independently configurable.
 */

import type { GitHubPRDSL } from 'danger'
import { createRule, ResultType } from '../interface.js'

// Regex pattern for conventional commits
// format: <type>(<optional scope>): <description>
// examples: feat: add user authentication, fix(api): handle null values
const conventionalCommitRegex = /^([a-z]+)(?:\(([^)]+)\))?:\s(.+)$/i

function findConventionalCommitViolation (
  subject: string,
  validTypes: string[]
): string | undefined {
  const match = conventionalCommitRegex.exec(subject)

  if (!match) {
    return 'doesn\'t follow conventional commits format'
  }

  const [, type] = match
  const commitType = type.toLowerCase()

  if (!validTypes.includes(commitType)) {
    return `has invalid type "${commitType}". Valid types: ${validTypes.join(', ')}`
  }

  return undefined
}

export const conventionalCommitsRule = createRule(
  'conventional-commits',
  'Conventional Commits',
  'Checks if the PR title, commit messages, and/or PR description follow the conventional commits convention',
  ({ danger, config }) => {
    const { git, github } = danger

    const validTypes = (config.types as string[]) ?? ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore']
    const resultType = config.resultType as ResultType

    const checkTitle = config.checkTitle as boolean
    const checkCommitMessages = config.checkCommitMessages as boolean
    const checkDescription = config.checkDescription as boolean

    const violations: string[] = []

    // `danger.github` is typed as always-present for DSL convenience, but is actually
    // undefined when Danger isn't running against a GitHub PR.
    const pr = github?.pr as GitHubPRDSL | undefined

    if (checkTitle && pr != null) {
      const violation = findConventionalCommitViolation(pr.title, validTypes)

      if (violation !== undefined) {
        violations.push(`PR title "${pr.title}" ${violation}`)
      }
    }

    if (checkDescription && pr?.body != null && pr.body !== '') {
      const subject = pr.body.split('\n')[0]
      const violation = findConventionalCommitViolation(subject, validTypes)

      if (violation !== undefined) {
        violations.push(`PR description "${subject}" ${violation}`)
      }
    }

    if (checkCommitMessages) {
      for (const commit of git.commits) {
        const message = commit.message || ''
        const subject = message.split('\n')[0] // Get first line
        const violation = findConventionalCommitViolation(subject, validTypes)

        if (violation !== undefined) {
          violations.push(`Commit "${subject}" ${violation}`)
        }
      }
    }

    if (violations.length === 0) {
      return Promise.resolve({ passed: true, message: 'All conventional commit checks passed' })
    }

    const message = violations.join('\n')

    return Promise.resolve({ passed: false, message, type: resultType })
  },
  {
    types: ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore'],
    checkTitle: true,
    checkCommitMessages: false,
    checkDescription: false,
    resultType: ResultType.FAIL
  }
)
