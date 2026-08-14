import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

async function expectNoSeriousViolations(page: import('@playwright/test').Page) {
  const results = await new AxeBuilder({ page }).analyze()
  const serious = results.violations.filter(
    (violation) => violation.impact === 'critical' || violation.impact === 'serious',
  )
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([])
}

test('core pages have no serious axe violations', async ({ page }) => {
  for (const path of ['/', '/contact']) {
    await page.goto(path)
    await expectNoSeriousViolations(page)
  }
})

test('labs have no serious axe violations', async ({ page }) => {
  await page.goto('/labs/bite-score')
  await expectNoSeriousViolations(page)
  await page.goto('/labs/dendridb')
  await expectNoSeriousViolations(page)
})
