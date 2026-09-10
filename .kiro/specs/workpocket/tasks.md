# Implementation Plan: WorkPocket

## Overview

The WorkPocket MVP is already built: the unified `WorkItem` model, `storageService` (localStorage + sample seeding), the `useWorkItems` hook (CRUD, search/filter, dashboard stats), the rule-based `categorization.ts` parser, the manual `CaptureModal`/`CaptureInput` flow, type-specific pages, and the dashboard all exist and work.

Because of that, this plan is split into two intents:

- **Verify existing MVP behavior** — no rebuilding. These tasks stand up the test tooling (Vitest + fast-check, which do not yet exist) and write property/example tests that assert the current code already satisfies the requirements. If a test surfaces a genuine gap against the spec, fix the underlying code minimally.
- **Build the new Smart Capture AI feature** — the only substantial new production code: `services/geminiClient.ts`, `services/smartCapture.ts`, the Smart-mode branch in `CaptureModal`, `metadata.source` provenance, env config (`VITE_GEMINI_API_KEY`), and wiring to `addItem`.

Language is TypeScript throughout (matches the existing codebase and the design). Property tests use `fast-check` with `fc.assert(..., { numRuns: 100 })` and are tagged `// Feature: workpocket, Property {n}: {text}`. Tests run under Vitest with `vitest --run` (never watch mode in automation).

## Tasks

