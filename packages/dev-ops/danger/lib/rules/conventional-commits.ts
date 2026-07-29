/**
 * Conventional Commits Rule
 * Checks if commit messages follow conventional commits convention
 */

import { createRule, ResultType } from 'lib/interface.js'

// Regex pattern for conventional commits
// format: <type>(<optional scope>): <description>
// examples: feat: add user authentication, fix(api): handle null values
const conventionalCommitRegex = /^([a-z]+)(?:\(([^)]+)\))?:\s(.+)$/i

export const conventionalCommitsRule = createRule(
  'conventional-commits',
  'Conventional Commits',
  'Checks if commit messages follow the conventional commits convention',
  ({ danger, config }) => {
    const { git } = danger
    const commits = git.commits

    if (commits.length === 0) {
      return Promise.resolve({ passed: true, message: 'No commits to check' })
    }

    const validTypes = (config.types as string[] | undefined) ?? ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore']
    const requireScope = (config.requireScope as boolean | undefined) ?? false
    const requireSubject = (config.requireSubject as boolean | undefined) ?? true

    const violations: string[] = []

    for (const commit of commits) {
      const message = commit.message || ''
      const subject = message.split('\n')[0] // Get first line

      const match = conventionalCommitRegex.exec(subject)

      if (!match) {
        violations.push(`Commit "${subject}" doesn't follow conventional commits format`)

        continue
      }

      const [, type, scope, description] = match
      const commitType = type.toLowerCase()

      // Check if type is valid
      if (!validTypes.includes(commitType)) {
        violations.push(`Commit "${subject}" has invalid type "${commitType}". Valid types: ${validTypes.join(', ')}`)

        continue
      }

      // Check if scope is required but missing
      if (requireScope && !scope) {
        violations.push(`Commit "${subject}" is missing scope`)

        continue
      }

      // Check if description is required but missing
      if (requireSubject && !description.trim()) {
        violations.push(`Commit "${subject}" is missing description`)

        continue
      }
    }

    if (violations.length === 0) {
      return Promise.resolve({ passed: true, message: `All ${commits.length} commit(s) follow conventional commits` })
    }

    const message = violations.join('\n')

    return Promise.resolve({ passed: false, message, type: ResultType.WARN })
  },
  {
    types: ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore'],
    requireScope: false,
    requireSubject: true
  }
)
