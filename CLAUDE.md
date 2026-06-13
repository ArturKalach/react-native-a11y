# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`react-native-a11y` is a React Native native module library that improves accessibility (screen reader focus/order/announcements and external-keyboard focus) on iOS and Android. It targets the **New Architecture** (TurboModules + Fabric/Codegen) with old-architecture fallbacks. The JS API is published from `src/` and built into `lib/`; native code lives in `ios/` (Objective-C++ `.mm`) and `android/` (Java).

> The README marks the library as outdated/beta. Functionality is being split out into standalone packages (`react-native-a11y-order`, `react-native-external-keyboard`, `react-native-is-keyboard-connected`, `react-native-a11y-container`); the roadmap is to realign this package with those.

## Toolchain

- **Yarn 4** (`yarn@4.11.0`) with workspaces; `example/` is the only workspace. Always use `yarn`, not `npm`.
- **Node** pinned to `v22.20.0` (`.nvmrc`).

## Commands

Run from the repo root:

- `yarn typecheck` — `tsc` (no emit; type-check only)
- `yarn lint` — ESLint over `**/*.{js,ts,tsx}`
- `yarn test` — Jest (preset `react-native`)
- Single test: `yarn test src/__tests__/index.test.tsx` or filter by name with `yarn test -t "name"`
- `yarn prepare` — build the publishable `lib/` via `react-native-builder-bob` (commonjs + module + typescript). Run this when JS API changes need to be reflected in the built output.
- `yarn clean` — remove `lib/` and native build dirs

Example app (RN dev app, drives the native code):

- `yarn example start` — Metro
- `yarn example android` / `yarn example ios` — build & run (run `cd example/ios && pod install` first for iOS)
- `turbo build:android` / `turbo build:ios` — Turbo tasks wrapping the native builds

**Pre-commit** (`lefthook.yml`): runs `eslint` on staged files, `tsc`, and `commitlint`. Commits must follow Conventional Commits (`@commitlint/config-conventional`); releases are cut with `release-it` from that history.

## Architecture

### Public API
Everything is re-exported from [src/index.tsx](src/index.tsx): the `A11yModule` (core imperative API), components (`KeyboardFocusView`, `PaneView`, `A11yOrder`, `Pressable`, `KeyboardFocusTextInput`), hooks (`useFocusOrder`, `useDynamicFocusOrder`, `useCombinedRef`), providers (`A11yProvider`, `KeyboardProvider`, `useA11yStatus`, `useKeyboardStatus`), and `a11yConfig`.

### Platform-split modules
The core [src/modules/A11yModule/](src/modules/A11yModule/) uses React Native's platform file resolution:
- `A11yModule.ts` — a typed stub (`{} as IA11yModule`) so the bundler always has a default; the real implementation is picked per platform.
- `A11yModule.ios.ts` / `A11yModule.android.ts` — concrete `IA11yModule` implementations. They differ meaningfully: e.g. iOS uses native `setAccessibilityFocus`/preferred-keyboard-focus and a `GameController` framework check; Android falls back to RN's `AccessibilityInfo`, makes `setPreferredKeyboardFocus` a `noop`, and wraps keyboard focus in `InteractionManager`.

When adding a method to the module, update **all** of: `A11yModule.types.ts` (`IA11yModule`), both `.ios`/`.android` impls, and the native bridge below.

### Native bridge resolution
[src/modules/A11yModule/RCA11yModule/RCA11yModule.ts](src/modules/A11yModule/RCA11yModule/RCA11yModule.ts) is the single boundary to native code. It picks the **TurboModule** spec ([src/nativeSpecs/NativeA11yModule.ts](src/nativeSpecs/NativeA11yModule.ts), registered as `RCA11yModule`) when `global.__turboModuleProxy` exists, otherwise `NativeModules.RCA11yModule`, and throws a linking-error proxy if neither is present. JS works with React refs and converts to native tags via `findNodeHandle` — callers pass refs, not tags.

### Codegen
`codegenConfig` in [package.json](package.json) (spec name `RNA11ySpec`, `jsSrcsDir: src/nativeSpecs`) generates native interfaces from [src/nativeSpecs/](src/nativeSpecs/):
- `NativeA11yModule.ts` → the TurboModule
- `*NativeComponent.ts` → Fabric host components: `RCA11yFocusWrapper`, `RCA11yPaneView`, `RCA11yTextInputWrapper`

Native implementations of these live under `ios/Components/`, `ios/Modules/` and `android/src/main/java/com/reactnativea11y/`. Android keeps parallel `android/src/newarch/` and `android/src/oldarch/` spec shims selected at build time.

### Providers
[A11yProvider](src/providers/A11yProvider/A11yProvider.tsx) composes `A11yStatusProvider` → `A11yStatusKeyboard` → `KeyboardProvider`. Apps wrap their root in `A11yProvider`.

### Conventions
- Each unit is a folder with `Component.tsx` / `Component.types.ts` / `index.ts` barrel; platform variants use `.ios.tsx` / `.android.tsx`.
- `dev/` subfolders (e.g. [src/hooks/dev/](src/hooks/dev/), [src/utils/dev/](src/utils/dev/)) hold internal helpers, not public API.
- `a11yConfig` ([src/configs/RNA11yConfig.ts](src/configs/RNA11yConfig.ts)) is a singleton for overriding the accessibility change event name (the RN default `'change'` is deprecated).
