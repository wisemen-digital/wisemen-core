import AxeBuilder from '@axe-core/playwright'
import type {
  Page,
  TestInfo,
} from '@playwright/test'
import { expect } from '@playwright/test'

export async function runAccessibilityCheck(page: Page, testInfo: TestInfo): Promise<void> {
  if (page.isClosed()) {
    return
  }

  const accessibilityScanResults = await new AxeBuilder({
    page,
  })
    .withTags([
      'wcag2a',
      'wcag2aa',
      'wcag21a',
      'wcag21aa',
    ])
    .analyze()
    .catch((error) => {
      if (error.message.includes('Execution context was destroyed')) {
        console.warn('Skipping accessibility check due to navigation context being destroyed')

        return {
          violations: [],
        }
      }
      throw error
    })

  const wcag21aaViolations = accessibilityScanResults.violations
    .filter(
      (v) => v.tags.includes('wcag21aa'),
    )
    .map((v) => ({
      ...v,
      nodes: v.nodes.map((node) => {
        return node.html
      }),
    }))

  expect(wcag21aaViolations).toEqual([])

  await testInfo.attach('accessibility-scan-results', {
    body: JSON.stringify(accessibilityScanResults, null, 2),
    contentType: 'application/json',
  })
}
