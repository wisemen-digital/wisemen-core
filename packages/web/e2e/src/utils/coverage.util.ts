import * as crypto from 'node:crypto'
import * as fs from 'node:fs'
import * as path from 'node:path'
import process from 'node:process'

import type { BrowserContext } from '@playwright/test'

function generateUUID(): string {
  return crypto.randomBytes(16).toString('hex')
}

class CoverageUtil {
  private static readonly cliOutput = path.join(process.cwd(), '.nyc_output')

  static collect(coverageJSON: string): void {
    if (coverageJSON) {
      fs.writeFileSync(
        path.join(CoverageUtil.cliOutput, `playwright_coverage_${generateUUID()}.json`),
        coverageJSON,
      )
    }
  }

  static async setup(): Promise<void> {
    await fs.promises.mkdir(CoverageUtil.cliOutput, {
      recursive: true,
    })
  }
}

function setupIstanbulCoverage(): Promise<void> {
  return CoverageUtil.setup()
}

function collectIstanbulCoverage(coverageJSON: string): void {
  return CoverageUtil.collect(coverageJSON)
}

export async function setupContextWithCoverage(context: BrowserContext): Promise<{ cleanup: () => Promise<void> }> {
  await setupIstanbulCoverage()

  await context.addInitScript(() => {
    (globalThis as any).__coverage__ = {}
  })

  return {
    cleanup: async (): Promise<void> => {
      for (const page of context.pages()) {
        try {
          const coverage = await page.evaluate(() => JSON.stringify((globalThis as any).__coverage__ || {}))

          if (coverage && coverage !== '{}') {
            collectIstanbulCoverage(coverage)
          }
        }
        catch {
          // Ignore errors when the execution context is destroyed (e.g., after navigation)
          // This is expected behavior and doesn't indicate a test failure
        }
      }
    },
  }
}
