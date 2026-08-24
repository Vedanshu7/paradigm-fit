# Risk Analysis and Safety Classification

What could go wrong and what stops it, following ISO 14971 at the scale of one screen. Each control names the requirements that implement it and is verified by their tests; the [traceability matrix](../verification/traceability-matrix.md) shows that coverage.

Severity: negligible / minor / moderate. Probability: low / medium / high, before controls; the controls table gives the value after.

## Hazard analysis

| ID                            | Hazard                                          | Foreseeable sequence of events                                                   | Hazardous situation                                                    | Harm                                                                                                    | Severity | Prob.  |
| ----------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------- | ------ |
| <span id="haz-1">HAZ-1</span> | Incorrect fit information                       | A computation defect shows an overrunning paradigm as fitting                    | The operator starts the examination; the final blocks are not recorded | Examination repeated with the patient in the scanner; extra sedation for sedated or paediatric patients | moderate | low    |
| <span id="haz-2">HAZ-2</span> | Verdict from a value the operator did not enter | An empty or invalid field is replaced by a substitute value                      | The operator reads a verdict computed from a substituted number        | As HAZ-1                                                                                                | moderate | medium |
| <span id="haz-3">HAZ-3</span> | Stale fit information                           | A value is not recomputed after an edit                                          | The operator trusts a verdict that describes the old paradigm          | As HAZ-1                                                                                                | moderate | medium |
| <span id="haz-4">HAZ-4</span> | Overrun not visible on the timeline             | The timeline is normalised so an overrun draws the same shape as a fit           | The operator reads a fitting shape for an overrunning paradigm         | As HAZ-1                                                                                                | moderate | low    |
| <span id="haz-5">HAZ-5</span> | Verdict not perceived                           | Verdict colours are indistinguishable, or the timeline is read without the panel | The operator proceeds on a verdict they have not registered            | As HAZ-1                                                                                                | moderate | low    |

A paradigm shorter than the scan is not hazardous: every block is recorded. It is shown as information (REQ-2), not as a failure.

## Risk controls

Each control lowers the risk of one hazard. It names the requirements that put it in place, and their tests prove it. All hazards are moderate in severity; one is acceptable when its probability after the control is **low**.

| ID                          | Control measure                                                                                 | Traces up                       | Implemented by                                                                                                                                                            | Kind                   | Probability before → after |
| --------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | -------------------------- |
| <span id="rc-1">RC-1</span> | The maths is kept apart from the screen and tested at every edge, decimals included.            | [HAZ-1](risk-analysis.md#haz-1) | [REQ-1](../requirements/software-requirements.md#req-1), [REQ-2](../requirements/software-requirements.md#req-2)                                                          | verification           | low → low                  |
| <span id="rc-2">RC-2</span> | If an entry cannot be read, the check stops and marks the entry. It never guesses.              | [HAZ-2](risk-analysis.md#haz-2) | [REQ-3](../requirements/software-requirements.md#req-3), [REQ-4](../requirements/software-requirements.md#req-4), [REQ-5](../requirements/software-requirements.md#req-5) | safer design           | medium → low               |
| <span id="rc-3">RC-3</span> | Nothing is stored between edits. Every number on screen is worked out again from the entries.   | [HAZ-3](risk-analysis.md#haz-3) | [REQ-3](../requirements/software-requirements.md#req-3), [REQ-7](../requirements/software-requirements.md#req-7)                                                          | safer design           | medium → low               |
| <span id="rc-4">RC-4</span> | The timeline is never shorter than the scan, so an overrun always sticks out past the scan end. | [HAZ-4](risk-analysis.md#haz-4) | [REQ-6](../requirements/software-requirements.md#req-6)                                                                                                                   | safer design           | low → low                  |
| <span id="rc-5">RC-5</span> | The verdict is shown in more than one way: words, colour, icon, and the timeline.               | [HAZ-5](risk-analysis.md#haz-5) | [REQ-2](../requirements/software-requirements.md#req-2), [REQ-6](../requirements/software-requirements.md#req-6)                                                          | information for safety | low → low                  |

All five hazards are low after controls and accepted. Reviewed 25 Aug 2026.

## Safety classification (IEC 62304)

**Class B.** The software replaces a manual check and will be relied on; a false verdict can cause a repeated examination and extra sedation exposure, so non-serious injury is possible (not Class A). Serious injury is not credible for an informational screen (not Class C).

## Security

The only way in is the supply chain: Vue is bundled into the app, so a compromised package could alter the verdict. That is a route into HAZ-1, not a separate hazard. The [SOUP inventory](soup-inventory.md) records the dependency and `package-lock.json` pins every version. A product would add a threat model, a software bill of materials and vulnerability monitoring; this project does not.

## Residual risk

What remains is mostly requirement error (a wrong bound or threshold), reduced by review of the needs, constraints and requirements. Accepted for the intended portfolio use, 25 Aug 2026.
