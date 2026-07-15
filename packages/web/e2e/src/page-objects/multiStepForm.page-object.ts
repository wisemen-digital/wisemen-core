import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

const FINISH_BUTTON_REGEX = /finish|submit|done/i
const NEXT_STEP_BUTTON_REGEX = /next|continue/i
const PREVIOUS_STEP_BUTTON_REGEX = /back|previous/i

/**
 * Utility for driving multi-step (wizard) forms in E2E tests.
 */
export class MultiStepFormUtil {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Asserts that the given step is the current step. Best-effort: matches the
   * step indicator marked with `aria-current="step"` against the step number.
   */
  async expectStep(step: number): Promise<void> {
    const currentStep = this.page.locator('[aria-current="step"]')

    await expect(currentStep).toContainText(String(step))
  }

  /**
   * Completes the multi-step form.
   */
  async finish(): Promise<void> {
    await this.page.getByRole('button', {
      name: FINISH_BUTTON_REGEX,
    }).click()
  }

  /**
   * Advances to the next step.
   */
  async goToNextStep(): Promise<void> {
    await this.page.getByRole('button', {
      name: NEXT_STEP_BUTTON_REGEX,
    }).click()
  }

  /**
   * Returns to the previous step.
   */
  async goToPreviousStep(): Promise<void> {
    await this.page.getByRole('button', {
      name: PREVIOUS_STEP_BUTTON_REGEX,
    }).click()
  }
}
