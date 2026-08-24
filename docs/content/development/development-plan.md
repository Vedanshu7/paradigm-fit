# Software Development Plan

Development plan for **paradigm-fit**, a pre-scan check screen for fMRI. A portfolio project by one developer, so the plan is scaled to that.

## Safety classification

Class **B** under IEC 62304: a fault could cause harm (a repeated examination with the patient still in the scanner, graded moderate in the risk file) but not serious injury. The reasoning is in the [risk analysis](../risk/risk-analysis.md). Class B is why there is a written architecture and detailed design, and tests at unit, component and system level.

## Lifecycle model

V-model, built in increments: each increment delivers one verified, documented slice from requirement to test, rather than finishing every requirement before writing any code.

- Going down: user needs → clinical constraints → software requirements → architecture → detailed design. The software is the whole item in scope, so one requirement layer is written (see the [software requirements](../requirements/software-requirements.md)).
- Coming back up: unit tests → component tests → system tests, each verifying the same requirement set at a different level.
- Risk management runs alongside (ISO 14971, scaled to this size): hazards are written down before design, and each control names the requirements that implement it and is verified by their tests.

The [documentation set](../index.md) lists the deliverables and the order to read them.

## Requirement identifiers

- `UN-n` user needs, `CC-n` clinical constraints, `REQ-n` software requirements.
- `ARCH-n` architecture decisions, `DD-n` detailed-design items, `HAZ-n` hazards, `RC-n` risk controls, `SOUP-n` SOUP items.
- Tests: `TC-UT-nnn` unit, `TC-CT-nnn` component, `TC-ST-nnn` system; titles embed the requirement IDs they verify, e.g. `TC-UT-004 [REQ-4]`.
- IDs are never reused: a removed row leaves a gap.
- Every requirement is a table row whose first three columns are `| ID | Statement | Traces up |`; hazard and control tables carry further columns. Which tests and files cover each row is computed by a traceability script, not hand-maintained.

## Traceability and change control

- The traceability script regenerates the matrix and fails on dangling references, test cases with no requirement tag, requirements with no verifying test, and hazards without verified controls.
- Each requirement statement is hashed; accepted hashes live in `docs/content/trace-clearances.json`. Editing a requirement makes it **suspect**: the gate fails until someone re-reads its tests and re-accepts the hash. The git diff of that file is therefore the review record.
- The same script maintains the cross-reference links, so authors write bare IDs.

## Tailoring

<span id="tailoring"></span>The process is meant to scale with the risk and the size of the software; knowing what to leave out is part of applying it.

Inside a company's existing quality system, a feature this size would inherit the plan, coding standard, SOUP inventory and risk file from the product, and contribute perhaps a dozen software requirements, a hazard row or two, and its tests. This project writes the full chain because there is nothing to inherit and because showing the chain is the point. The requirement set itself is kept to that feature-sized footprint: a row earns its place only if it constrains the design in a way a reviewer could dispute, or a risk control depends on it. Everything else is design output and lives in the [detailed design](../architecture/detailed-design.md).

## Coding standard

Recorded separately in [coding-standard.md](coding-standard.md); enforced by `npm run lint` and the coverage thresholds.

## Configuration management and problem resolution

Git is the configuration record. Defects found after an increment closes are reproduced as a failing test first, then fixed, with the commit referencing the test ID.

## Development tools

Not SOUP - not incorporated in the device - but version-pinned in `package-lock.json` for reproducible builds: Vite, Vitest, @vue/test-utils, jsdom, Playwright, TypeScript, vue-tsc, ESLint, Prettier. The documentation site uses MkDocs (the theme and diagram plugin are pinned in `docs/requirements.txt`); the docs remain plain markdown, so the site is a rendering rather than the source of truth.
