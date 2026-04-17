import { spawnSync } from 'node:child_process'
import { REPO_ROOT } from './shared.ts'

function run(args: string[]): void {
  const result = spawnSync(process.execPath, args, {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

run(['--experimental-strip-types', './scripts/skills/validate.ts'])
run(['--experimental-strip-types', './scripts/skills/sync-claude.ts', '--check'])
