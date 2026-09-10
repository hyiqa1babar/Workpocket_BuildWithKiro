# Requirements Document

## Introduction

WorkPocket is a lightweight personal work command center for busy students and developers. Throughout a working day, users encounter tasks, notes, links, code snippets, and files that end up scattered across bookmarks, note apps, messaging threads, and text files. WorkPocket provides one unified place to capture, organize, and search these items. The application runs entirely in the browser with no backend, no authentication, and no server-side database; all data persists in the browser's local storage.

This document specifies the already-built MVP (capture, organization, views, search, persistence, dashboard, and UI) together with the headline AI-core feature, Smart Capture, which automatically understands freeform input and structures it into one or more typed WorkItems. Smart Capture supports both AI-assisted parsing and a rule-based fallback so the application remains functional when AI parsing is unavailable.

## Glossary

- **WorkPocket**: The overall client-side web application.
- **WorkItem**: The single unified data record used for every captured entry. Fields: `id`, `title`, `content`, `type`, `priority`, `status`, `createdAt`, `updatedAt`, `dueDate` (optional), `tags`, `metadata` (optional).
- **Item_Type**: The category of a WorkItem, one of `task`, `note`, `link`, `code`, or `file`.
- **Priority**: The urgency of a WorkItem, one of `low`, `medium`, or `high`.
- **Status**: The lifecycle state of a WorkItem, one of `active`, `completed`, or `archived`.
- **Capture_Service**: The component responsible for creating a WorkItem from user input.
- **Quick_Capture_Modal**: The dialog opened by the add button or keyboard shortcut for fast entry of a WorkItem.
- **Smart_Capture**: The AI-core parsing feature that converts freeform text into one or more structured WorkItems.
- **AI_Parser**: The component that sends freeform text to a language model service to produce structured WorkItem fields.
- **Rule_Based_Parser**: The deterministic local component (`utils/categorization.ts`) that detects Item_Type, tags, and other fields using pattern rules without any network call.
- **Storage_Service**: The component that reads and writes WorkItems to browser local storage.
- **Inbox_View**: The view listing all captured WorkItems.
- **Dashboard_View**: The Today-focused view showing greeting, counts, due-today tasks, recent items, and upcoming tasks.
- **Search_Service**: The component that filters WorkItems by query text and by Item_Type.
- **Local_Storage**: The browser `localStorage` mechanism used for persistence.

## Requirements

### Requirement 1: Create a WorkItem

**User Story:** As a user, I want to create a WorkItem of a chosen type, so that I can save any piece of work in one place.

#### Acceptance Criteria

1. WHEN a user submits a capture form with a non-empty title, THE Capture_Service SHALL create a WorkItem with the provided title, content, Item_Type, Priority, tags, and optional due date.
2. WHEN the Capture_Service creates a WorkItem, THE Capture_Service SHALL assign a unique `id`, set `createdAt` and `updatedAt` to the current timestamp, and set `status` to `active`.
3. IF a capture form is submitted with an empty or whitespace-only title, THEN THE Capture_Service SHALL reject the submission and SHALL NOT create a WorkItem.
4. WHEN a user selects an Item_Type in the capture form, THE Capture_Service SHALL assign the selected Item_Type to the created WorkItem.
5. WHERE no Priority is chosen by the user, THE Capture_Service SHALL assign the Priority value `medium` to the created WorkItem.

### Requirement 2: Edit a WorkItem

**User Story:** As a user, I want to edit an existing WorkItem, so that I can keep its details accurate.

#### Acceptance Criteria

1. WHEN a user saves edits to an existing WorkItem, THE Capture_Service SHALL update the changed fields and SHALL set `updatedAt` to the current timestamp.
2. WHEN a WorkItem is updated, THE Capture_Service SHALL preserve the original `id` and `createdAt` values.
3. IF a user attempts to edit a WorkItem whose `id` does not exist, THEN THE Capture_Service SHALL return an update-failure result and SHALL leave stored WorkItems unchanged.

### Requirement 3: Delete a WorkItem

**User Story:** As a user, I want to delete a WorkItem, so that I can remove entries I no longer need.

#### Acceptance Criteria

1. WHEN a user confirms deletion of a WorkItem, THE Storage_Service SHALL remove the WorkItem with the matching `id` from Local_Storage.
2. IF a delete is requested for an `id` that does not exist, THEN THE Storage_Service SHALL return a delete-failure result and SHALL leave stored WorkItems unchanged.

### Requirement 4: Complete and Reactivate Tasks

**User Story:** As a user, I want to mark tasks complete, so that I can track what is finished.

#### Acceptance Criteria

1. WHEN a user marks an `active` WorkItem complete, THE Capture_Service SHALL set the Status of the WorkItem to `completed` and SHALL update `updatedAt`.
2. WHEN a user marks a `completed` WorkItem as not complete, THE Capture_Service SHALL set the Status of the WorkItem to `active` and SHALL update `updatedAt`.

### Requirement 5: Set Priority, Due Date, and Tags

**User Story:** As a user, I want to set priority, an optional due date, and tags on a WorkItem, so that I can organize and prioritize my work.

#### Acceptance Criteria

