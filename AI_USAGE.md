# AI Usage Disclosure — FocusBoard

This document transparently outlines the use of AI assistance during the development of the **FocusBoard** task management dashboard, adhering to the Trainee Assessment evaluation guidelines.

---

## 1. AI Tool Used

- **AI Assistant**: Google Antigravity (Powered by Gemini 3.8 Flash High)
- **Role**: Senior Frontend Developer Assistant

---

## 2. Representative Prompts Used

The following representative prompts were used during the design analysis, architectural planning, and implementation phases:

### Prompt 1: Design Extraction & Figma System Mapping
> *"Inspect the FocusBoard assignment PDF and the official Figma canvas thumbnail for frames 1:2 (Desktop Dashboard 1440x1000), 1:167 (Mobile Dashboard 390x1128), 1:279 (Create Task Form 760x822), and 15:2–15:58 (Focus Notes slides). Extract exact colors (primary purple #6259F7, active bg #ECECFC, background #F8F9FD), component hierarchy, badge styles, and exact copy for the 3 focus slides."*

### Prompt 2: Clean JavaScript Architecture & React Hooks
> *"Refactor the architecture to strict JavaScript (ES6+ with .jsx and .js, removing any TypeScript files per assessment guidelines). Implement a custom `useLocalStorage` hook that maintains a single source of truth, performs immutable CRUD mutations, safely handles JSON serialization errors, and guarantees that user data is never overwritten by sample data on page reload."*

### Prompt 3: Dynamic Statistics & Compound Filtering Pipeline
> *"Implement derived overview statistics for Total Tasks, In Progress, Completed, and Completion Percentage. Ensure these are dynamically computed from live task state and never hardcoded. Build a combined search and filtering pipeline where case-insensitive title search, status tabs (All, To do, In progress, Completed), and priority dropdowns (All, Low, Medium, High) work concurrently via useMemo."*

### Prompt 4: Responsive Verification & Modal Ergonomics
> *"Ensure pixel-level responsiveness across 1440px desktop, 768px tablet, and 390px mobile viewports. Implement an accessible Create/Edit task modal (760px on desktop, full-width on mobile) with inline title validation, keyboard escape dismissal, and an accessible confirmation modal for task deletion."*

---

## 3. Areas Where AI Assistance Was Used

1. **Figma Visual Asset Inspection**: Cropping and analyzing the official Figma canvas thumbnail to accurately transcribe the exact copy of the three Focus Notes slides (*"Make today count"*, *"Small steps, big progress"*, *"Celebrate the wins"*) and brand color hex values (`#6259F7`).
2. **Component Architecture Planning**: Structuring the application into modular, single-responsibility components (`Header`, `Sidebar`, `StatsCards`, `FocusNotes`, `Filters`, `TaskList`, `TaskCard`, `TaskForm`, `DeleteConfirmModal`).
3. **Compound Filter Logic**: Writing pure `useMemo` filter functions that evaluate search query, status tabs, and priority filters concurrently without state synchronization bugs.
4. **Tailwind Design System Tokens**: Configuring `tailwind.config.js` to match the exact brand color palette and shadows from Figma.
5. **Accessibility Attributes**: Adding proper ARIA roles (`role="dialog"`, `role="alertdialog"`, `role="tablist"`), focus trap ergonomics, and keyboard listeners (`Escape`, `ArrowLeft`, `ArrowRight`).

---

## 4. Checked, Corrected, and Rejected Suggestions

### Suggestion 1: TypeScript vs. Pure JavaScript (Rejected)
- **Initial AI Suggestion**: Initially, standard boilerplate configurations default to TypeScript (`.tsx` and `.ts`) with strict type interfaces.
- **Human Verification / Review**: The candidate assignment requirements explicitly stipulate: `"JavaScript (not TypeScript)"`.
- **Action Taken**: The suggestion to use TypeScript was **rejected**. The entire codebase was built with pure JavaScript (`.jsx` and `.js`), and all `.ts` files, `tsconfig.json`, and TypeScript dependencies were removed.

### Suggestion 2: LocalStorage Empty List Overwrite Bug (Corrected)
- **Initial AI Suggestion**: A basic `localStorage` hook checked `if (!savedTasks || savedTasks.length === 0)` and re-seeded `SAMPLE_TASKS`.
- **Human Verification / Review**: If a user intentionally deletes all tasks from their board, refreshing the page would cause the app to re-seed sample tasks, violating requirement 10: *"Never overwrite existing saved data with sample data on refresh."*
- **Action Taken**: Corrected the logic by introducing an explicit `focusboard_initialized_v1` flag. On reload, if the storage has already been initialized, the empty array `[]` is preserved and sample tasks are not re-seeded.

### Suggestion 3: Hardcoded Figma Metric Values (Checked & Corrected)
- **Initial AI Suggestion**: The Figma design displayed static numbers (12 Total, 5 In Progress, 7 Completed).
- **Human Verification / Review**: The assignment strictly required: *"Calculate all statistics dynamically from the actual task data. Do not hardcode the numbers displayed in the Figma design."*
- **Action Taken**: Verified and implemented dynamic calculation directly derived from the live `tasks` array using `useMemo`. When any task is added, edited, deleted, or status-toggled, all 4 metric cards update immediately.
