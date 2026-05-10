# queue-ticket-api

Basic REST API setup for the queue ticket system, built with .NET 10 and SQL Server.

## What is included

- SQL Server connection setup
- EF Core `QueueTicketDbContext`
- Basic queue tables: `QueueTickets` and `QueueCounters`
- Local CORS setup for Angular
- Health check endpoint for testing API and database connection
- Controller, service, repository structure
- Standard API response format

## Run locally

From the API project:

```bash
cd queue-ticket-api
docker compose up -d
```

Then run the API:

```bash
dotnet run --launch-profile local
```

The API runs at:

```text
http://localhost:5001
```

Swagger UI:

```text
http://localhost:5001/swagger
```

Quick checks:

```bash
curl http://localhost:5001/api/health
```

## API structure

The code is split into simple layers:

```text
Controllers  -> receive HTTP requests and return API responses
Services     -> keep business logic, such as issuing the next queue number
Repositories -> read and write database records
Models       -> database table shape
Dtos         -> data shape returned to the frontend
Responses    -> standard response wrapper
```

Important domain rules:

```text
Queue range: A0 -> Z9
Reset display: 00
Next ticket after reset: A0
Active ticket status: Active
Reset/no-active-ticket status: Reset
```

Concurrency handling:

```text
QueueCounter has one row only: Id = 1
QueueCounter.RowVersion is used for EF Core optimistic concurrency
Create/reset queue retries up to 3 times when another API instance updates the counter first
```

Standard response shape:

```json
{
  "status": 200,
  "message": "success",
  "data": {}
}
```

Current endpoints:

| Method | URL | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check API and database connection |
| `GET` | `/api/queue-tickets/current` | Get current queue ticket |
| `POST` | `/api/queue-tickets` | Create next queue ticket |
| `POST` | `/api/queue-tickets/reset` | Reset queue display to `00`; the next active ticket starts at `A0` |

Example response:

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "id": "e46c58f5-1d67-4395-abd5-4ddfed7bdc1d",
    "queueIndex": 2,
    "queueNumber": "A2",
    "status": "Active",
    "createdAt": "2026-05-10T08:51:24.058887+00:00"
  }
}
```

## Database

SQL Server runs in Docker on port `1433`.

Connection string:

```text
Server=localhost,1433;Database=QueueTicketDb;User Id=sa;Password=QueueTicket_dev#2026;TrustServerCertificate=True;Encrypt=True;Connection Timeout=3
```

In development, the API creates the database and basic tables automatically when SQL Server is available.

## Environments

This project has 3 environments.

| Environment | API command | Config file | Use case |
| --- | --- | --- | --- |
| `local` | `dotnet run --launch-profile local` | `appsettings.Local.json` | Run on your machine with Docker SQL Server |
| `development` | `dotnet run --launch-profile development` | `appsettings.Development.json` | Shared/dev setup before production |
| `production` | `dotnet run --launch-profile production` | `appsettings.Production.json` | Real deployment |

Production should not keep the real database password in code. Set it with an environment variable when deploying:

```bash
ConnectionStrings__DefaultConnection="Server=YOUR_SERVER;Database=QueueTicketDb;User Id=YOUR_USER;Password=YOUR_PASSWORD;TrustServerCertificate=True;Encrypt=True"
```