- [ ] 1. Set up test tooling and env configuration
  - [ ] 1.1 Install and configure Vitest + fast-check + jsdom
    - Add dev deps: `vitest`, `fast-check`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`
    - Add `test` (`vitest --run`) and `test:watch` scripts to `package.json`
    - Create `vitest.config.ts` (or extend `vite.config.ts`) with `environment: 'jsdom'`, globals enabled, and a `src/test/setup.ts` that imports `@testing-library/jest-dom`
    - Add a trivial smoke test to confirm the runner executes
    - _Requirements: supports testing strategy for all requirements_

  - [ ] 1.2 Add Gemini env configuration and documentation
    - Create `.env.example` with `VITE_GEMINI_API_KEY=` and a comment noting it is optional and client-side
    - Ensure `.env` / `.env.local` are gitignored (verify `.gitignore`)
    - Add a README section documenting `VITE_GEMINI_API_KEY`, the client-side-key tradeoff, rule-based fallback when unset, and the note to set it as a Vercel environment variable
    - _Requirements: 16.1, 17.4_

  - [ ] 1.3 Create shared fast-check generators for the test suite
    - Add `src/test/generators.ts` exporting `arbWorkItem`, `arbCaptureInput` (non-empty title), `arbWhitespace`, `arbUrlPrefixedText`, `arbCodeLikeText`, `arbTaskLikeText`, `arbPlainProse`, `arbTagString`, and `arbParsedItemArray`
    - _Requirements: supports Properties 1-24_

- [ ] 2. Verify WorkItem lifecycle (storage + hook) — existing behavior
  - [ ]* 2.1 Property test: creation preserves fields and sets lifecycle values
    - **Property 1: Creation preserves provided fields and sets lifecycle values**
    - **Validates: Requirements 1.1, 1.2, 1.4, 5.1**
    - Exercise `storageService.addItem` with `arbCaptureInput`; assert fields carried, non-empty `id`, valid ISO `createdAt`/`updatedAt`, `status === 'active'`
  - [ ]* 2.2 Property test: default priority is medium
    - **Property 3: Default priority is medium**
    - **Validates: Requirements 1.5**
    - Note: confirms behavior; if `addItem` does not default priority, add the minimal default
  - [ ]* 2.3 Property test: update applies changes and preserves identity
    - **Property 4: Update applies changes while preserving identity**
    - **Validates: Requirements 2.1, 2.2**
    - Assert changed fields reflected, `updatedAt` advances, `id`/`createdAt` preserved via `storageService.updateItem`
  - [ ]* 2.4 Property test: update of absent id fails without side effects
    - **Property 5: Update of an absent id fails without side effects**
    - **Validates: Requirements 2.3**
  - [ ]* 2.5 Property test: delete removes exactly the matching item; absent id is a no-op
    - **Property 6: Delete removes exactly the matching item; absent id is a no-op**
    - **Validates: Requirements 3.1, 3.2**
  - [ ]* 2.6 Property test: completion toggle round-trips status
    - **Property 7: Completion toggle round-trips status**
    - **Validates: Requirements 4.1, 4.2**
    - Assert `active`↔`completed` and `updatedAt` advances via `storageService.toggleComplete`
  - [ ]* 2.7 Property test: new items appear ahead of older items
    - **Property 10: New items appear ahead of older items**
    - **Validates: Requirements 7.2**
  - [ ]* 2.8 Property test: persistence round-trip
    - **Property 13: Persistence round-trip**
    - **Validates: Requirements 10.1, 10.3**
    - Save then read back returns an equal set; persisted set equals in-memory set after create/update/delete

- [ ] 3. Verify search, filtering, and dashboard stats — existing behavior
  - [ ]* 3.1 Property test: type filtering returns only the selected type
    - **Property 11: Type filtering returns only the selected type**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 9.2**
    - Extract the filter predicate from `useWorkItems` into a pure helper if needed to test without React
  - [ ]* 3.2 Property test: search returns only items matching query and active filter
    - **Property 12: Search returns only items matching query and active filter**
    - **Validates: Requirements 9.1, 9.3, 9.5**
    - Cover title/content/tags/url/fileName/language metadata, case-insensitive; empty query equals filter-only set
  - [ ]* 3.3 Property test: dashboard stats are derived correctly
    - **Property 14: Dashboard stats are derived correctly**
    - **Validates: Requirements 11.1, 11.2, 11.3**
    - active count, urgent count (active + high), due-today (active task with today's dueDate)
  - [ ]* 3.4 Example test: storage first-launch seeding and read-failure fallback
    - Empty localStorage → sample set seeded and returned; corrupt/throwing read → sample set returned and error logged
    - _Requirements: 10.2, 10.4_

- [ ] 4. Checkpoint - MVP verification tests
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Verify and extend the rule-based parser (Rule_Based_Parser)
  - [ ]* 5.1 Property test: rule-based type detection classifies each input class
    - **Property 15: Rule-based type detection classifies each input class**
    - **Validates: Requirements 13.1, 13.2, 13.3, 13.4**
    - Use `arbUrlPrefixedText`/`arbCodeLikeText`/`arbTaskLikeText`/`arbPlainProse` against `detectItemType`; link must set `metadata.url`
  - [ ]* 5.2 Property test: tag normalization and de-duplication
    - **Property 9: Tag normalization and de-duplication**
    - **Validates: Requirements 5.4, 5.5, 14.4**
    - Comma lists + inline `#hashtags`: trimmed, `#` stripped, lowercased, de-duplicated set
  - [ ] 5.3 Add a rule-based normalizer that returns a single draft with priority/due-date extraction
    - Add `ruleParse(text, forcedType?): WorkItemDraft[]` in `utils/categorization.ts` (or a small `ruleParser.ts`) reusing `detectItemType`/`extractTags`
    - Derive a concise title, set `priority = 'high'` on "urgent"/"high priority" hints, extract due date from phrases like "tomorrow"/"Friday"/"at 4pm" as ISO (omit when absent)
    - _Requirements: 14.1, 14.2, 14.3, 14.5, 15.3_
  - [ ]* 5.4 Property test: rule-based priority hints map to high
    - **Property 18: Rule-based priority hints map to high**
    - **Validates: Requirements 14.3**
  - [ ]* 5.5 Property test: due date stored as ISO, omitted when absent
    - **Property 8: Due date stored as ISO, omitted when absent**
    - **Validates: Requirements 5.2, 5.3, 14.5**
  - [ ]* 5.6 Property test: every rule draft has a non-empty title
    - **Property 17: Every draft has a non-empty title**
    - **Validates: Requirements 14.1**
  - [ ]* 5.7 Property test: rule fallback yields exactly one draft
    - **Property 19: Rule fallback yields exactly one draft**
    - **Validates: Requirements 15.3**
  - [ ]* 5.8 Example tests: concrete NL phrases lock in behavior
    - "tomorrow"/"Friday"/"at 4pm" → expected `dueDate`; "urgent" → `high`
    - _Requirements: 14.2, 14.3_

