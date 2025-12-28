# Backend Muscle Memory Engine (Express + TypeScript)

This backend is the CORE of the platform.
Designed for repetition, speed, and clone-by-hand muscle memory.

See full checklist inside.

# Backend Muscle Memory Engine (Express + TypeScript)

> Purpose:  
This backend is the CORE of the platform.  
It is designed for repetition, speed, and clone-by-hand muscle memory.

NO generators. NO magic. NO microservices.

---

## 🎯 Goal

Build a production-style backend that:
- Can be rebuilt from scratch in ≤ 2 hours
- Enforces level-based backend practice
- Verifies real backend behavior
- Feels boring and predictable

---

## 🧱 Phase 0 — Bootstrap

- [ ] Initialize Express + TypeScript
- [ ] Setup env loader
- [ ] Create `app.ts` and `server.ts`
- [ ] Request logging middleware
- [ ] Global error handler
- [ ] `/health` endpoint
- [ ] `/ready` endpoint

src/
├─ modules/
├─ common/
├─ db/
├─ jobs/
├─ app.ts
└─ server.ts


---

## 🟢 Phase 1 — Core API Loop (MANDATORY)

Pattern to follow everywhere:

Route → Controller → Service → Repository

Rules:
- No logic in routes
- No DB in controllers
- No HTTP in services
- No ORM outside repositories

---

## 🟢 Phase 2 — Database Loop

- [ ] PostgreSQL connection
- [ ] ORM setup
- [ ] Migrations
- [ ] User schema
- [ ] Resource schema
- [ ] UUID primary keys
- [ ] Indexed foreign keys
- [ ] Repository pattern enforced

---

## 🟢 Phase 3 — Auth Loop

- [ ] POST /auth/register
- [ ] Password hashing
- [ ] POST /auth/login
- [ ] JWT access token
- [ ] Refresh token flow
- [ ] Refresh tokens stored in DB
- [ ] Auth middleware
- [ ] Role-based access (USER / ADMIN)
- [ ] Resource ownership checks

---

## 🟢 Phase 4 — Resource CRUD

- [ ] POST /resources
- [ ] GET /resources
- [ ] GET /resources/:id
- [ ] PATCH /resources/:id
- [ ] DELETE /resources/:id
- [ ] Input validation
- [ ] Standard error format

---

## 🟢 Phase 5 — Caching Loop

- [ ] Redis connection
- [ ] Verify Redis on startup
- [ ] Read-through cache for GET by ID
- [ ] TTL-based expiration
- [ ] Cache invalidation
- [ ] Cache failure must not crash API

---

## 🟢 Phase 6 — Background Jobs

- [ ] Queue setup
- [ ] Worker process
- [ ] Enqueue job on user creation
- [ ] Async job processing
- [ ] Idempotency
- [ ] Retries with backoff
- [ ] Dead-letter handling

---

## 🟢 Phase 7 — Observability & Guardrails

- [ ] Structured JSON logs
- [ ] Request ID middleware
- [ ] Error stack traces
- [ ] Rate limiting
- [ ] Secure headers
- [ ] Env validation at startup
- [ ] Graceful shutdown

---

## 🟢 Phase 8 — Levels & Progress System

### Levels

| Level | Capability |
|-----|-----------|
| L0 | Server + Health |
| L1 | CRUD Core |
| L2 | Database |
| L3 | Authentication |
| L4 | Authorization |
| L5 | Caching |
| L6 | Background Jobs |
| L7 | Observability |
| L8 | Production |
| L9 | Speed Run |

---

### Progress Storage

UserProgress table:
- user_id
- level_id
- status (LOCKED | IN_PROGRESS | COMPLETED)
- completed_at

---

### Verification Logic (CRITICAL)

- Each level verified by real API behavior
- No manual marking
- Verification updates progress
- Verification cannot be skipped

---

## 🟢 Phase 9 — Speed Run Mode

- [ ] Single endpoint to run full verification suite
- [ ] Timer starts on request
- [ ] Return pass/fail + duration
- [ ] No frontend hints

---

## 🔴 Success Criteria

- Backend rebuild ≤ 2 hours
- New resource ≤ 15 minutes
- Auth built without docs
- Verification cannot be cheated
