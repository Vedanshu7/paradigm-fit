# paradigm-fit - device documentation

Pre-scan check screen for a clinical operator: does an fMRI paradigm fit inside the programmed scan duration?
Built as a portfolio project the way device software is built: requirements first, tests traced to them, risks written down. This site is that paper trail.

## Why so much paper for one screen

A feature this small would not normally get its own plan, risk file and SOUP inventory. Inside a company it would inherit those from the product and add a few requirement rows, a hazard or two, and its tests. I wrote the full set on purpose, to show how documentation to IEC 62304 and ISO 14971 is put together and kept in step with the code. The requirement list itself is kept small; see [tailoring](development/development-plan.md#tailoring) for what was left out and why.

## Reading order

From what the operator needs down to how the code is built:

1. [Development plan](development/development-plan.md) - lifecycle, deliverables, ID scheme, change control
2. [User needs](requirements/user-needs.md) (with the use specification) → [Clinical constraints](requirements/clinical-constraints.md) → [Software requirements](requirements/software-requirements.md)
3. [Software architecture](architecture/software-architecture.md), [Detailed design](architecture/detailed-design.md)
4. [Risk analysis](risk/risk-analysis.md) (what could go wrong and what stops it) and the [SOUP inventory](risk/soup-inventory.md) (third-party code that ships inside the app)
5. [Test plan](verification/test-plan.md) and the generated [traceability matrix](verification/traceability-matrix.md)

## The one mechanism to know

Every requirement is a table row with an ID. Every test title names the IDs it verifies, and every piece of code that implements a requirement carries an `@requirement` tag in its doc comment.
A traceability script reads all three and regenerates the matrix. It **fails** if a software requirement has no test, a control has no requirement, a test carries no requirement tag, or a requirement's wording changed since a reviewer last accepted its tests - so no requirement can change silently.
