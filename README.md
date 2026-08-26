# IDIO — Field Operations App

React Native (Expo Router) app for real estate agency field operations: agents and supervisors managing missions, absences, materials and reporting from the field.

## Features

- **Role-based navigation** — separate tab flows for field agents (`(tabs-agent)`) and supervisors (`(tabs-supervisor)`), same codebase
- **Missions** — supervisor-side mission tracking and assignment
- **Absences** — request, review and track: `add-absence`, `my-absences`, `absences-pending`, `absences-treated`, `absence-detail`
- **Materials/equipment** — `pending-materials` and `processed-materials` workflows for equipment handed to field agents
- **Real-time chat** — in-app messaging (`chat-room`) between agents and supervisors
- **Documents** — field document capture and review
- **Auth** — OTP-based login/verification flow

## Architecture

- **Expo Router** — file-based routing, route groups for auth vs. role-specific tabs
- **TanStack Query + Axios** (`app-services/api.ts`, `queryClient.ts`) — server state, caching, retries
- **Zustand** (`app-states/AuthStore.ts`) — local auth/session state
- **expo-sqlite** — local persistence for offline-first field usage
- **expo-image-picker** — photo capture for field reports

```
app/                 # Expo Router routes (auth, agent tabs, supervisor tabs, feature screens)
app-services/         # API client, auth service, React Query client
app-states/           # Zustand stores
app-contexts/          # React contexts (e.g. font size / accessibility)
components/           # shared UI (buttons, inputs, date picker, tab bar, toast...)
```

## Running locally

```bash
npm install
npx expo start
```

## Stack

React Native · Expo Router · TypeScript · TanStack Query · Zustand · Axios
