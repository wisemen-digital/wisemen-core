import chalk from 'chalk'

/* eslint-disable no-console */
export class Logger {
  constructor(
    private readonly options: {
      silent: boolean
      verbose?: boolean
    },
  ) {}

  error(message: string): void {
    if (!this.options.silent) {
      console.error(chalk.red(message))
    }
  }

  log(message: string): void {
    if (!this.options.silent) {
      console.log(message)
    }
  }

  verbose(message: string): void {
    if (this.options.verbose && !this.options.silent) {
      console.log(message)
    }
  }
}
