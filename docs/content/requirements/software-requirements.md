# Software Requirements

The software is the whole product, so there is one list of requirements. Each one points to the [user need](user-needs.md) or [clinical constraint](clinical-constraints.md) it serves. How things look and what thresholds are used is in the [detailed design](../architecture/detailed-design.md).

## The four verdicts

- **Fits**: the blocks add up to the scan time.
- **Fits, scan time unused**: the blocks are shorter than the scan. All are recorded.
- **Does not fit**: the blocks are longer than the scan. The end is not recorded.
- **Cannot check**: an entry is invalid, so there is no verdict.

## Requirements

| ID                            | Statement                                                                                                                                                              | Traces up                                                                                                                |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| <span id="req-1">REQ-1</span> | Work out the total duration, when each block starts, and how much of each block is inside the scan.                                                                    | [UN-1](user-needs.md#un-1), [CC-1](clinical-constraints.md#cc-1)                                                         |
| <span id="req-2">REQ-2</span> | Show one of the four verdicts and say how many seconds over or unused.                                                                                                 | [UN-1](user-needs.md#un-1), [CC-1](clinical-constraints.md#cc-1), [CC-2](clinical-constraints.md#cc-2)                   |
| <span id="req-3">REQ-3</span> | Keep each duration exactly as typed, recompute everything on every edit, and show numbers with at most two decimals.                                                   | [UN-2](user-needs.md#un-2), [CC-5](clinical-constraints.md#cc-5)                                                         |
| <span id="req-4">REQ-4</span> | Accept only a decimal number in range (block 1 to 3600 s, scan 1 to 7200 s). Say why an entry is rejected: empty, not a number, too small, or too large.               | [UN-2](user-needs.md#un-2), [CC-5](clinical-constraints.md#cc-5)                                                         |
| <span id="req-5">REQ-5</span> | While any entry is invalid, show Cannot check instead of the verdict and the timeline, and mark the bad field with the reason.                                         | [UN-1](user-needs.md#un-1), [UN-3](user-needs.md#un-3)                                                                   |
| <span id="req-6">REQ-6</span> | Draw the blocks and the scan on one scale that is at least as long as the scan. Mark where the scan ends and hatch any block part past it.                             | [UN-1](user-needs.md#un-1), [CC-1](clinical-constraints.md#cc-1)                                                         |
| <span id="req-7">REQ-7</span> | List the blocks in order with start time and whether each is recorded in full, in part, or not at all. Let the operator edit any block and the scan duration in place. | [UN-1](user-needs.md#un-1), [UN-2](user-needs.md#un-2), [UN-3](user-needs.md#un-3), [CC-4](clinical-constraints.md#cc-4) |
| <span id="req-8">REQ-8</span> | Warn when a block is shorter than usual for fMRI, but still accept it.                                                                                                 | [UN-2](user-needs.md#un-2), [CC-3](clinical-constraints.md#cc-3)                                                         |
