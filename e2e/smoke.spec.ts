import { test, expect, type Page } from '@playwright/test'
import routes from './routes.json' with { type: 'json' }

// Every screen must render its heading from the JavaScript bundle (the shell in
// index.html has no headings) without an uncaught error or a console error.
function collectErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console.error: ${message.text()}`)
  })
  return errors
}

for (const route of routes) {
  test(`${route.path} renders "${route.heading}"`, async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto(route.path)
    await expect(page.getByRole('heading', { level: 2, name: route.heading })).toBeVisible()
    expect(errors).toEqual([])
  })
}

test('the screen menu and the player count switch screens', async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto('/')
  await page.getByRole('navigation', { name: 'Screens' }).getByRole('link', { name: 'Round' }).click()
  await expect(page.getByRole('heading', { level: 2, name: 'Round Flow' })).toBeVisible()
  await expect(page).toHaveURL(/#.*\/round$/)
  // With 2 classes the Middle Class does not play and its screen falls back to the policies.
  await page.goto('/#4p/middle')
  await expect(page.getByRole('heading', { level: 2, name: 'Middle Class' })).toBeVisible()
  await page.getByRole('button', { name: '2 players' }).click()
  await expect(page.getByRole('heading', { level: 2, name: 'Policy Overview & Impact' })).toBeVisible()
  expect(errors).toEqual([])
})
