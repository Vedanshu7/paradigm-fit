# Coding Standard

The standard is tool-enforced wherever a tool can check it; the checks below are what a unit of code must pass to be accepted. Layer import rules are in the [software architecture](../architecture/software-architecture.md).

## Language and structure

- TypeScript strict, no `any`; ESLint (typescript-eslint + eslint-plugin-vue) and Prettier enforced by `npm run lint`.
- At most 10 branches per function (cyclomatic complexity), enforced by the ESLint `complexity` rule.
- No nested ternary expressions (ESLint `no-nested-ternary`, matching SonarQube S3358).
- Domain code is plain TypeScript with no Vue import, so it can be tested without a browser; nothing in `src/` runs code just by being imported.
- **Named results**: every block-bodied function assigns its result to a named variable and returns that variable - never an expression or a call directly in `return`. One observable value per function aids debugging and review. Single-expression arrow derivations (Vue computeds, short callbacks) are exempt. Review-enforced.

## Documentation in code

- **A doc comment (TSDoc) on every exported symbol** - functions, constants, types, components and composables: purpose, parameters with units, error behaviour, and one `@requirement` tag per requirement the unit implements.
- TSDoc syntax is linted (`eslint-plugin-tsdoc`); the custom `@requirement` tag is declared in `tsdoc.json`; the traceability script validates every tagged ID against the requirement set and lists the implementing files in the traceability matrix's "Implemented in" column.
- Comments beyond TSDoc only where the why is non-obvious; no commented-out code (git is the history). A comment that contradicts the code is a review finding.
- Long blocks that the complexity rule cannot split (the state composable, a configuration object) carry short section headings, and their non-obvious members carry one-line docs; never line-by-line narration.

## Verification thresholds

`npm run test:coverage` fails below: statements and lines 95%, branches 85%, functions 90% over `src/`. `main.ts` and `App.vue` are excluded from measurement because the system tests exercise them.
