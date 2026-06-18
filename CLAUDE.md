# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Rework in progress — read this first

`react-native-a11y` is being **rebuilt from scratch** by re-merging
`react-native-a11y-order` + `react-native-external-keyboard` back into one
self-contained package under a single `A11y.*` namespace. The 0.7.0
implementation has been cleared (clean-slate); `src/`, `ios/`, `android/`
currently hold a **compiling stub skeleton**, not working features.

- **Legacy 0.7.0 is preserved in git:** tag `legacy-0.7`, branch `legacy/0.7.0`.
  Use it for reference, not as the base to extend.
- **The plan and decisions live one level up** (`../`, the `a11y-loop` workspace):
  - `REWORK_STEP_0.md` … `REWORK_STEP_5.md` — the staged plan (we are post-Step 0).
  - `A11Y_REWORK_PLAN.md` — index + locked decisions + risks.
  - `PACKAGES_SCOPE.md` — feature inventory of the three packages.
  - `REWORK_API_MAP.md` — export map + native naming (`RCA11y*` / `com.reactnativea11y`).
- **Do not follow pre-rework architecture notes** — the old `A11yModule` /
  `RCA11yFocusWrapper` / per-platform module design is gone. Source of truth for
  feature behavior is the two modern packages, ported in Steps 1–4.

### Locked decisions (summary)
Single `A11y.*` namespace; unified `A11y.View`/`Pressable`/`Input` (opt-in props);
single `A11y.FocusTrap`/`A11y.FocusFrame` (SR + keyboard); one ordering engine via
`orderType` (`auto|keyboard|screen-reader`); `focusTarget` (`self|child|subview`)
for the focus-target axis; keep imperative `useFocusOrder`/`useDynamicFocusOrder`;
native merged views but scoped modules; naming on `RCA11y*` / `com.reactnativea11y`;
3 mutually-exclusive published packages; web best-effort View-mocked.

## Toolchain

- **Yarn 4** (`yarn@4.11.0`) with workspaces; `example/` is the only workspace. Always use `yarn`, not `npm`.
- **Node** pinned to `v22.20.0` (`.nvmrc`). RN 0.76.5 / React 18.3.1.

## Commands

- `yarn typecheck` — `tsc` (no emit)
- `yarn lint` — ESLint over `**/*.{js,ts,tsx}`
- `yarn test` — Jest (preset `react-native`)
- `yarn prepare` — build `lib/` via `react-native-builder-bob` (commonjs + module + typescript)
- `yarn clean` — remove `lib/` and native build dirs
- `yarn example start` / `yarn example android` / `yarn example ios` — example app (`cd example/ios && pod install` first for iOS)

**Pre-commit** (`lefthook.yml`): `eslint` on staged files, `tsc`, `commitlint`. Conventional Commits; releases via `release-it`.

## Current structure (skeleton)

```
src/
  index.tsx / index.web.ts   // A11y namespace + top-level exports (stubs)
  components/                // A11yView, A11yPressable, A11yInput, A11yOrder,
                             //   A11yIndex, A11yCard, A11yLock (Trap+Frame),
                             //   A11yPaneTitle, A11yFocusGroup — createStubView stubs
  modules/                   // A11yAnnounceModule, Keyboard (stubs)
  hooks/ providers/ utils/ types/
  context/ nativeSpecs/      // empty — populated in Steps 1–2
ios/   RCA11yPlaceholder.h    // legacy cleared; RCA11y* impl in Step 4
android/ .../A11yPackage.java  // stub ReactPackage (empty); impl in Step 3
```

- Codegen: spec `RNA11ySpec`, `jsSrcsDir: src`, java package `com.reactnativea11y`,
  gradle `react.libraryName = "A11y"`. `componentProvider`/`modulesProvider` are
  empty until specs land in Step 2 (see `REWORK_API_MAP.md` for the target map).
- Conventions: each component is a folder with an `index.tsx`; platform variants use
  `.ios.tsx` / `.android.tsx` / `.web.tsx`.