- [ ] 6. Implement the Gemini REST client (GeminiClient)
  - [ ] 6.1 Create `src/services/geminiClient.ts`
    - Define `ParsedItem`, `GeminiError`/`GeminiErrorKind`, `GeminiClient` interface, and `createGeminiClient(apiKey?)`
    - `hasKey()` reflects presence of `VITE_GEMINI_API_KEY`
    - `generateItems(text, timeoutMs)` POSTs `gemini-1.5-flash` with a JSON-array prompt containing ONLY `text`; use `AbortController` for timeout
    - Throw `GeminiError` with kind `network`/`timeout`/`http-error`/`invalid-json`; strip code fences and `JSON.parse` the payload
    - _Requirements: 16.1, 16.2, 16.3, 17.2_
  - [ ]* 6.2 Unit tests for GeminiClient with mocked `fetch`
    - Success payload → parsed `ParsedItem[]`; non-2xx → `http-error`; fetch reject → `network`; abort → `timeout`; non-array/garbage → `invalid-json`
    - Assert request body contains only the capture text
    - _Requirements: 16.1, 16.2, 16.3, 17.2_

- [ ] 7. Implement the Smart Capture orchestrator (SmartCaptureService)
  - [ ] 7.1 Create `src/services/smartCapture.ts`
    - Define `ParseSource`, `WorkItemDraft`, `SmartParseResult`, `SmartCaptureOptions`, `SmartCaptureService`, and `createSmartCaptureService(deps?)`
    - `isAiEnabled()` delegates to the Gemini client's `hasKey()`
    - `parse(text, options)`: empty→`{ drafts: [], source: 'rule' }`; no key→rule (`no-key`, no network); AI success→normalize each `ParsedItem` to a draft (`source: 'ai'`); any AI failure→rule fallback with matching `fallbackReason`
    - Apply `forcedType` to every draft when set; set `metadata.source` to `'smart-capture-ai'` or `'smart-capture-rule'`
    - _Requirements: 15.1, 15.2, 16.1, 16.2, 16.3, 16.4, 13.5, 17.4_
  - [ ] 7.2 Implement the ParsedItem → WorkItemDraft normalizer
    - Non-empty `title` required; unknown/missing `type`→`note`; invalid `priority` dropped (→ default `medium`); unparseable `dueDate` dropped; `tags` lowercased/de-duped; drop fully-invalid elements, full-invalid result triggers fallback
    - _Requirements: 14.1, 14.4, 14.5, 15.2_
  - [ ]* 7.3 Property test: AI is used when configured and successful
    - **Property 21: AI is used when configured and successful**
    - **Validates: Requirements 16.1**
    - Mock client returns valid payload; assert `source === 'ai'` and drafts derive from payload
  - [ ]* 7.4 Property test: AI multi-item responses normalize independently and preserve count
    - **Property 20: AI multi-item responses normalize independently and preserve count**
    - **Validates: Requirements 15.1, 15.2**
    - Use `arbParsedItemArray`; N objects → N drafts, each normalized from its own source object
  - [ ]* 7.5 Property test: any AI failure falls back to the rule parser without interrupting the flow
    - **Property 22: Any AI failure falls back to the rule parser without interrupting the flow**
    - **Validates: Requirements 16.2, 16.3, 16.4**
    - Mock client throws each `GeminiError` kind; assert resolves (never throws), `source === 'rule'`, ≥1 draft
  - [ ]* 7.6 Property test: manual type selection overrides detection
    - **Property 16: Manual type selection overrides detection**
    - **Validates: Requirements 13.5**
    - Every draft has `type === forcedType` for both AI and rule paths
  - [ ]* 7.7 Property test: only the current capture text is transmitted to the AI service
    - **Property 23: Only the current capture text is transmitted to the AI service**
    - **Validates: Requirements 17.2, 17.3**
    - Request spy: body contains capture text, contains no field of any stored WorkItem
  - [ ]* 7.8 Property test: no key means no network request and local parsing only
    - **Property 24: No key means no network request and local parsing only**
    - **Validates: Requirements 17.4**
    - With no key, fetch spy is never called; `source === 'rule'`

