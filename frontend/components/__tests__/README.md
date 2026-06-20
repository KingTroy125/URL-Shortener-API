# Shorten Hero — Component Test Suite

Unit test documentation for the `shorten-hero` feature components: `ShortenForm` and `ShortenedResult`.

## Overview

This test suite validates the presentational layer of the URL-shortening flow. Both components are treated as **pure, controlled components** — all state (`url`, `isLoading`, `error`, `copied`, `shortenedUrl`) is owned by a parent container and passed down via props, with all side effects (`onChangeUrl`, `onKeyDown`, `onShorten`, `onCopy`) delegated upward via callbacks. The tests assert this contract holds: given a set of props, the component renders the correct output and forwards the correct interactions without performing logic of its own.

## Stack

| Tool | Purpose |
|---|---|
| [Jest](https://jestjs.io/) | Test runner & assertions |
| [React Testing Library](https://testing-library.com/react) | Behavior-driven rendering & querying |
| `@testing-library/jest-dom` (implied) | DOM matchers (`toBeDisabled`, `toHaveClass`, etc.) |

Queries favor `getByRole` and `getByPlaceholderText` over test IDs or class selectors, per RTL's [guiding principle](https://testing-library.com/docs/queries/about/#priority) of testing what the user perceives, not implementation details.

## File Structure

```
__tests__/
  shorten-form.test.tsx
  shortened-result.test.tsx
shorten-hero/
  shorten-form.tsx
  shortened-result.tsx
```

> Note: the two suites currently live in a single file in this snippet. In the repo they should be split into two files as shown above — see [Recommendations](#recommendations).

---

## `ShortenForm`

**Props under test**

| Prop | Type | Description |
|---|---|---|
| `url` | `string` | Controlled input value |
| `error` | `string` | Validation/API error message |
| `isLoading` | `boolean` | Toggles disabled state + loading copy |
| `onChangeUrl` | `(value: string) => void` | Fired on input change |
| `onKeyDown` | `(e: KeyboardEvent) => void` | Fired on keydown (e.g. submit-on-Enter) |
| `onShorten` | `() => void` | Fired on submit button click |

**Coverage**

- ✅ Initial render: input present and empty, button enabled, no loading text
- ✅ Controlled value reflects the `url` prop
- ✅ `onChangeUrl` fires once with the new value on input change
- ✅ `onShorten` fires once on button click
- ✅ `onKeyDown` fires once on keydown
- ✅ Loading state: button disabled, "Shortening..." shown, "Shorten" hidden
- ✅ Error state: message rendered with `text-destructive` styling class

**Gaps to consider**

- `onChangeUrl` argument shape — verified for a single change event, but not for paste, clear, or multi-character bursts.
- No assertion that `onShorten` is **not** called when `isLoading` is true and the (disabled) button is clicked — disabled buttons don't fire click events in jsdom, but this is an implicit assumption worth asserting explicitly given it's a correctness-critical guard.
- No test for `error=''` rendering *no* error element (only the positive case is covered).
- Accessibility: no assertion on `aria-invalid` / `aria-describedby` linking the input to the error message, if that wiring exists in the component.

---

## `ShortenedResult`

**Props under test**

| Prop | Type | Description |
|---|---|---|
| `shortenedUrl` | `string` | The resulting short URL, rendered as a link |
| `copied` | `boolean` | Toggles "Copy" vs "Copied!" affordance |
| `onCopy` | `() => void` | Fired when the copy button is clicked |

**Coverage**

- ✅ Link renders with correct `href`, and safe external-link attributes (`target="_blank"`, `rel="noopener noreferrer"`)
- ✅ `copied=false` → "Copy" button rendered, "Copied!" absent
- ✅ `copied=true` → "Copied!" button rendered, "Copy" absent
- ✅ `onCopy` fires once on click

**Gaps to consider**

- No test for the icon swap (copy icon vs. check icon) if that's visually meaningful and not just covered by text — icons-only buttons should also assert via `aria-label` or `title` rather than relying solely on accessible name matching.
- No test for empty/`undefined` `shortenedUrl` (defensive rendering).
- `rel="noopener noreferrer"` is a security-relevant attribute (mitigates [reverse tabnabbing](https://owasp.org/www-community/attacks/Reverse_Tabnabbing)) — worth a comment in the test itself noting *why* it's asserted, not just that it is.

---

## Running the Tests

```bash
# all tests
npm test

# this suite only
npm test -- shorten-form shortened-result

# watch mode
npm test -- --watch

# coverage
npm test -- --coverage
```

## Conventions Followed

1. **`beforeEach(jest.clearAllMocks)`** — guarantees call-count assertions (`toHaveBeenCalledTimes(1)`) aren't polluted by state leaking across tests.
2. **Mocks are module-scoped, not per-test** — acceptable here since props are stable primitives/functions; consider re-instantiating mocks per `describe` block if prop identity ever matters (e.g. `React.memo` comparisons).
3. **Negative assertions paired with positive ones** — e.g. asserting "Shortening..." appears *and* "Shorten" is absent, rather than just one side. This guards against both text leaking through and the wrong branch rendering.
4. **No snapshot testing** — tests assert specific, intentional behavior rather than serialized output, avoiding brittle snapshot diffs on unrelated markup changes.

## Recommendations

- **Split into two files** (`shorten-form.test.tsx`, `shortened-result.test.tsx`) for independent test-runner reporting and clearer ownership boundaries.
- **Add an integration test** at the parent container level that wires real state to `ShortenForm` + `ShortenedResult`, since these unit tests intentionally stop at the prop boundary and won't catch integration regressions (e.g. a misnamed prop in the parent).
- **Add `userEvent` over `fireEvent`** where feasible — `@testing-library/user-event` more accurately simulates real browser event sequences (focus, keydown, keypress, keyup, input) and is the currently recommended default over raw `fireEvent`.
- **Assert the disabled-click no-op explicitly** for `ShortenForm`, since it's a correctness invariant (no duplicate submissions while loading), not just an implementation detail.