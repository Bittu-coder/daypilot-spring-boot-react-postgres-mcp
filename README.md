# DayPilot — React + Spring Boot + PostgreSQL + MCP

DayPilot is a hackathon starter for a personal productivity assistant. It provides a React UI, a Spring Boot REST API, PostgreSQL persistence, and MCP tools for compatible AI clients.

## Stack
- React + Vite
- Java 21, Spring Boot 3.4.5, Maven
- Spring Data JPA + PostgreSQL
- Spring AI MCP server WebMVC starter (MCP tools over Streamable HTTP)

## Prerequisites
- JDK 21+
- Maven 3.9+
- Node.js 20+
- Docker Desktop (optional, easiest way to run PostgreSQL)

## Run with Docker for PostgreSQL
From the project root:
```bash
docker compose up -d postgres
```

Then start the backend:
```bash
cd server
mvn spring-boot:run
```

Start the frontend in a second terminal:
```bash
cd web
npm install
npm run dev
```
Open http://localhost:5173. Backend health: http://localhost:8080/api/health

## Run everything with Docker
```bash
docker compose up --build
```
Frontend: http://localhost:5173
Backend: http://localhost:8080
PostgreSQL: localhost:5432

## REST API
- `GET /api/health`
- `GET /api/tasks`
- `POST /api/tasks` body: `{"title":"Prepare project demo","description":"Check the flow","priority":"HIGH"}`
- `POST /api/tasks/{id}/complete`
- `POST /api/plans` body: `{"goal":"Prepare for tomorrow's meeting"}`

## MCP tools
The backend declares MCP tools for:
- `list_tasks`
- `create_prep_plan`
- `complete_task`

The MCP server uses the Spring AI MCP WebMVC starter. Confirm the exact endpoint and protocol compatibility with your MCP client and the hackathon's current rules before submitting. The default Streamable HTTP endpoint for the starter is typically `/mcp`; verify against the dependency version and runtime logs.

## Important
This is a starter project, not a claim of verified official Alexa+ integration. Test the backend, frontend, database persistence, and MCP connection locally. Do not claim a feature in your submission unless you have run and demonstrated it. The planning feature currently generates a practical checklist from a goal; it does not call an external LLM or calendar.
