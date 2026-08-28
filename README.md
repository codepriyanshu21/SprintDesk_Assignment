# SprintDesk

SprintDesk is a responsive sprint management dashboard for software teams.

## Included

- DummyJSON login flow with protected routes, in-memory access token, refresh token persistence, and silent refresh.
- Responsive dashboard overview with sprint progress and upcoming work.
- Four-column Kanban board with drag-and-drop reordering, filtering, task creation, editing, comments, and deletion.
- Analytics page with responsive Recharts visualizations derived from live board state.
- Polling-based notification center using JSONPlaceholder, persisted read states, unread count, and tab visibility handling.
- Reusable accessible UI primitives for buttons, form fields, selects, modal dialogs, avatars, toasts, and loading states.
- Light and dark themes.
- Route-level code splitting with React.lazy and Suspense.
- Zustand for application state and TanStack Query-ready service boundaries.

## Demo login

Use `emilys` / `emilyspass` from DummyJSON.

## Commands

- `npm run dev` starts the Vite development server.
- `npm run build` creates a production build.
- `npm run typecheck` validates TypeScript.
- `npm run test` runs the Vitest suite.

## Notes

The assignment specifies mock-data.json as the primary application data source, so the board and session simulation intentionally use local persistence. The service layer keeps UI code independent from the source and can be switched to a production API later. A production deployment would add server-side persistence and would replace the simulated refresh token storage with an httpOnly cookie.
