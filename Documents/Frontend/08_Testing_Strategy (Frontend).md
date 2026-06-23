# 08 Testing Strategy (Frontend)

This document describes the testing strategy, standards, tooling, and execution pipelines for the URL Shortener frontend application. Our testing methodology ensures stability, regressions prevention, and high-fidelity user interaction simulation.

---

## 1. Testing Philosophy and Pyramid

We follow a balanced testing hierarchy to achieve maximum confidence with optimal maintenance overhead:

```text
       ▲
      / \     End-to-End (E2E) - Target: Critical user flows (e.g., Playwright)
     /   \    
    /     \   Integration - Form orchestration, validation, and API integration
   /_______\  Unit - Utility functions and isolated UI component rendering
```

* **Unit Tests**: Focus on utility helpers (e.g., URL validation regex, class names merging) and isolated presentational primitives.
* **Integration Tests**: Focus on component orchestration and state transitions (e.g., verifying that rendering `ShortenForm` propagates user inputs and responds correctly to network status).
* **Target Coverage**: We aim for **80%+ statement coverage** on all business logic files (`lib/`, custom hooks) and core page orchestrators.

---

## 2. Tooling and Test Stack

Our testing environment is constructed with modern, standardized React and TypeScript tools:

| Tool | Purpose | Key Features Utilized |
| :--- | :--- | :--- |
| **Jest** | Test Runner & Assertions | Fast parallel execution, mocking, code coverage generation |
| **React Testing Library** | Component Rendering | Accessibility-driven queries (`getByRole`), User-event simulations |
| **TypeScript** | Static Analysis | Type checking inside test suites to align with production types |

---

## 3. Scope of Tests

### A. Component Tests

#### `ShortenForm` (Component Unit & Integration)
Verifies user interaction flow and input boundary handling.
* **Initial State**: Confirms input field starts empty and the submit button is enabled.
* **Input Propagation**: Validates that typing in the input fields triggers the corresponding `onChangeUrl` callback with the correct arguments.
* **Loading State**: Validates that setting `isLoading = true` disables both the input field and button, and swaps the action text to a loader (e.g., "Shortening...").
* **Error State**: Confirms error strings are rendered with semantic error styles (`text-destructive`) when provided.
* **Event Handlers**: Validates that press triggers (`Click`, `Enter` keydown) invoke execution functions.

#### `ShortenedResult` (Component Unit)
Verifies output presentation and device clipboard interaction.
* **Visual Match**: Assures the shortened URL string is rendered correctly in the UI.
* **Clipboard Interaction**: Tests the "Copy to Clipboard" functionality by mocking `navigator.clipboard.writeText` and validating it is called with the target URL.
* **UI Feedback**: Confirms visual feedback (e.g., change of icon, button text change to "Copied!") occurs post-copy.

### B. Utility Tests (Planned)
Any pure functional logic under `lib/` must be unit-tested.
* **URL Validation**: Standard validator testing against a test suite of edge-case URLs (valid protocols, missing top-level domains, malformed strings).

---

## 4. Execution and Local Workflow

Npm scripts are configured in `package.json` to support local development and continuous integration pipelines:

### Runs tests once and outputs results:
```bash
npm run test
```

### Runs tests in watch mode (ideal during active development):
```bash
npm run test:watch
```

### Generates test coverage report:
```bash
npx jest --coverage
```
The output coverage files are written to `coverage/` and are git-ignored.

---

## 5. Testing Best Practices

1. **Query by Accessibility (ARIA) Roles**: Always prioritize finding elements using accessibility mappings (e.g., `screen.getByRole('button', { name: /shorten/i })`) over fragile CSS class queries or test IDs. This enforces digital accessibility standards.
2. **Clear Mock States**: Always include `jest.clearAllMocks()` in `beforeEach` hooks to prevent mock state pollution across different tests.
3. **Simulate Real User Events**: Use `@testing-library/user-event` where possible instead of `fireEvent` to replicate real browser typing and clicking nuances more accurately.
4. **Mock Network Boundaries**: Never hit active endpoints during test execution. Mock your network boundaries using standardized mock functions or Mock Service Worker (MSW) handlers.