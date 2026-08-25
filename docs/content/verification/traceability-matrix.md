# Traceability Matrix

## Requirements

| ID | Traces up | Implemented in | Hash | Verified by |
| --- | --- | --- | --- | --- |
| [UN-1](../requirements/user-needs.md#un-1) | - | - | `5dead4a0` | - |
| [UN-2](../requirements/user-needs.md#un-2) | - | - | `fd0c2209` | - |
| [UN-3](../requirements/user-needs.md#un-3) | - | - | `3e4b528f` | - |
| [CC-1](../requirements/clinical-constraints.md#cc-1) | [UN-1](../requirements/user-needs.md#un-1) | - | `4310056e` | - |
| [CC-2](../requirements/clinical-constraints.md#cc-2) | [UN-1](../requirements/user-needs.md#un-1) | - | `8fe5a58e` | - |
| [CC-3](../requirements/clinical-constraints.md#cc-3) | [UN-2](../requirements/user-needs.md#un-2) | - | `306dd6d9` | - |
| [CC-4](../requirements/clinical-constraints.md#cc-4) | [UN-1](../requirements/user-needs.md#un-1) | - | `9a2fc22f` | - |
| [CC-5](../requirements/clinical-constraints.md#cc-5) | [UN-2](../requirements/user-needs.md#un-2) | - | `1437d818` | - |
| [REQ-1](../requirements/software-requirements.md#req-1) | [UN-1](../requirements/user-needs.md#un-1), [CC-1](../requirements/clinical-constraints.md#cc-1) | `app/src/paradigm/domain/paradigm.ts` | `a1ccbbc1` | TC-UT-010, TC-UT-011, TC-UT-012, TC-UT-013, TC-UT-051 |
| [REQ-2](../requirements/software-requirements.md#req-2) | [UN-1](../requirements/user-needs.md#un-1), [CC-1](../requirements/clinical-constraints.md#cc-1), [CC-2](../requirements/clinical-constraints.md#cc-2) | `app/src/paradigm/domain/verdict.ts`, `app/src/paradigm/ui/lib/messages.ts`, `app/src/paradigm/ui/verdict/FitVerdict.vue` | `2e25fa2f` | TC-CT-030, TC-ST-001, TC-ST-011, TC-UT-020, TC-UT-021, TC-UT-022, TC-UT-023, TC-UT-051, TC-UT-061, TC-UT-062 |
| [REQ-3](../requirements/software-requirements.md#req-3) | [UN-2](../requirements/user-needs.md#un-2), [CC-5](../requirements/clinical-constraints.md#cc-5) | `app/src/paradigm/domain/check.ts`, `app/src/paradigm/ui/composables/useParadigm.ts`, `app/src/paradigm/ui/table/DurationInput.vue`, `app/src/shared/format.ts` | `a7ac23da` | TC-CT-001, TC-CT-002, TC-CT-003, TC-CT-031, TC-CT-040, TC-CT-043, TC-ST-004, TC-UT-031, TC-UT-050 |
| [REQ-4](../requirements/software-requirements.md#req-4) | [UN-2](../requirements/user-needs.md#un-2), [CC-5](../requirements/clinical-constraints.md#cc-5) | `app/src/paradigm/domain/duration.ts`, `app/src/paradigm/ui/lib/messages.ts` | `edb35d9e` | TC-ST-007, TC-UT-001, TC-UT-002, TC-UT-003, TC-UT-004, TC-UT-060 |
| [REQ-5](../requirements/software-requirements.md#req-5) | [UN-1](../requirements/user-needs.md#un-1), [UN-3](../requirements/user-needs.md#un-3) | `app/src/paradigm/domain/check.ts`, `app/src/paradigm/ui/composables/useParadigm.ts`, `app/src/paradigm/ui/lib/messages.ts`, `app/src/paradigm/ui/timeline/ParadigmTimeline.vue`, `app/src/paradigm/ui/verdict/FitVerdict.vue`, `app/src/paradigm/ui/verdict/ValidationMessage.vue` | `099f7a70` | TC-CT-002, TC-CT-004, TC-CT-031, TC-CT-035, TC-CT-040, TC-ST-006, TC-UT-050, TC-UT-053, TC-UT-060, TC-UT-063 |
| [REQ-6](../requirements/software-requirements.md#req-6) | [UN-1](../requirements/user-needs.md#un-1), [CC-1](../requirements/clinical-constraints.md#cc-1) | `app/src/paradigm/ui/lib/bars.ts`, `app/src/paradigm/ui/lib/ticks.ts`, `app/src/paradigm/ui/timeline/ParadigmTimeline.vue`, `app/src/paradigm/ui/timeline/ScanEndMarker.vue`, `app/src/paradigm/ui/timeline/TimeRuler.vue`, `app/src/paradigm/ui/timeline/TimelineBlock.vue` | `40473f56` | TC-CT-032, TC-CT-033, TC-CT-034, TC-CT-036, TC-ST-002, TC-ST-014, TC-ST-015, TC-ST-017, TC-UT-030, TC-UT-032, TC-UT-033, TC-UT-070, TC-UT-071, TC-UT-072, TC-UT-073 |
| [REQ-7](../requirements/software-requirements.md#req-7) | [UN-1](../requirements/user-needs.md#un-1), [UN-2](../requirements/user-needs.md#un-2), [UN-3](../requirements/user-needs.md#un-3), [CC-4](../requirements/clinical-constraints.md#cc-4) | `app/src/paradigm/infrastructure/loadParadigm.ts`, `app/src/paradigm/ui/composables/useParadigm.ts`, `app/src/paradigm/ui/lib/rows.ts`, `app/src/paradigm/ui/table/BlockTable.vue`, `app/src/paradigm/ui/verdict/FitVerdict.vue` | `8d0e980b` | TC-CT-041, TC-ST-001, TC-ST-004, TC-ST-016, TC-UT-080, TC-UT-081, TC-UT-082, TC-UT-090, TC-UT-091 |
| [REQ-8](../requirements/software-requirements.md#req-8) | [UN-2](../requirements/user-needs.md#un-2), [CC-3](../requirements/clinical-constraints.md#cc-3) | `app/src/paradigm/domain/check.ts`, `app/src/paradigm/domain/duration.ts`, `app/src/paradigm/ui/lib/messages.ts`, `app/src/paradigm/ui/lib/rows.ts`, `app/src/paradigm/ui/table/BlockTable.vue`, `app/src/paradigm/ui/verdict/ValidationMessage.vue` | `6057633f` | TC-CT-006, TC-CT-042, TC-ST-005, TC-UT-005, TC-UT-052, TC-UT-082 |
| [ARCH-1](../architecture/software-architecture.md#arch-1) | [RC-1](../risk/risk-analysis.md#rc-1) | - | `d7d20dca` | - |
| [ARCH-2](../architecture/software-architecture.md#arch-2) | [RC-2](../risk/risk-analysis.md#rc-2), [RC-3](../risk/risk-analysis.md#rc-3) | - | `af1cf0ff` | - |
| [ARCH-3](../architecture/software-architecture.md#arch-3) | - | - | `b03b3745` | TC-ST-012 |
| [ARCH-5](../architecture/software-architecture.md#arch-5) | [REQ-7](../requirements/software-requirements.md#req-7) | - | `9fed3c8e` | - |
| [DD-1](../architecture/detailed-design.md#dd-1) | [REQ-2](../requirements/software-requirements.md#req-2), [REQ-4](../requirements/software-requirements.md#req-4), [REQ-8](../requirements/software-requirements.md#req-8) | - | `7bab68b3` | - |
| [DD-2](../architecture/detailed-design.md#dd-2) | [REQ-3](../requirements/software-requirements.md#req-3), [REQ-5](../requirements/software-requirements.md#req-5), [REQ-8](../requirements/software-requirements.md#req-8) | - | `9e0dc255` | - |
| [DD-3](../architecture/detailed-design.md#dd-3) | [REQ-3](../requirements/software-requirements.md#req-3), [REQ-7](../requirements/software-requirements.md#req-7) | - | `e327d17b` | - |
| [DD-5](../architecture/detailed-design.md#dd-5) | [REQ-2](../requirements/software-requirements.md#req-2), [REQ-5](../requirements/software-requirements.md#req-5), [REQ-7](../requirements/software-requirements.md#req-7), [REQ-8](../requirements/software-requirements.md#req-8) | - | `f59ecf35` | - |
| [DD-6](../architecture/detailed-design.md#dd-6) | [REQ-5](../requirements/software-requirements.md#req-5), [REQ-6](../requirements/software-requirements.md#req-6) | - | `be094554` | - |
| [DD-7](../architecture/detailed-design.md#dd-7) | [REQ-3](../requirements/software-requirements.md#req-3), [REQ-7](../requirements/software-requirements.md#req-7) | - | `2eb07bc9` | - |

## Risk controls

| Hazard | Control | Implemented by | Verified by |
| --- | --- | --- | --- |
| [HAZ-1](../risk/risk-analysis.md#haz-1) | [RC-1](../risk/risk-analysis.md#rc-1) | [REQ-1](../requirements/software-requirements.md#req-1), [REQ-2](../requirements/software-requirements.md#req-2) | TC-CT-030, TC-ST-001, TC-ST-011, TC-UT-010, TC-UT-011, TC-UT-012, TC-UT-013, TC-UT-020, TC-UT-021, TC-UT-022, TC-UT-023, TC-UT-051, TC-UT-061, TC-UT-062 |
| [HAZ-2](../risk/risk-analysis.md#haz-2) | [RC-2](../risk/risk-analysis.md#rc-2) | [REQ-3](../requirements/software-requirements.md#req-3), [REQ-4](../requirements/software-requirements.md#req-4), [REQ-5](../requirements/software-requirements.md#req-5) | TC-CT-001, TC-CT-002, TC-CT-003, TC-CT-004, TC-CT-031, TC-CT-035, TC-CT-040, TC-CT-043, TC-ST-004, TC-ST-006, TC-ST-007, TC-UT-001, TC-UT-002, TC-UT-003, TC-UT-004, TC-UT-031, TC-UT-050, TC-UT-053, TC-UT-060, TC-UT-063 |
| [HAZ-3](../risk/risk-analysis.md#haz-3) | [RC-3](../risk/risk-analysis.md#rc-3) | [REQ-3](../requirements/software-requirements.md#req-3), [REQ-7](../requirements/software-requirements.md#req-7) | TC-CT-001, TC-CT-002, TC-CT-003, TC-CT-031, TC-CT-040, TC-CT-041, TC-CT-043, TC-ST-001, TC-ST-004, TC-ST-016, TC-UT-031, TC-UT-050, TC-UT-080, TC-UT-081, TC-UT-082, TC-UT-090, TC-UT-091 |
| [HAZ-4](../risk/risk-analysis.md#haz-4) | [RC-4](../risk/risk-analysis.md#rc-4) | [REQ-6](../requirements/software-requirements.md#req-6) | TC-CT-032, TC-CT-033, TC-CT-034, TC-CT-036, TC-ST-002, TC-ST-014, TC-ST-015, TC-ST-017, TC-UT-030, TC-UT-032, TC-UT-033, TC-UT-070, TC-UT-071, TC-UT-072, TC-UT-073 |
| [HAZ-5](../risk/risk-analysis.md#haz-5) | [RC-5](../risk/risk-analysis.md#rc-5) | [REQ-2](../requirements/software-requirements.md#req-2), [REQ-6](../requirements/software-requirements.md#req-6) | TC-CT-030, TC-CT-032, TC-CT-033, TC-CT-034, TC-CT-036, TC-ST-001, TC-ST-002, TC-ST-011, TC-ST-014, TC-ST-015, TC-ST-017, TC-UT-020, TC-UT-021, TC-UT-022, TC-UT-023, TC-UT-030, TC-UT-032, TC-UT-033, TC-UT-051, TC-UT-061, TC-UT-062, TC-UT-070, TC-UT-071, TC-UT-072, TC-UT-073 |

Totals: 37 requirements, 62 tagged test cases, 0 finding(s).
