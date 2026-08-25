/**
 * System tests of the check flow against the production build: the operator
 * edits durations and reads the verdict and the timeline (REQ-2, REQ-3,
 * REQ-6, REQ-7, REQ-8).
 */
import { expect, test } from '@playwright/test';

/**
 * The main scenario end to end. Starting from the bundled paradigm
 * (140 s of blocks on a 300 s scan) the operator drives the verdict through
 * all three computed states and back with two fields.
 */
test('TC-ST-001 [REQ-2] [REQ-7]: verdict follows edits: unused time, exact fit, overrun and back', async ({
  page,
}) => {
  await page.goto('/');
  const verdict = page.locator('[data-verdict]');
  await expect(verdict).toHaveAttribute('data-verdict', 'underrun');
  await expect(verdict).toContainText('140');
  await expect(verdict).toContainText('Fits, scan time unused');

  await page.locator('#scan-duration').fill('140');
  await expect(verdict).toHaveAttribute('data-verdict', 'fits');
  await expect(verdict.locator('.eyebrow')).toHaveText('Fits');

  await page.locator('#block-duration-1').fill('50');
  await expect(verdict).toHaveAttribute('data-verdict', 'overflow');
  await expect(verdict).toContainText('Does not fit');
  await expect(verdict).toContainText('30 s past the end of the scan');

  await page.locator('#block-duration-1').fill('20');
  await expect(verdict).toHaveAttribute('data-verdict', 'fits');
});

/** A 125 s scan cuts the last block: the marker shows, exactly one block is hatched. */
test('TC-ST-002 [REQ-6]: the timeline marks the scan end and unrecorded block portions', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('#scan-duration').fill('125');
  await expect(page.locator('.scan-limit')).toBeVisible();
  await expect(page.locator('.scan-limit-label')).toContainText('scan ends · 125 s');
  await expect(page.locator('.block .hatch')).toHaveCount(1);
  await expect(page.locator('.block-label.cut').first()).toBeVisible();
});

/** The default state is the informational one: every block recorded, 160 s idle, worded as such. */
test('TC-ST-011 [REQ-2]: unused scan time is reported as information, not as a failure', async ({
  page,
}) => {
  await page.goto('/');
  const verdict = page.locator('[data-verdict]');
  await expect(verdict).toHaveAttribute('data-verdict', 'underrun');
  await expect(verdict).toContainText('Fits, scan time unused');
  await expect(verdict).toContainText('All blocks are recorded');
  await expect(verdict).toContainText('160');
});

/** `140.7 - 140` is `0.6999…` in floating point; the screen must say `0.7 s`. */
test('TC-ST-004 [REQ-3] [REQ-7]: decimal scan durations are accepted and displayed without float noise', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('#scan-duration').fill('140.7');
  const verdict = page.locator('[data-verdict]');
  await expect(verdict).toHaveAttribute('data-verdict', 'underrun');
  await expect(verdict).toContainText('0.7 s');
  await expect(verdict).not.toContainText('0.69999');
});

/** An 8 s block gets the advisory and is still accepted. */
test('TC-ST-005 [REQ-8]: atypically short blocks carry the non-blocking hint', async ({ page }) => {
  await page.goto('/');
  await page.locator('#block-duration-1').fill('8');
  await expect(page.locator('.note.hint').first()).toContainText('Shorter than typical');
});

/**
 * A 1200 s scan squeezes 20 s blocks to a few percent of the track. The page
 * must not gain a horizontal scrollbar, and the marker label must still be on
 * screen.
 */
test('TC-ST-014 [REQ-6]: a long scan keeps the timeline within the page', async ({ page }) => {
  await page.goto('/');
  await page.locator('#scan-duration').fill('1200');
  await expect(page.locator('[data-verdict]')).toHaveAttribute('data-verdict', 'underrun');

  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth > doc.clientWidth;
  });
  expect(overflow).toBe(false);

  await expect(page.locator('.scan-limit-label')).toBeVisible();
});

/**
 * Widths are exact shares of the scale, even for blocks too narrow to label:
 * with four 1 s blocks the hatch on the cut block still starts on the scan-end
 * line, so the picture and the marker never disagree about where the scan ends.
 */
test('TC-ST-017 [REQ-6]: the cut edge of a block lines up with the scan-end marker', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('#scan-duration').fill('125');
  for (const [id, value] of [
    [1, '1'],
    [2, '1'],
    [3, '1'],
    [4, '1'],
    [5, '106'],
  ]) {
    await page.locator(`#block-duration-${id}`).fill(String(value));
  }
  await expect(page.locator('[data-verdict]')).toHaveAttribute('data-verdict', 'overflow');

  const marker = await page.locator('.scan-limit').boundingBox();
  const hatch = await page.locator('.block .hatch').first().boundingBox();
  expect(marker).not.toBeNull();
  expect(hatch).not.toBeNull();
  // The dashed line is drawn just left of its position, so its right edge is the scan end.
  const lineRightEdge = (marker?.x ?? 0) + (marker?.width ?? 0);
  expect(Math.abs((hatch?.x ?? 0) - lineRightEdge)).toBeLessThanOrEqual(1);
});

/**
 * A 10 s block among 1000 s blocks is 0.2% of the track. It must render as
 * something visible, yet stay far narrower than its neighbours: an existence
 * floor, not a legibility one that would misstate the ratio.
 */
test('TC-ST-015 [REQ-6]: a block far shorter than its neighbours stays visible', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('#scan-duration').fill('5010');
  await page.locator('#block-duration-1').fill('10');
  for (const id of [2, 3, 4, 5, 6]) await page.locator(`#block-duration-${id}`).fill('1000');
  await expect(page.locator('[data-verdict]')).toHaveAttribute('data-verdict', 'fits');

  const widths = await page
    .locator('.block')
    .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
  expect(widths[0]).toBeGreaterThan(0);
  expect(widths[0]).toBeLessThan(widths[1] / 5);
});

/**
 * On a short viewport the content is taller than the screen. The block table
 * must stay reachable by scrolling the main area under the fixed navbar; a
 * layout that clips instead of scrolls would hide the last rows of the block
 * list REQ-7 asks for.
 */
test('TC-ST-016 [REQ-7]: the block table stays reachable by scrolling on a short viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 500 });
  await page.goto('/');
  const main = page.locator('main');
  const canScroll = await main.evaluate((el) => el.scrollHeight > el.clientHeight);
  expect(canScroll).toBe(true);

  const lastInput = page.locator('#block-duration-6');
  await lastInput.scrollIntoViewIfNeeded();
  await expect(lastInput).toBeInViewport();
  await expect(page.locator('header')).toBeInViewport();
});
