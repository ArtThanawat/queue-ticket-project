# Queue Ticket Web

Angular frontend for the queue ticket system.

## Stack

- Angular `20.3.x`
- PrimeNG `20.x`
- Tailwind CSS `4.x`
- TypeScript `~5.9`
- Noto Sans Thai

## Requirements

Recommended:

```bash
node >=20.19.0
npm >=10
```

Install dependencies:

```bash
npm install
```

## Run

Run against the local API at `http://localhost:5001/api`:

```bash
npm run start:local
```

Run with the default development environment:

```bash
npm start
```

The default `src/environments/environment.ts` points to `environment.development.ts`.

## Build And Test

```bash
npm run build
npm run build:local
npm run build:dev
npm run build:prod
npm test
```

## Environment

Environment files:

```text
src/environments/environment.ts
src/environments/environment.local.ts
src/environments/environment.development.ts
src/environments/environment.production.ts
```

Current API URLs:

| Environment | API URL |
| --- | --- |
| `local` | `http://localhost:5001/api` |
| `development` | `https://api.example.development.com/api` |
| `production` | `https://api.example.production.com/api` |

App metadata is configured per environment:

| Environment | App Name | App Version | Build Version |
| --- | --- | --- | --- |
| `local` | `ระบบบัตรคิว` | `1.0.0` | `2026061001` |
| `development` | `ระบบบัตรคิว` | `1.0.0` | `2026061001` |
| `production` | `ระบบบัตรคิว` | `1.0.0` | `2026061001` |

Use `npm run start:local` while running the backend locally.

The local backend must allow CORS from:

```text
http://localhost:4200
```

## App Structure

```text
src/app/
  app.config.ts
  app.html
  app.routes.ts
  app.scss
  core/
    interceptors/
    services/
  features/
    queue/
      queue.routes.ts
      queue-frame/
      reset-queue/
      ticket-display/
      ticket-reception/
  models/
  services/
  shared/
    components/
      app-layout/
      app-toast/
      confirm-dialog/
    directives/
    pipes/
    services/
  utils/
```

Structure guidelines:

- `features/` contains business screens and feature routes.
- `services/` contains app-level API services for backend calls.
- `models/` contains shared API and domain models.
- `core/` contains app-wide infrastructure such as HTTP interceptors, config, storage, and error handling.
- `shared/` contains reusable UI components, directives, pipes, and UI-facing services.
- `utils/` contains pure helper functions.

The root app uses `shared/components/app-layout/` as the page shell. The layout currently provides only a footer and displays the system name, app version, build version, and non-production environment name from `AppConfigService`.

## Routes

Main routes:

| Path | Screen |
| --- | --- |
| `/queue/receive` | Receive a queue ticket |
| `/queue/display` | Display the current ticket |
| `/queue/reset` | Reset queue |

The queue feature is lazy loaded from:

```text
src/app/features/queue/queue.routes.ts
```

## API Flow

Components do not call Angular `HttpClient` directly.

Current flow:

```text
Feature component
  -> QueueTicketApiService
  -> HttpClientService
  -> Angular HttpClient
  -> Interceptors
  -> Queue Ticket API
```

Queue API service:

```text
src/app/services/queue-ticket-api.service.ts
```

Endpoints used by the frontend:

| Page | Method | URL |
| --- | --- | --- |
| Ticket reception | `POST` | `/api/queue-tickets` |
| Ticket display | `GET` | `/api/queue-tickets/current` |
| Reset queue | `POST` | `/api/queue-tickets/reset` |

## HTTP Interceptors

Interceptors are registered in this order:

```text
tokenInterceptor
errorInterceptor
```

### Token Interceptor

File:

```text
src/app/core/interceptors/token.interceptor.ts
```

Behavior:

- Reads access token from `SessionStorageService`.
- Adds `Authorization: Bearer <token>` when a token exists.
- Skips token injection when the request has `Anonymous: true`.
- Removes the internal `Anonymous` header before sending the request.

Anonymous API calls are made like this:

```ts
this.httpClient.post<ApiResponse<QueueTicket>>(url, {}, true);
```

### Error Interceptor

File:

```text
src/app/core/interceptors/error.interceptor.ts
```

Behavior:

- Retries failed HTTP requests twice.
- Clears session storage on `401`.
- Redirects `401` responses to `/login`.

The current app does not yet define a `/login` route. If authentication is added later, add the route or adjust this redirect behavior.

## Error Toasts

Feature components pass HTTP errors to:

```text
src/app/core/services/http-error-handler.service.ts
```

That service maps common HTTP statuses to Thai error messages and shows them through:

```text
src/app/shared/services/toast.service.ts
src/app/shared/components/app-toast/
```

## Notes For New Code

- Keep feature-specific code under `features/<feature-name>/`.
- Keep backend calls inside API services under `src/app/services/`.
- Keep reusable UI pieces under `shared/`.
- Prefer path aliases such as `@core/*`, `@shared/*`, `@features/*`, and `@app/*`.
- Add a store/state service only when multiple screens need coordinated client-side state.
