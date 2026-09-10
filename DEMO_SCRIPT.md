# WorkPocket - Demo Video Script (2-4 minutes)

Target length: ~3 minutes. Record screen + voiceover. Have the live Vercel URL and
Kiro open in two tabs before you start.

---

## 0:00 - 0:25  Hook + Problem (talk over the live app loading)
"Students and developers capture information faster than they can organize it -
a GitHub issue, a docs link, a code snippet, an assignment deadline. It ends up
scattered across bookmarks, notes apps, and to-do lists. This is WorkPocket:
one searchable inbox for all of it."

- Show the deployed dashboard already populated with sample items (all 5 types).
- Point out the sidebar (Today, Inbox, Tasks, Notes, Links, Code) and the metric cards.

## 0:25 - 0:45  The unified inbox
"Everything is one unified item type, so one search covers all of it."
- Type "supabase" in the search bar - show results spanning a link, a note, a task.
- Click into Tasks and Code views to show the per-type pages and the notebook UI.

## 0:45 - 1:45  THE STAR: Smart Capture (AI)  <-- spend the most time here
"Here's the AI core. Instead of filling a form, I just dump text."
- Hit Capture, stay in Smart mode.
- Paste this exact line:
  "Finish OS assignment before Monday urgent and check
   https://github.com/torvalds/linux and npm install express"
- Click Parse. Show the review step:
  "The AI split one messy sentence into three structured items - a high-priority
   Task due Monday, a Link, and a Code snippet - each with a title and tags."
- Tweak a priority in the review to show it's editable, then Save.
- Show the three new items appear instantly at the top of the inbox.
- Mention resilience: "If the AI is ever unavailable, it falls back to local parsing,
  so capture never breaks. And only the text I type is sent - my other items stay local."

## 1:45 - 2:45  Kiro spec-driven walkthrough  <-- REQUIRED by the rubric
"I built this with Kiro's spec-driven workflow. Here are the specs in .kiro/specs."
- Open requirements.md: scroll to a Smart Capture requirement.
  "I wrote the AI behavior as testable acceptance criteria first - including that it
   must fall back gracefully and only send the capture text. That kept the AI a real
   feature, not decoration."
- Open design.md: show the architecture / the SmartCaptureService + fallback and the
  correctness properties.
  "The design derived a service that orchestrates the LLM with a rule-based fallback,
   and 24 properties that map back to the requirements."
- Open tasks.md: show the checklist + dependency graph.
  "That became a dependency-ordered task list, separating verifying the MVP from
   building the AI feature - exactly how I implemented it."

## 2:45 - 3:00  Close
"WorkPocket - a universal work inbox for students and developers, with AI that
organizes what you capture. It's live, it's tested end to end, and it was built
spec-first with Kiro. Thanks for watching."

---

## Recording tips
- Clear localStorage once before recording if you want a clean start, or keep the
  sample data so the app looks alive immediately (recommended).
- Do a dry run of the Smart Capture paste so the AI response timing feels smooth.
- Keep the requirements/tasks walkthrough brief but visible - judges specifically
  want to see these two files in Kiro.
