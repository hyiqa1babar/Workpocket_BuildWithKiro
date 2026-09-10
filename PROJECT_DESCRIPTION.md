# WorkPocket - Project Description

**Live demo:** https://workpocketbuildwithkiro.vercel.app/
**Repository:** https://github.com/hyiqa1babar/Workpocket_BuildWithKiro

---

## The Problem

Students and developers hit the same wall every day: information arrives faster than
we can organize it. A GitHub issue to fix, a docs link to read later, a code snippet
to reuse, an assignment deadline, a note you must not forget. Right now that stuff
gets scattered across browser bookmarks, a notes app, a to-do list, and "message
yourself" chats. Nothing lives in one place, so things slip through the cracks.

## The Solution

WorkPocket is a single, searchable inbox for everything you capture during the day.
Every entry - a task, note, link, code snippet, or file - is stored as one unified
`WorkItem`, so a single search box, one dashboard, and one set of views cover all of
it. No backend, no login: your data persists locally in the browser.

The AI core is **Smart Capture**. Instead of manually filling in a form, you dump
raw text and WorkPocket structures it for you. Paste "Finish OS assignment before
Monday urgent and check https://github.com/torvalds/linux and npm install express"
and it splits that into three items: a high-priority Task with a Monday due date, a
Link, and a Code snippet - each with an auto-extracted title and tags. It uses a
Groq-hosted LLM for parsing, and gracefully falls back to a local rule-based parser
when the AI is unavailable, so capture never breaks. Only the text you type is ever
sent to the model; your stored items stay on your device.

## How Kiro's Spec-Driven Process Shaped It

I built WorkPocket through Kiro's structured workflow, and the specs in `.kiro/specs/`
show that history rather than being written after the fact.

- **requirements.md** - I first wrote user stories and EARS-style acceptance criteria
  covering the capture inbox, search, dashboard, persistence, and every Smart Capture
  behavior (type detection, field extraction, compound splitting, AI fallback, and
  privacy). Defining "AI must fall back gracefully" and "only capture text is sent"
  as testable criteria up front kept the AI honest instead of decorative.
- **design.md** - From those requirements I derived the architecture: the unified
  data model, a `SmartCaptureService` that orchestrates the LLM client with a
  rule-based fallback, and 24 correctness properties mapping directly back to
  requirements. Deciding the provider abstraction here meant swapping Gemini for Groq
  later was a small, contained change.
- **tasks.md** - The design became a dependency-ordered checklist separating
  "verify the existing MVP" from "build Smart Capture," which is exactly how I
  executed it.

The payoff: 24 automated tests (property-based + unit) trace back to the spec, the
build is clean, and the live compound-split works end to end. The spec wasn't
paperwork - it was the plan that made the AI feature correct and the implementation
verifiable.

## Tech Stack

React, TypeScript, Vite, Tailwind CSS, Groq LLM (with local rule-based fallback),
browser localStorage, deployed on Vercel.