- [ ] 8. Checkpoint - Smart Capture services
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Build Smart mode UI and wire to persistence
  - [ ] 9.1 Add Manual/Smart mode toggle and Smart-mode branch to `CaptureModal`
    - Add mode state; Manual renders the existing `CaptureInput` unchanged; Smart renders a freeform `textarea` + Parse action
    - Show a loading state during the AI request and a subtle "parsed locally" hint when `fallbackReason` is anything other than `no-key`
    - _Requirements: 6.1, 16.4_
  - [ ] 9.2 Implement the Smart-mode review/confirm step
    - After Parse, call `smartCaptureService.parse(text, { forcedType })` and show produced drafts with editable type/title
    - Reject empty/whitespace input (no draft, modal stays open); pass a `forcedType` only when the user explicitly selects a type
    - _Requirements: 1.3, 13.5, 14.1, 15.1_
  - [ ] 9.3 Wire confirm to `addItem` (persistence via existing hook)
    - On confirm, call `onSave` once per draft (wired to `useWorkItems.addItem`), then close the modal
    - Ensure `metadata.source` provenance flows through unchanged to storage
    - _Requirements: 6.4, 7.2, 10.1, 17.1_
  - [ ]* 9.4 Property test: whitespace-only titles are rejected
    - **Property 2: Whitespace-only titles are rejected**
    - **Validates: Requirements 1.3**
    - Drive Smart parse / capture submit with `arbWhitespace`; assert stored set unchanged
  - [ ]* 9.5 Example tests: modal open/close and quick-capture shortcut
    - Add button opens modal; `c` opens; save and cancel close it; shortcut ignored while an input/textarea/contenteditable is focused without a modifier
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 10. Verify layout, pages, and empty states — existing behavior
  - [ ]* 10.1 Example tests: layout, per-type indicator, and navigation
    - Sidebar + search bar present; each item shows a type visual indicator; selecting a sidebar destination switches the view
    - _Requirements: 12.1, 12.2, 12.3_
  - [ ]* 10.2 Example tests: inbox ordering, empty states, and grouped search results
    - Inbox shows all items newest-first; empty-state message for inbox and type pages; search results grouped by type
    - _Requirements: 7.1, 7.3, 8.5, 9.4_

- [ ] 11. Integration and privacy smoke tests
  - [ ]* 11.1 Integration test: end-to-end Smart capture
    - Drive Smart mode with a mocked Gemini success and a forced failure; assert produced items land in localStorage via `addItem` and appear newest-first in the Inbox
    - _Requirements: 15.1, 16.1, 16.2, 7.2, 10.1_
  - [ ]* 11.2 Smoke test: persistence privacy boundary
    - Assert `storageService` is the only module writing persistence and Smart Capture paths never write items directly
    - _Requirements: 17.1_

- [ ] 12. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional (all are tests here) and can be skipped for a faster MVP demo, but they are the primary means of verifying the already-built MVP and the new Smart Capture logic.
- MVP behavior (Tasks 2, 3, 5.1-5.2, 10) is verified, not rebuilt. Only fix underlying code if a test reveals a genuine spec gap.
- New production code is concentrated in Tasks 1.1-1.2, 5.3, 6.1, 7.1-7.2, and 9.1-9.3.
- Every property test is a single test tagged `// Feature: workpocket, Property {n}: {text}` and runs `{ numRuns: 100 }`. Properties 1-24 are each covered exactly once.
- Deployment is intentionally not a task; only `.env.example` and the README env note (Task 1.2) are included.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "5.3", "6.1"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8", "3.1", "3.2", "3.3", "3.4", "5.1", "5.2", "6.2", "7.1"] },
    { "id": 3, "tasks": ["5.4", "5.5", "5.6", "5.7", "5.8", "7.2", "10.1", "10.2"] },
    { "id": 4, "tasks": ["7.3", "7.4", "7.5", "7.6", "7.7", "7.8", "9.1"] },
    { "id": 5, "tasks": ["9.2"] },
    { "id": 6, "tasks": ["9.3"] },
    { "id": 7, "tasks": ["9.4", "9.5", "11.1", "11.2"] }
  ]
}
```
