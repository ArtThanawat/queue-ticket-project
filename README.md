# Queue Ticket Project

A queue ticket application with Angular, ASP.NET Core API, and SQL Server.

## Requirements

- Docker Desktop
- Git

## Run

1. Clone the repository.

```bash
git clone <repository-url>
cd queue-ticket-project
```

2. Start the application with Docker.

```bash
docker compose up --build
```

3. Open the web app.

```text
http://localhost:8080
```

4. Optional: open Swagger to test the API.

```text
http://localhost:5001/swagger
```

## Verify

Check API and database status:

```text
http://localhost:5001/api/health
```

Expected response:

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "api": "ok",
    "database": "connected"
  }
}
```

## Useful URLs

| Service | URL |
| --- | --- |
| Web | `http://localhost:8080` |
| API Health | `http://localhost:5001/api/health` |
| Swagger | `http://localhost:5001/swagger` |

## Stop

```bash
docker compose down
```

Reset database data:

```bash
docker compose down -v
```

## Configuration

Optional: copy `.env.example` to `.env` to change ports or the SQL Server password.

```bash
cp .env.example .env
```
