# FocusBoard — Responsive Task Management Dashboard

> **Frontend Developer Trainee Assessment Submission**  
> A high-fidelity, fully responsive single-user task dashboard built strictly with **React.js, Vite, and JavaScript (ES6+)**, styled to match the official **FocusBoard Figma Design System**.

---

## 📌 Project Overview

**FocusBoard** is a modern task management dashboard designed for focused productivity. It implements full task lifecycle management (CRUD), interactive status progression, multi-criteria filtering, derived real-time statistics, a 3-slide cognitive focus carousel, and safe browser `localStorage` persistence with a zero-overwrite guarantee.

Every visual element and layout adheres directly to the official Figma reference:
- **Desktop Dashboard**: `1440 × 1000` (Figma frame `1:2`)
- **Mobile Dashboard**: `390 × 1128` (Figma frame `1:167`)
- **Create Task Modal**: `760 × 822` (Figma frame `1:279`)
- **Focus Notes Carousel**: `1106 × 152` (Figma frames `15:2`, `15:30`, `15:58`)

---

## 🚀 Live Demo & Links

- **Live Hosted Application**: [https://focusboard-dashboard.vercel.app](https://focusboard-dashboard.vercel.app) *(Placeholder)*
- **GitHub Repository**: [https://github.com/ambalapreethi/focusboard](https://github.com/ambalapreethi/focusboard) *(Placeholder)*

---

## 🛠️ Technology Stack

- **Framework**: React 19 (Functional Components & React Hooks)
- **Bundler & Dev Server**: Vite 6
- **Language**: Pure JavaScript (`.jsx` / `.js`) — *No TypeScript per assessment guidelines*
- **Markup & Styling**: HTML5, CSS3, Tailwind CSS with customized Figma brand tokens
- **Icons**: Lucide React
- **Persistence**: Safe Browser `localStorage` API (Zero-overwrite architecture)
- **Backend**: None (pure client-side architecture as required)

---

## ✨ Key Features & Functionality

### 1. Dynamic Overview Statistics (Derived State)
- **Total Tasks**: Dynamic count of all user initiatives.
- **In Progress**: Count of active tasks currently being worked on.
- **Completed**: Count of finished initiatives.
- **Completion Rate**: Live animated percentage calculation (`(completed / total) * 100`).
- *Strict Assessment Rule*: Statistics are **never hardcoded**; they re-calculate in real time whenever tasks are created, modified, deleted, or transitioned.

### 2. Focus Notes Carousel (Official Figma Reproduction)
Reproduces the 3 official Figma slides with visual fidelity and interaction:
- **Slide 1 (Figma 15:2)**: *"Make today count."* / *"A little focus goes a long way."* (Focus preview: Design landing page, 65%)
- **Slide 2 (Figma 15:30)**: *"Small steps, big progress."* / *"Build your momentum one task at a time."* (In Progress preview: Fix mobile navigation, 45%)
- **Slide 3 (Figma 15:58)**: *"Celebrate the wins."* / *"Every completed task moves you forward."* (Completed preview: Review onboarding copy, 100%)
- **Controls**: Previous `<` and Next `>` circular navigation buttons, keyboard arrow navigation, and 3 active pill indicators that show active position and allow direct slide jumping.

### 3. Complete Task CRUD Workflows
- **Create Task**: Accessible modal dialog (`760 × 822`) with Title (mandatory), Description, Category, Status, Priority, and Due Date. Validates required title and generates unique task IDs.
- **Edit Task**: Prefills existing task attributes into the modal for seamless updating.
- **Delete Task with Confirmation**: Safety dialog (`role="alertdialog"`) to verify deletion before executing destructive actions.
- **Direct Status Cycle**: Single click on any task's status icon quickly transitions it across `To do` ➔ `In progress` ➔ `Completed` ➔ `To do`.

### 4. Combined Search & Multi-Criteria Filtering
- **Case-Insensitive Search**: Live substring search against task title and description.
- **Status Tabs**: Fast switching across `All`, `To do`, `In progress`, and `Completed` with dynamic counts.
- **Priority Filter**: Dropdown filtering by `All`, `High`, `Medium`, or `Low`.
- **Compound AND Filter**: Search, status tabs, and priority filters function concurrently (e.g. searching "React" + selecting "In progress" + selecting "High" displays only tasks matching all 3 conditions).
- **Empty State**: Clear, friendly empty state with a "Clear filters" or "Create new task" shortcut.

### 5. Dual View Modes
- **List View**: Table-like row layout matching desktop Figma frame `1:2`.
- **Grid View**: Responsive card layout matching tablet and mobile Figma frame `1:167`.

---

## 🧠 State Management Architecture

State is managed cleanly using standard **React Hooks** (`useState`, `useEffect`, `useMemo`, `useRef`) combined with custom hook abstraction (`useLocalStorage`):

1. **Single Source of Truth**: The task collection resides in `useLocalStorage` and is passed down unidirectionally.
2. **Immutable Updates**: All task modifications (add, edit, delete, status toggle) produce new array and object references; React state is never mutated directly.
3. **Derived Values**: Statistics and filtered tasks are computed on-the-fly using `useMemo`, eliminating redundant state synchronization bugs.
4. **Clean Component Architecture**: Components are strictly modular and reusable (`Sidebar`, `Header`, `StatsCards`, `FocusNotes`, `Filters`, `SearchBar`, `TaskList`, `TaskCard`, `TaskForm`, `DeleteConfirmModal`, `Toast`).

---

## 💾 LocalStorage Persistence Implementation

The application uses an initialization flag and safety protocol:
- **Storage Keys**: `focusboard_tasks_v1` and `focusboard_initialized_v1`.
- **Safe Initialization**: On the very first run, `SAMPLE_TASKS` are seeded and the initialized flag is written.
- **Zero-Overwrite Guarantee**: On subsequent reloads, if the initialization flag exists, the application **always** loads the user's stored array — even if the user deliberately deleted all tasks down to an empty list `[]`. Sample data will **never overwrite** saved data on page refresh.
- **Error Resilient**: All reads and writes are wrapped in `try...catch` blocks to guard against private browsing restrictions or quota limits.
- **Reset Option**: A "Reset Sample Data" button in the sidebar allows reviewers to easily restore the original sample dataset at any point.

---

## 📱 Responsive Breakpoints & Design Details

- **Desktop (1440px)**:
  - Sticky 256px sidebar navigation.
  - Generous padding and max container width of 1240px.
  - 4-card statistics grid.
  - Horizontal list rows with full metadata, priority badges, and quick action buttons.
- **Tablet (768px)**:
  - Reflowed 2x2 statistics grid.
  - Adaptive wrap for filter controls.
  - Flexible carousel card reflow.
- **Mobile (390px)**:
  - Slide-out navigation drawer with top hamburger button.
  - Fixed bottom navigation bar with active indicator.
  - Floating `+` action button for quick task capture.
  - Full-width stacked task cards with touch targets (min 44px).
  - Modal fits full screen width comfortably with zero horizontal overflow.

---

## 📂 Project Structure

```text
focusboard/
├── index.html                   # HTML5 entry with Inter/Plus Jakarta Sans font
├── package.json                 # Project configuration & npm scripts
├── vite.config.js               # Vite React configuration (ES module)
├── tailwind.config.js           # Figma design system tokens & colors
├── postcss.config.js            # PostCSS Autoprefixer config
├── README.md                    # Project documentation
├── AI_USAGE.md                  # AI collaboration disclosure
└── src/
    ├── main.jsx                 # React root mount
    ├── App.jsx                  # Main application orchestrator
    ├── App.css                  # Custom layout styles
    ├── index.css                # Tailwind directives & transitions
    ├── data/
    │   ├── sampleTasks.js       # 7 realistic initial sample tasks
    │   └── focusNotes.js        # 3 official Figma carousel slides
    ├── hooks/
    │   └── useLocalStorage.js   # Safe browser persistence & immutable CRUD
    └── components/
        ├── Sidebar.jsx          # Responsive desktop sidebar & mobile drawer
        ├── Header.jsx           # Top breadcrumb, user avatar, and hero header
        ├── StatsCards.jsx       # 4 dynamically calculated overview cards
        ├── FocusNotes.jsx       # 3-slide Figma carousel with indicators & preview
        ├── SearchBar.jsx        # Live case-insensitive search input
        ├── Filters.jsx          # Status tabs, priority filter, & view toggle
        ├── TaskList.jsx         # Task container & empty state
        ├── TaskCard.jsx         # Row (list) and card (grid) task item
        ├── TaskForm.jsx         # Modal dialog for creating and editing tasks
        ├── DeleteConfirmModal.jsx # Accessible delete confirmation dialog
        └── Toast.jsx            # Action feedback notification
```

---

## 💻 Local Setup & Installation

1. **Clone or Navigate to the project directory**:
   ```bash
   cd focusboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build locally**:
   ```bash
   npm run preview
   ```

---

## ♿ Accessibility (a11y) Practices

- Semantic HTML structure (`<header>`, `<main>`, `<aside>`, `<nav>`, `<section>`).
- ARIA attributes: `role="dialog"`, `role="alertdialog"`, `aria-modal="true"`, `role="tablist"`, `aria-selected`.
- Keyboard support: `Escape` key closes modals, arrow keys navigate the carousel, standard Tab navigation across inputs.
- Clear inline error validation for screen readers.
- Color contrast meets WCAG 2.1 AA standards.

---

## 📝 Known Limitations

- Multi-user authentication is intentionally omitted per assessment scope.
- Cloud database syncing is not implemented (uses client-side browser storage).
- Due date reminders are visual badges without web push notifications.