1. WHEN a user selects a Priority of `low`, `medium`, or `high`, THE Capture_Service SHALL store the selected Priority on the WorkItem.
2. WHERE a user provides a due date, THE Capture_Service SHALL store the due date on the WorkItem as an ISO date string.
3. WHERE a user provides no due date, THE Capture_Service SHALL store the WorkItem without a `dueDate` value.
4. WHEN a user enters comma-separated tags, THE Capture_Service SHALL store each tag on the WorkItem with surrounding whitespace and a leading `#` removed.
5. WHEN capture input contains inline hashtag tokens matching the pattern `#word`, THE Capture_Service SHALL extract each token as a lowercase tag and SHALL store a de-duplicated set of tags on the WorkItem.

### Requirement 6: Quick Capture Modal and Keyboard Shortcut

**User Story:** As a user, I want to open a quick capture dialog with a button or a keyboard shortcut, so that I can save something without breaking my flow.

#### Acceptance Criteria

1. WHEN a user activates the add button, THE WorkPocket SHALL open the Quick_Capture_Modal.
2. WHEN a user presses the quick-capture keyboard shortcut, THE WorkPocket SHALL open the Quick_Capture_Modal.
3. IF the quick-capture keyboard shortcut is pressed while a text input, textarea, or content-editable field is focused and the shortcut has no modifier key, THEN THE WorkPocket SHALL ignore the shortcut.
4. WHEN a WorkItem is saved from the Quick_Capture_Modal, THE WorkPocket SHALL close the Quick_Capture_Modal.
5. WHEN a user cancels the Quick_Capture_Modal, THE WorkPocket SHALL close the Quick_Capture_Modal without creating a WorkItem.

### Requirement 7: Unified Inbox View

**User Story:** As a user, I want a single inbox that shows everything I have captured, so that I can review all items in one place.

#### Acceptance Criteria

1. WHEN a user opens the Inbox_View, THE Inbox_View SHALL display all stored WorkItems.
2. WHEN a WorkItem is created, THE Inbox_View SHALL display the new WorkItem ahead of previously created WorkItems.
3. WHERE no WorkItems match the current view, THE Inbox_View SHALL display an empty-state message.

### Requirement 8: Type-Specific Pages

**User Story:** As a user, I want dedicated pages for tasks, notes, links, and code snippets, so that I can focus on one kind of item at a time.

#### Acceptance Criteria

1. WHEN a user opens the Tasks page, THE WorkPocket SHALL display only WorkItems whose Item_Type is `task`.
2. WHEN a user opens the Notes page, THE WorkPocket SHALL display only WorkItems whose Item_Type is `note`.
3. WHEN a user opens the Links page, THE WorkPocket SHALL display only WorkItems whose Item_Type is `link`.
4. WHEN a user opens the Code Snippets page, THE WorkPocket SHALL display only WorkItems whose Item_Type is `code`.
5. WHERE a type-specific page contains no matching WorkItems, THE WorkPocket SHALL display an empty-state message.

### Requirement 9: Search and Type Filtering

**User Story:** As a user, I want to search across my items and filter by type, so that I can find a specific item quickly.

#### Acceptance Criteria

1. WHEN a user enters a search query, THE Search_Service SHALL return WorkItems whose title, content, tags, URL metadata, file-name metadata, or language metadata contain the query text, matched case-insensitively.
2. WHEN a user selects an Item_Type filter, THE Search_Service SHALL return only WorkItems whose Item_Type equals the selected filter.
3. WHEN a search query and an Item_Type filter are both applied, THE Search_Service SHALL return only WorkItems that satisfy both the query and the filter.
4. WHEN a user submits a search query, THE Search_Service SHALL return matching WorkItems grouped by Item_Type.
5. WHERE the search query is empty, THE Search_Service SHALL return all WorkItems permitted by the active filters.

### Requirement 10: Local Persistence and Sample Data

**User Story:** As a user, I want my items to persist between sessions and to see example content on first launch, so that my work is retained and the app is usable immediately.

#### Acceptance Criteria

1. WHEN a WorkItem is created, updated, or deleted, THE Storage_Service SHALL persist the current set of WorkItems to Local_Storage.
2. WHEN WorkPocket loads and Local_Storage contains no WorkPocket data, THE Storage_Service SHALL initialize Local_Storage with the sample WorkItem set and SHALL return the sample WorkItem set.
3. WHEN WorkPocket loads and Local_Storage contains WorkPocket data, THE Storage_Service SHALL return the stored WorkItems.
4. IF reading WorkItems from Local_Storage fails, THEN THE Storage_Service SHALL return the sample WorkItem set and SHALL record the failure to the console.

### Requirement 11: Dashboard / Today View

**User Story:** As a user, I want a Today dashboard, so that I can see my current workload at a glance.

#### Acceptance Criteria

