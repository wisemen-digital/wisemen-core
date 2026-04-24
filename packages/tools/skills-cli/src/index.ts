import process from 'node:process'

import { Command } from 'commander'

import { check } from './commands/check.js'
import { list } from './commands/list.js'
import { sync } from './commands/sync.js'
import type { TargetName } from './types.js'
import { findWorkspaceRoot } from './workspace.js'

function parseTargets(value: string | undefined): TargetName[] | undefined {
  if (value === undefined || value.length === 0) { return undefined }

  return value.split(',').map((t) => t.trim()) as TargetName[]
}

function resolveProjectRoot(raw: string | undefined): string {
  if (raw !== undefined) {
    return raw
  }

  const cwd = process.cwd()

  return findWorkspaceRoot(cwd) ?? cwd
}

function run(): void {
  const program = new Command()

  program
    .name('wisemen-skills')
    .description('Sync AI coding skills from installed @wisemen/* packages into the current project.')
    .version('0.1.0')

  program
    .command('sync')
    .description('Scan installed @wisemen/* packages and render skills to the configured adapters.')
    .option('--target <names>', 'Comma-separated list of adapter targets (claude,agents-md,llms-txt).')
    .option('--dry-run', 'Print changes without writing files.', false)
    .option('--silent', 'Suppress informational output.', false)
    .option('--verbose', 'Print every file that would change.', false)
    .option('--cwd <path>', 'Project root (defaults to current working directory).')
    .action(async (opts: {
      cwd?: string
      dryRun: boolean
      silent: boolean
      target?: string
      verbose: boolean
    }) => {
      const code = await sync({
        cwd: resolveProjectRoot(opts.cwd),
        dryRun: opts.dryRun,
        silent: opts.silent,
        targets: parseTargets(opts.target),
        verbose: opts.verbose,
      })

      process.exit(code)
    })

  program
    .command('check')
    .description('Exit non-zero if the synced files would change. Use in CI.')
    .option('--target <names>', 'Comma-separated list of adapter targets (claude,agents-md,llms-txt).')
    .option('--silent', 'Suppress informational output.', false)
    .option('--verbose', 'Print every drifted file.', false)
    .option('--cwd <path>', 'Project root (defaults to current working directory).')
    .action(async (opts: {
      cwd?: string
      silent: boolean
      target?: string
      verbose: boolean
    }) => {
      const code = await check({
        cwd: resolveProjectRoot(opts.cwd),
        silent: opts.silent,
        targets: parseTargets(opts.target),
        verbose: opts.verbose,
      })

      process.exit(code)
    })

  program
    .command('list')
    .description('Print the discovered skills per package.')
    .option('--silent', 'Suppress informational output.', false)
    .option('--cwd <path>', 'Project root (defaults to current working directory).')
    .action(async (opts: { cwd?: string
      silent: boolean }) => {
      const code = await list({
        cwd: resolveProjectRoot(opts.cwd),
        silent: opts.silent,
      })

      process.exit(code)
    })

  program.parseAsync(process.argv).catch((error: unknown) => {
    console.error(error)
    process.exit(1)
  })
}

run()

export type {
  Config, TargetName,
} from './types.js'
