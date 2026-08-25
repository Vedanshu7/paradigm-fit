# Test Plan

## Levels

| Level                 | Verifies                                                                                   | Environment                                                               | Suite                  | Count |
| --------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- | ---------------------- | ----- |
| Unit (`TC-UT-*`)      | Computation and validation requirements                                                    | Vitest, node, pure functions                                              | `app/tests/unit/`      | 75    |
| Component (`TC-CT-*`) | Presentation requirements, and the integration of the state composable with the components | Vitest, jsdom, @vue/test-utils                                            | `app/tests/component/` | 16    |
| System (`TC-ST-*`)    | Requirements, end to end                                                                   | Playwright (chromium) against the **production build** via `vite preview` | `app/tests/e2e/`       | 12    |

103 tests total. System tests run against the built app, not the dev server, because the built app is what ships.

`npm run test:coverage` runs both Vitest levels with v8 coverage and fails below the thresholds set in `vitest.config.ts` (statements/lines 95%, branches 85%, functions 90%); `main.ts` and `App.vue` are excluded from measurement because the system tests exercise them.

## Naming and traceability

- Every test title starts with its test-case ID and the requirement(s) it verifies: `TC-CT-034 [REQ-6]: cut blocks get a hatch overlay…`. One system test verifies an architecture decision instead (`TC-ST-012 [ARCH-3]`, no network calls).
- The traceability script scans these titles, regenerates [traceability matrix](traceability-matrix.md), and **fails** if any test case lacks a tag, any software requirement lacks a verifying test, any hazard lacks verified controls, or any requirement changed since its verification was last accepted (suspect hashes).
- One test-case ID may cover a table of inputs (`it.each`); the ID identifies the case, not the row.

## Entry / exit criteria per increment

- Entry: the previous increment is committed and its traceability gate is green.
- Exit: `lint`, `build`, every suite that exists so far, and the traceability script are green; documents updated in the same commit.
- Before any code exists the script runs in docs-only mode, which checks the documents against each other but not against tests.

## Environments and reproducibility

- Node 20 or later (`app/.nvmrc`); the toolchain is pinned by `package-lock.json`; Playwright pins its own browser build, fetched once with `npx playwright install chromium`.
- The full verification run is six commands (see the README); no step needs the network beyond `npm install` and that one browser download.
- `npm run build` type-checks the tests as well as the sources (`tsconfig.test.json`).

## Verification and validation

Everything in this project is **verification**: evidence that the software does what the requirements say. **Validation** - evidence that real operators, at a real console, can do what the user needs say, including a usability evaluation (IEC 62366) - is **not performed**. The needs and constraints were reviewed informally on 25 Aug 2026; that is a review of the inputs, not validation.
