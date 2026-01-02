# Zenith Frontend Technical Documentation

This document provides an in-depth technical deep-dive into the frontend architecture, patterns, and implementations of the Zenith Task Management System.

## 🏗 System Architecture

The application behaves as a **Single Page Application (SPA)**.
*   **Initial Load**: The browser fetches `index.html` and the bundled JavaScript/CSS.
*   **Routing**: Handled client-side by `React Router`. Navigation does not trigger a page reload.
*   **Data Fetching**: Data is fetched asynchronously (AJAX) using `Axios` and managed by `TanStack Query`.
*   **Consistency**: `SignalR` pushes state changes from the server to clients to maintain real-time consistency.

---

## 🔐 Authentication & Security

### 1. JWT Implementation
*   **Storage**: The Access Token is stored in `localStorage` (via Zustand persistence).
*   **Transmission**: The token is automatically attached to every outgoing HTTP request header (`Authorization: Bearer <token>`) using an Axios interceptor defined in `src/lib/axios.ts`.
*   **Expiration Handling**: If the backend returns a `401 Unauthorized`:
    *   The interceptor catches the error.
    *   Example logic: It may attempt a refresh (if implemented) or force a logout by clearing the store and redirecting to `/login`.

### 2. Route Protection
We use a `ProtectedRoute` wrapper component (`src/components/ProtectedRoute.tsx`) for private pages.
*   **Logic**: Checks `isAuthenticated` from `authStore`.
*   **Action**: If false, it renders `<Navigate to="/login" />`.
*   **Routes**: All strictly internal pages (Dashboard, Projects, Tasks) are wrapped.

---

## 📡 Networking Layer

### API Services (`src/services/`)
We strictly separate API calls from UI components. Each domain has a dedicated service file.

| Service File | Domain | Key Responsibilities |
| :--- | :--- | :--- |
| `authService.ts` | Authentication | Login, Register, Verify Email, Password Reset. |
| `projectService.ts` | Projects | Create/Edit Projects, Manage Members, Get Project Lists. |
| `taskService.ts` | Tasks | CRUD ops, Status Updates (DnD), Priority changes. |
| `commentService.ts` | Comments | Add/Edit/Delete comments on tasks. |
| `signalRService.ts` | Real-time | Manage WebSocket connection, Subscription logic. |
| `attachmentService.ts` | Files | Handle file uploads and downloads. |

### Real-Time Updates (SignalR)
Located in `src/services/signalRService.ts`.
*   **Hub Connection**: Connects to `/hubs/notifications`.
*   **Listeners**:
    *   `ReceiveProjectUpdate`: Triggers refetch of Project lists.
    *   `ReceiveTaskUpdate`: Refetches specific Task details.
    *   `ReceiveComment`: Appends new comments to the view.
    *   `ReceiveNotification`: Shows a toast notification to the user.

---

## 📦 State Management Strategy

We use a hybrid approach to state management:

### 1. Server State (TanStack Query)
Used for all asynchronous data (Projects, Tasks, Profile).
*   **Why?**: Automates caching, background refetching, and deduping requests.
*   **Pattern**: Custom hooks (e.g., `useProjects`, `useTaskDetails`) wrap the `useQuery` calls.
*   **Keys**: We use array-based keys for granular invalidation, e.g., `['tasks', { projectId: 1 }]`.

### 2. Client State (Zustand)
Used for synchronous, global app state.
*   **`useAuthStore`**: Stores `user` profile, `token`, and `isAuthenticated` boolean. Persisted to `localStorage`.
*   **UI State**: Useful for toggling global modals, sidebar states, or current theme preferences.

---

## 🧩 Key Component Modules

### Task Board (Kanban)
*   **Libraries**: `@dnd-kit/core`, `@dnd-kit/sortable`.
*   **Logic**:
    1.  `KanbanPage` sets up `DndContext`.
    2.  Columns are `SortableContext` containers.
    3.  Tasks are `SortableItem`s.
    4.  **OnDragEnd**: We calculate the new position, optimistically update the UI state, and fire `taskService.updateStatus()`.

### Forms
*   **Libraries**: `react-hook-form`, `zod`.
*   **Pattern**:
    1.  Define Zod schema: `const schema = z.object({ ... })`.
    2.  Infer TS type: `type FormValues = z.infer<typeof schema>`.
    3.  Init hook: `useForm<FormValues>({ resolver: zodResolver(schema) })`.
    4.  This ensures type-safe inputs and automatic error handling.

### Modals & Overlays
*   **Library**: `headlessui/react` (Dialog, Transition).
*   **Component**: `TaskModal` is a complex controlled component. It fetches task details on mount (if editing) and handles multiple sub-forms (Checklists, Initial Comments).

---

## 📂 Router Map

Defined in `src/App.tsx`.

### Public Routes
*   `/` : Landing Page
*   `/login` : Sign In
*   `/register` : Sign Up
*   `/verify-email` : Email Validation
*   `/shared/:token` : Read-only view for shared tasks/projects.

### Protected Routes (Requires Login)
*   `/dashboard` : Main User Dashboard
*   `/projects` : List of Projects
*   `/projects/:id` : Project Layout (Tasks, Kanban, Calendar)
*   `/tasks` : My Tasks Aggregation
*   `/calendar` : Global Calendar View
*   `/profile` : User Settings

---

## 🚀 Build & Deployment

### Build Pipeline
1.  **Build Command**: `npm run build`
2.  **Process**:
    *   `tsc` checks for type errors.
    *   `vite build` bundles assets.
    *   Optimizes images and minifies CSS/JS.
3.  **Artifact**: `dist/` folder.

### Deployment (e.g., Netlify, Vercel, IIS)
*   serve the `dist` folder as static files.
*   **Important**: Configure the web server for SPA fallback. All 404s must seek `index.html` associated with the React Router.

---

## 🧪 Testing (Future Roadmap)
*   **Unit**: Vitest + React Testing Library for components.
*   **E2E**: Cypress or Playwright for full user flows (Login -> Create Project -> Drag Task).
