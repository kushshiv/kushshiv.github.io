import { expect, test } from '@playwright/test'

test('BiteScore lab shows canned Berlin data without hitting an API', async ({ page }) => {
  const apiCalls: string[] = []
  page.on('request', (request) => {
    const url = request.url()
    if (!url.startsWith('http://127.0.0.1:4173') && !url.startsWith('https://fonts.')) {
      apiCalls.push(url)
    }
  })

  await page.goto('/labs/bite-score')
  await expect(page.getByRole('heading', { name: 'BiteScore' })).toBeVisible()
  await expect(page.getByText(/canned Berlin data/i)).toBeVisible()
  await expect(page.getByTestId('place-profile')).toContainText('Kreuzberg Bowl')
  await page.getByRole('button', { name: /Prenzlauer Loaf/ }).click()
  await expect(page.getByTestId('place-profile')).toContainText('Prenzlauer Loaf')
  await expect(page.getByText(/Run the real app locally/)).toBeVisible()
  expect(apiCalls).toEqual([])
})

test('DendriDB lab simulates recall from canned cues', async ({ page }) => {
  await page.goto('/labs/dendridb')
  await expect(page.getByRole('heading', { name: 'DendriDB' })).toBeVisible()
  await expect(page.getByText(/Simulation of the DendriDB API/i)).toBeVisible()
  await page.getByLabel('Recall cue').fill('memory')
  await expect(page.getByText(/Hybrid recall blends vector similarity/)).toBeVisible()
  await expect(page.getByRole('img', { name: 'Canned memory nodes' })).toBeVisible()
})
