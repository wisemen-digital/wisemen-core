import type { GitHubPRDSL } from 'danger'
import { createRule, ResultType } from '../interface.js'

const ROOT_CHANGELOG_PATH = 'CHANGELOG.md'

const ENTRY_TEMPLATE
  = '```\n'
    + '## <short title of the change>\n'
    + '\n'
    + '### Description\n'
    + '<what changed and why>\n'
    + '\n'
    + '### Migration\n'
    + '<migration steps, or "None">\n'
    + '```'

export const changelogUpdatedRule = createRule(
  'changelog-updated',
  'Changelog Updated',
  'Checks if the changelog file has been updated in the pull request',
  async ({ danger, config, scope }) => {
    // Default target is derived from scope: root -> CHANGELOG.md, apps/api -> apps/api/CHANGELOG.md
    const defaultChangelogPath = scope === '' ? ROOT_CHANGELOG_PATH : `${scope}/CHANGELOG.md`
    const changelogPath = (config.changelogPath as string | undefined) ?? defaultChangelogPath
    const changeLogTemplate = (config.changelogEntryTemplate as string | undefined)
      ?? ENTRY_TEMPLATE

    const { github } = danger
    // `danger.github` is typed as always-present for DSL convenience, but is actually
    // undefined when Danger isn't running against a GitHub PR.
    const pr = github?.pr as GitHubPRDSL | undefined

    if (pr == null) {
      return { passed: true, message: 'Not a pull request, skipping file size check' }
    }

    const diff = await danger.git.diffForFile(changelogPath)

    if (!diff) {
      return { passed: false, message: `**CHANGELOG not updated.** Add an entry to \`${changelogPath}\`:\n\n` + changeLogTemplate, type: ResultType.FAIL }
    }

    const [, latestEntry = ''] = diff.after.split(/^##\s+/m)
    const isComplete = /###\s+Description\s*\n\s*\S[\s\S]*?\n###\s+Migration\s*\n\s*\S/i.test(latestEntry)

    if (!isComplete) {
      return {
        passed: false,
        message: '**CHANGELOG entry incomplete.** The latest entry needs text under both a '
          + '`### Description` and a `### Migration` heading (use `None` if there is no migration):\n\n'
          + changeLogTemplate,
        type: ResultType.FAIL
      }
    }

    return { passed: true, message: 'CHANGELOG entry looks complete.' }
  }, {
    // No static `changelogPath` default here - it's derived from `scope` at run time
    // (see above), and can still be overridden per-rule via config.
    changelogEntryTemplate: ENTRY_TEMPLATE
  }
)
