import { expect, test } from '@playwright/test'

test('overview shows a 3D card stack', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Shivendra Pratap Kushwaha/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Shivendra')
  await expect(page.getByRole('link', { name: 'Overview' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Work' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Experience: Sennder' })).toBeVisible()
  await expect(page.locator('canvas')).toHaveCount(0)
})

test('clicking a card opens it', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Experience: Sennder' }).evaluate((node) => {
    ;(node as HTMLButtonElement).click()
  })
  await expect(page.getByRole('dialog')).toContainText('Sennder')
  await page.getByRole('button', { name: 'Close' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('contact has links', async ({ page }) => {
  await page.goto('/contact')
  await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
    'href',
    'https://linkedin.com/in/shivendrapk',
  )
  await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/kushshiv')
  await expect(page.getByRole('link', { name: /shivendra\.ds48@gmail\.com/ })).toHaveAttribute(
    'href',
    'mailto:shivendra.ds48@gmail.com',
  )
})

test('lab cards include open lab and GitHub', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Personal project: BiteScore' }).evaluate((node) => {
    ;(node as HTMLButtonElement).click()
  })
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('link', { name: 'Open lab' })).toBeVisible()
  await expect(dialog.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
    'href',
    'https://github.com/kushshiv/bite-score',
  )
})

test('mobile viewport smoke', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
