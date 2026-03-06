# AI4paper Refactor Plan

## Boundaries

- Keep `bootstrap.js`, `manifest.json`, and the current `loadSubScript` startup path compatible.
- Introduce new TypeScript modules gradually and compile them to plain JS under `chrome/content/scripts/`.
- Move reusable logic first. Leave UI rendering and Zotero window wiring in legacy JS until the core rules are stable.

## Phase 1: Minimum Tooling

- Add `tsconfig.json` and a local build/check workflow.
- Compile only new modules from `src/`.
- Keep generated JS loadable by the current bootstrap loader.

## Phase 2: Core Rules

- Centralize `ai4paper.*` preference access.
- Centralize annotation color mappings and exclusion rules.
- Replace duplicated color checks in:
  - `ai4paper.js`
  - `ai4paper-annotation.js`
  - `ai4paper-notes.js`

## Phase 3: Pure Logic Migration

- Move pure logic into TypeScript first:
  - metadata helpers
  - note/HTML transforms
  - filename and path utilities
  - annotation filtering rules

## Phase 4: Compatibility Adapters

- Wrap `Zotero.Prefs`, `Zotero.Reader`, `Zotero.Items`, and main-window globals behind narrow helpers.
- Reduce direct global access in business logic modules.

## Phase 5: UI and Event Refactor

- Split event binding from business rules.
- Refactor `preferences`, `popup`, and reader-sidepane modules after the core helpers are stable.
- Add regression checks for annotation add/modify/delete and preferences persistence before major UI rewrites.