1. WHEN a user opens the Dashboard_View, THE Dashboard_View SHALL display a greeting and the count of WorkItems whose Status is `active`.
2. WHEN a user opens the Dashboard_View, THE Dashboard_View SHALL display the count of `active` WorkItems whose Priority is `high` as the urgent count.
3. WHEN a user opens the Dashboard_View, THE Dashboard_View SHALL display `active` WorkItems whose Item_Type is `task` and whose due date is the current date.
4. WHEN a user opens the Dashboard_View, THE Dashboard_View SHALL display the most recently created WorkItems.
5. WHEN a user opens the Dashboard_View, THE Dashboard_View SHALL display upcoming `task` WorkItems ordered by due date.

### Requirement 12: Desktop-First Productivity Layout

**User Story:** As a user, I want a clean desktop-first layout with clear item distinctions, so that I can navigate and scan my work efficiently.

#### Acceptance Criteria

1. THE WorkPocket SHALL display a left navigation sidebar and a top search bar.
2. THE WorkPocket SHALL display each WorkItem with a visual indicator that distinguishes its Item_Type.
3. WHEN a user selects a navigation destination in the sidebar, THE WorkPocket SHALL display the corresponding view.

### Requirement 13: Smart Capture Type Detection

**User Story:** As a user, I want WorkPocket to automatically detect what kind of item I am capturing, so that I do not have to categorize every entry manually.

#### Acceptance Criteria

1. WHEN a user submits freeform input that begins with an `http` or `https` URL, THE Smart_Capture SHALL create a WorkItem with Item_Type `link` and SHALL store the URL in the WorkItem metadata.
2. WHEN a user submits freeform input matching a code or shell-command pattern, such as a package-install command or a source-code keyword, THE Smart_Capture SHALL create a WorkItem with Item_Type `code`.
3. WHEN a user submits freeform natural-language input containing a task action word or a deadline phrase, THE Smart_Capture SHALL create a WorkItem with Item_Type `task`.
4. WHERE submitted freeform input matches no link, code, or task pattern, THE Smart_Capture SHALL create a WorkItem with Item_Type `note`.
5. IF a user manually selects an Item_Type before saving, THEN THE Smart_Capture SHALL use the manually selected Item_Type instead of the detected Item_Type.

### Requirement 14: Smart Capture Field Extraction

**User Story:** As a user, I want WorkPocket to pull out a concise title, due date, priority hints, and tags from what I paste, so that my captured item is structured without extra typing.

#### Acceptance Criteria

1. WHEN Smart_Capture processes freeform input, THE Smart_Capture SHALL produce a concise title derived from the input.
2. WHEN freeform input contains a date or time phrase such as "Friday", "tomorrow", or "at 4pm", THE Smart_Capture SHALL extract a due date and SHALL store the due date on the WorkItem as an ISO date string.
3. WHEN freeform input contains a priority hint such as "urgent" or "high priority", THE Smart_Capture SHALL set the WorkItem Priority to `high`.
4. WHEN freeform input contains hashtag tokens or recognizable topic keywords, THE Smart_Capture SHALL store the corresponding tags on the WorkItem as a de-duplicated set.
5. WHERE Smart_Capture cannot extract a due date from the input, THE Smart_Capture SHALL create the WorkItem without a `dueDate` value.

### Requirement 15: Smart Capture Compound Splitting

**User Story:** As a user, I want a single dump of text that contains several distinct things to become several structured items, so that each piece of work is tracked separately.

#### Acceptance Criteria

1. WHEN Smart_Capture processes freeform input that expresses more than one distinct actionable item, THE Smart_Capture SHALL create one WorkItem per distinct item.
2. WHEN Smart_Capture splits freeform input into multiple WorkItems, THE Smart_Capture SHALL apply Item_Type detection and field extraction independently to each created WorkItem.
3. WHERE Smart_Capture determines that freeform input expresses a single item, THE Smart_Capture SHALL create exactly one WorkItem.

### Requirement 16: Smart Capture AI Parsing with Graceful Fallback

**User Story:** As a user, I want Smart Capture to keep working even when the AI service is unavailable, so that I can always capture my items.

#### Acceptance Criteria

1. WHERE an AI parsing service is configured and reachable, THE Smart_Capture SHALL use the AI_Parser to produce structured WorkItem fields.
2. IF the AI_Parser is unavailable, times out, or returns an error, THEN THE Smart_Capture SHALL use the Rule_Based_Parser to produce structured WorkItem fields.
3. IF the AI_Parser returns a response that cannot be parsed into valid WorkItem fields, THEN THE Smart_Capture SHALL use the Rule_Based_Parser to produce structured WorkItem fields.
4. WHEN Smart_Capture falls back to the Rule_Based_Parser, THE Smart_Capture SHALL create the WorkItem without interrupting the capture flow.

### Requirement 17: Smart Capture Privacy

**User Story:** As a user, I want my data to stay on my device, so that using AI parsing does not expose my other saved items.

#### Acceptance Criteria

1. THE WorkPocket SHALL store all WorkItems only in Local_Storage.
2. WHERE the AI_Parser is used, THE Smart_Capture SHALL send only the current freeform capture text to the AI parsing service.
3. THE Smart_Capture SHALL NOT transmit previously stored WorkItems to the AI parsing service.
4. WHERE no AI parsing service is configured, THE Smart_Capture SHALL perform all parsing locally with the Rule_Based_Parser and SHALL make no network request.
