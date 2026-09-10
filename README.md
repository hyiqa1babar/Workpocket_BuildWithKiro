# WorkPocket

> A lightweight personal work command center for busy students and developers.

**Live demo:** https://workpocketbuildwithkiro.vercel.app/

WorkPocket unifies tasks, quick notes, bookmarks, code snippets, and files into a single streamlined command center with zero backend overhead.

## AI Smart Capture

Dump raw text into the capture box and WorkPocket structures it automatically - detecting the item type (task / note / link / code / file), extracting a title, due date, priority and tags, and splitting a compound dump into multiple items. It uses a Groq-hosted LLM, with a local rule-based parser as a graceful fallback when the AI is unavailable. Only the text you type is sent to the model; your stored items stay in your browser.

Set `VITE_GEMINI_API_KEY` or `VITE_GROQ_API_KEY` to enable AI parsing (see `.env.example`). Without a key, capture still works via local rule-based parsing.

## Built with Kiro (spec-driven)

Specs live in `.kiro/specs/workpocket/`: `requirements.md` (user stories + EARS acceptance criteria), `design.md` (architecture, `SmartCaptureService` + fallback, 24 correctness properties), and `tasks.md` (dependency-ordered implementation checklist). Run tests with `npm test`.

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
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ capture/          # CaptureModal, CaptureInput, CaptureTypeSelector
â”‚   â”‚   â”œâ”€â”€ items/            # WorkItemCard, WorkItemList, WorkItemTypeIcon
â”‚   â”‚   â”œâ”€â”€ layout/           # AppLayout, Sidebar, Header
â”‚   â”‚   â””â”€â”€ ui/               # Button, Input, Modal, EmptyState
â”‚   â”œâ”€â”€ data/                 # sampleData.ts (initial state seed)
â”‚   â”œâ”€â”€ hooks/                # useWorkItems.ts, useKeyboardShortcut.ts
â”‚   â”œâ”€â”€ pages/                # Dashboard, Inbox, Tasks, Notes, Links, CodeSnippets
â”‚   â”œâ”€â”€ services/             # storage.ts (localStorage persistence layer)
â”‚   â”œâ”€â”€ types/                # workItem.ts
â”‚   â”œâ”€â”€ utils/                # categorization.ts, dateUtils.ts
â”‚   â”œâ”€â”€ App.tsx               # View routing and command orchestration
â”‚   â”œâ”€â”€ main.tsx
â”‚   â””â”€â”€ index.css             # Tailwind and design system tokens
â”œâ”€â”€ index.html
â”œâ”€â”€ package.json
â”œâ”€â”€ tsconfig.json
â”œâ”€â”€ tailwind.config.ts
â””â”€â”€ vite.config.ts
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

- <kbd>C</kbd> â€” Open Quick Capture Modal
- <kbd>/</kbd> or <kbd>Ctrl</kbd> + <kbd>K</kbd> â€” Focus universal search
- <kbd>Esc</kbd> â€” Dismiss open modal

---

## Roadmap & Extensibility

- [ ] Browser extension capture bridge
- [ ] Clipboard auto-detect listener
- [ ] Natural language date parser
- [ ] Local SQLite / OPFS sync backend
