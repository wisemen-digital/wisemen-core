import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

export async function parseArgs (): Promise<{ sourceGlob: string, outputPath: string }> {
  const argv = await yargs(hideBin(process.argv))
    .command('$0 <sourceGlob> [outputPath]', 'generate DBML schema from TypeORM entities', (yargs) => {
      return yargs
        .positional('sourceGlob', {
          describe: 'Glob pattern for your TypeORM entities',
          type: 'string'

        })
        .positional('outputPath', {
          describe: 'Path to the output DBML file',
          type: 'string',
          default: './schema.dbml'
        })
    })
    .help()
    .example('$0 "src/entities/**/*.ts"', 'Generate DBML from all entities in src/entities')
    .parse()

  if (argv.sourceGlob === null) {
    console.error('Error: sourceGlob is required.')
    process.exit(1)
  }

  // Safety check: specific to preventing overwrites when users forget quotes around globs
  if (typeof argv.outputPath === 'string' && argv.outputPath.endsWith('.ts')) {
    console.error(`Error: outputPath '${argv.outputPath}' looks like a TypeScript file.`)
    console.error('Did you forget to quote your glob pattern? (e.g. "src/**/*.ts")')
    console.error('Shell expansion causes the second matched file to be treated as the outputPath.')
    process.exit(1)
  }

  return {
    sourceGlob: argv.sourceGlob as string,
    outputPath: argv.outputPath as string
  }
}
