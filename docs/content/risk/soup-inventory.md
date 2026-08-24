# SOUP Inventory

SOUP ("software of unknown provenance") is the standard's name for third-party code that **ships inside the device**. Only runtime dependencies qualify; build and test tools do not. Keeping this list at one item is a deliberate architecture decision (see [ARCH-3](../architecture/software-architecture.md#arch-3)).

| ID                              | Component and version                     | Manufacturer / provenance           | Requirements placed on it                                                    | Anomaly review                                       |
| ------------------------------- | ----------------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------- |
| <span id="soup-1">SOUP-1</span> | vue (see package-lock.json for exact pin) | Vue.js core team, MIT, npm registry | Reactive rendering, component model, correct recomputation of derived values | Not performed; the version is pinned by the lockfile |

## Not SOUP: development tools

Vite, Vitest, @vue/test-utils, jsdom, Playwright, TypeScript, vue-tsc, ESLint, Prettier.
They never ship in the built artifact; they are version-pinned in `package-lock.json` for build reproducibility.

## Verification of the boundary

A system test asserts the production build makes **no requests to external hosts** (fonts, CDNs, telemetry), so what runs at the console is exactly the one item above, bundled in.
