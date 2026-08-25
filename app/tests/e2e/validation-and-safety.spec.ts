/**
 * System tests for the safety-relevant behaviour: what the operator sees when
 * input is bad, and that the build is self-contained (REQ-4, REQ-5, ARCH-3).
 */
import { expect, test } from '@playwright/test';

/**
 * Clearing one block removes both the verdict and the timeline, marks the
 * field, and comes back the moment the field is fixed. HAZ-2 is the reason:
 * a verdict computed from a guessed value must be impossible to reach.
 */
test('TC-ST-006 [REQ-5]: invalid input yields Cannot check, never a verdict from a guessed value', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('#block-duration-2').fill('');
  const verdict = page.locator('[data-verdict]');
  await expect(verdict).toHaveAttribute('data-verdict', 'unchecked');
  await expect(verdict).toContainText('Cannot check');
  await expect(page.locator('#block-duration-2')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('.blocks')).toHaveCount(0);

  await page.locator('#block-duration-2').fill('20');
  await expect(verdict).toHaveAttribute('data-verdict', 'underrun');
});

/** An absurd scan duration is refused with the upper-bound reason, and the page keeps working. */
test('TC-ST-007 [REQ-4]: extreme input is rejected at the boundary and the page stays responsive', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('#scan-duration').fill('999999999');
  await expect(page.locator('[data-verdict]')).toHaveAttribute('data-verdict', 'unchecked');
  await expect(page.getByText('Must be at most 7200 s')).toBeVisible();
  await page.locator('#scan-duration').fill('140');
  await expect(page.locator('[data-verdict]')).toHaveAttribute('data-verdict', 'fits');
});

/**
 * Verifies the architecture decision that the app makes no network calls
 * (ARCH-3): no requirement asks for it, but a scanner-console app that phoned home
 * would be a finding, so the build is checked anyway.
 */
test('TC-ST-012 [ARCH-3]: the production build talks to no external hosts', async ({ page }) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (!new URL(request.url()).hostname.match(/^(localhost|127\.0\.0\.1)$/))
      externalRequests.push(request.url());
  });
  await page.goto('/');
  await expect(page.locator('[data-verdict]')).toHaveAttribute('data-verdict', 'underrun');
  expect(externalRequests).toEqual([]);
});
