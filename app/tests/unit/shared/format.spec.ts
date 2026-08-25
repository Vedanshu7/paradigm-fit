/**
 * Unit tests for the seconds formatter: at most two decimals, no
 * floating-point noise, no trailing zeros (REQ-3).
 */
import { describe, expect, it } from 'vitest';

import { formatSec } from '@/shared/format';

describe('formatSec', () => {
  /**
   * `0.1 + 0.2` prints as `0.3`; whole numbers print without a decimal point;
   * a non-zero value below display precision reads `< 0.01`, never `0`.
   */
  it.each([
    [20, '20'],
    [12.5, '12.5'],
    [0.1 + 0.2, '0.3'],
    [68.5, '68.5'],
    [1.239, '1.24'],
    [0, '0'],
    [0.001, '< 0.01'],
    [0.005, '0.01'],
  ])('TC-UT-031 [REQ-3]: formats %d with at most two decimals', (value, expected) => {
    expect(formatSec(value)).toBe(expected);
  });
});
