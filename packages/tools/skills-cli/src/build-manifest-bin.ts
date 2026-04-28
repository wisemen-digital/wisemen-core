import process from 'node:process'

import { writeManifest } from './build-manifest.js'

function parseArg(flag: string): string | undefined {
  const argv = process.argv.slice(2)

  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i]

    if (current === flag) {
      return argv[i + 1]
    }

    if (typeof current === 'string' && current.startsWith(`${flag}=`)) {
      return current.slice(flag.length + 1)
    }
  }

  return undefined
}

try {
  const target = writeManifest({
    manifestPath: parseArg('--out'),
    skillsDir: parseArg('--skills'),
  })

  // eslint-disable-next-line no-console
  console.log(`wisemen-skills: wrote ${target}`)
}
catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
