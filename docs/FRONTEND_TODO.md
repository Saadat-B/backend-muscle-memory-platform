# Backend Training Console UI (Next.js + TypeScript + Tailwind)

Thin frontend to enforce backend progression and verification.
Not a frontend course.


# Backend Training Console UI (Next.js + TypeScript + Tailwind)

> Purpose:  
This frontend is NOT a frontend course.  
It is a thin training console that enforces backend practice.

Minimal UI. Explicit API calls. Disposable code.

---

## 🎯 Goal

Create a frontend that:
- Enforces backend level progression
- Verifies backend behavior
- Tracks progress
- Makes backend failures obvious

---

## 🧱 Phase 0 — Bootstrap

- [ ] Initialize Next.js + TypeScript
- [ ] Setup Tailwind
- [ ] Setup API base URL (.env)
- [ ] Basic layout (header + main)
- [ ] Error boundary
- [ ] Minimal global styles

---

## 🟢 Phase 1 — Auth Screens

### Login
- [ ] Email input
- [ ] Password input
- [ ] Submit → backend login
- [ ] Show backend errors
- [ ] Store access token

### Register
- [ ] Email + password
- [ ] Show validation errors
- [ ] Redirect on success

### Logout
- [ ] Clear auth
- [ ] Redirect to login

---

## 🟢 Phase 2 — Dashboard

- [ ] Show current level
- [ ] Show completion percentage
- [ ] Show last completed level
- [ ] Continue Training button

---

## 🟢 Phase 3 — Levels List

- [ ] Vertical list of levels
- [ ] Completed levels marked
- [ ] Locked levels disabled
- [ ] Only current + previous clickable

Example:
✔ L0 Server  
✔ L1 CRUD  
⬤ L2 Database  
🔒 L3 Auth  

---

## 🟢 Phase 4 — Level Detail Page (CORE)

Each level page contains ONLY:

### 1. Checklist
- Backend requirements (read-only)

### 2. Verify Buttons
- Call backend verification APIs
- Show pass/fail
- Display backend errors verbatim

### 3. Unlock Indicator
- Unlock next level only on success

---

## 🟢 Phase 5 — Progress Tracking

- [ ] Fetch progress from backend
- [ ] Backend is source of truth
- [ ] No fake completion
- [ ] Persist progress per user

---

## 🟢 Phase 6 — Failure Mode UX

- [ ] Show 401 clearly
- [ ] Show 403 clearly
- [ ] Show validation errors
- [ ] Handle slow responses
- [ ] Handle network failures

---

## 🟢 Phase 7 — Speed Run UI

- [ ] Start speed run button
- [ ] Call backend speed-run endpoint
- [ ] Show timer
- [ ] Show pass/fail summary
- [ ] No hints or guidance

---

## 🔴 Frontend Success Criteria

Frontend is successful if:
- Backend bugs are immediately visible
- Levels cannot be skipped
- Progress is backend-driven
- UI can be rebuilt in < 1 hour
- UI can be deleted anytime
