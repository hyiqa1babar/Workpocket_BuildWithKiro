# WorkPocket

> A lightweight personal work command center for busy students and developers.

WorkPocket unifies tasks, quick notes, bookmarks, code snippets, and files into a single streamlined command center with zero backend overhead.

---

## Unified Core Architecture

Everything in WorkPocket revolves around a unified **`WorkItem`**:

```typescript
interface WorkItem {
  id: string;
  title: string;
  content: string;
  type: 'task' | 'note' | 'link' | 'code' | 'file';
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags: string[];
  metadata?: WorkItemMetadata;
}
```

Instead of fragmented siloed tables for bookmarks, snippets, and tasks, a single data contract powers:
- **Instant capture** across all formats
- **Universal search** across titles, syntax snippets, URLs, and tags
- **Intelligent categorization** based on text patterns and keywords
- **Easy schema extension** for future sync engines or desktop wrappers

---

## Project Structure

```
workpocket/
├── src/
│   ├── components/
│   │   ├── capture/          # CaptureModal, CaptureInput, CaptureTypeSelector
│   │   ├── items/            # WorkItemCard, WorkItemList, WorkItemTypeIcon
│   │   ├── layout/           # AppLayout, Sidebar, Header
│   │   └── ui/               # Button, Input, Modal, EmptyState
│   ├── data/                 # sampleData.ts (initial state seed)
│   ├── hooks/                # useWorkItems.ts, useKeyboardShortcut.ts
│   ├── pages/                # Dashboard, Inbox, Tasks, Notes, Links, CodeSnippets
│   ├── services/             # storage.ts (localStorage persistence layer)
│   ├── types/                # workItem.ts
│   ├── utils/                # categorization.ts, dateUtils.ts
│   ├── App.tsx               # View routing and command orchestration
│   ├── main.tsx
│   └── index.css             # Tailwind and design system tokens
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `pnpm` / `yarn`

### Installation & Run

1. Navigate to the project directory:
   ```bash
   cd workpocket
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## Keyboard Shortcuts

- <kbd>C</kbd> — Open Quick Capture Modal
- <kbd>/</kbd> or <kbd>Ctrl</kbd> + <kbd>K</kbd> — Focus universal search
- <kbd>Esc</kbd> — Dismiss open modal

---

## Roadmap & Extensibility

- [ ] Browser extension capture bridge
- [ ] Clipboard auto-detect listener
- [ ] Natural language date parser
- [ ] Local SQLite / OPFS sync backend
