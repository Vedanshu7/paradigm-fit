# Clinical Constraints

Facts about fMRI practice that the design has to respect. They are inputs, not design decisions, and are recorded here so every requirement can point at where it came from.

| ID                          | Statement                                                                                                                                     | Traces up                  |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| <span id="cc-1">CC-1</span> | Acquisition ends when the scan ends. Any part of the paradigm beyond that point is not acquired, and the examination may have to be repeated. | [UN-1](user-needs.md#un-1) |
| <span id="cc-2">CC-2</span> | A paradigm shorter than the scan is clinically acceptable; the surplus is unused scan time, not an error.                                     | [UN-1](user-needs.md#un-1) |
| <span id="cc-3">CC-3</span> | Typical fMRI block duration is 10–20 s, because the haemodynamic response takes seconds to build. Shorter blocks are unusual.                 | [UN-2](user-needs.md#un-2) |
| <span id="cc-4">CC-4</span> | Scan duration is either typed in by the operator or carried by a predefined paradigm.                                                         | [UN-1](user-needs.md#un-1) |
| <span id="cc-5">CC-5</span> | Block and scan durations may be non-integer seconds.                                                                                          | [UN-2](user-needs.md#un-2) |
