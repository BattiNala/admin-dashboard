# Batti Nala Admin — Project Context & Implementation Notes

## What Is Batti Nala?

Batti Nala is a citizen reporting platform that connects the public with municipal authorities to fix infrastructure problems. The name comes from Nepali: *Batti* (electricity/light) and *Nala* (drain/sewage). Citizens report issues such as broken electric poles, water leaks, sewage overflows, and road damage from their phones.

### User Roles (Relevant to This Admin App)

| Role | Admin app access |
|------|------------------|
| **Superadmin** | Full superadmin area: roles, departments, users |
| **Department admin** | Department dashboard, teams, staff, analytics |
| **Staff / citizens** | Not targeted by this admin SPA (or access denied at login) |

### Core Product Features (Platform-Wide)

- **Citizens**: report with photos and map location, track status, history, trust score  
- **Staff**: assigned issues, routes, status updates  
- **Department admin**: staff management, assignments, metrics  
- **Superadmin**: departments, department admins, system configuration  

This repository is the **admin web client** (React + Vite) that talks to the backend over `/api/*` (proxied to the FastAPI server in development).

---

## Department Creation (Superadmin)

### Backend Contract (Reference)

`POST /api/department/create-department` (superadmin only)

- **Body:** `{ "department_name": "<string>" }` (matches `DepartmentCreate` on the server)
- **Success:** `{ "message": "Department '<name>' created successfully" }`
- **Conflict / duplicate:** typically `400` with detail like `"Department already exists"`

The admin UI must send **only** `department_name` in JSON; field names must match the Pydantic model.

### Frontend: `DepartmentsPage.jsx`

- Lists departments via `GET /api/department/list-departments`
- Create form uses shared constants (`VALIDATION_RULES.department_name`) for the **department name field only**

---

## Form Validation Architecture

### Files

| Path | Purpose |
|------|---------|
| `src/constants/validation.js` | Central rules, labels, placeholders, API-oriented copy |
| `src/hooks/useFormValidation.js` | Reusable state: values, errors, touched, validate, reset |
| `src/utils/validation.js` | Helpers (email, phone, department id checks, etc.) |

### Important: Scope Rules to the Form

`validateForm()` iterates **`Object.keys(validationRules)`**. If you pass the entire `VALIDATION_RULES` object to a form that only has `department_name`, the hook will still validate **name, email, password, …** against empty values and the form will always fail.

**Correct pattern for the create-department form:**

```javascript
const DEPARTMENT_CREATE_RULES = {
  department_name: VALIDATION_RULES.department_name,
};
useFormValidation(INITIAL_DEPARTMENT_FORM, DEPARTMENT_CREATE_RULES);
```

Use a **stable** initial values object (module-level constant) so `resetForm()` behaves predictably.

### Department Name Rules (Summary)

- Required, length bounds, pattern for safe characters (letters, numbers, spaces, `-`, `&`, `()`)

### API Error Detail (FastAPI)

Errors may return `detail` as a **string** or a **list** of validation objects. The departments create handler normalizes this before showing a toast.

---

## Authentication & “Instant” Role / Department After Login

### Problem

1. **First paint after refresh:** If `user` was initialized as `null` and only filled in `useEffect`, the app could briefly treat the user as logged out.  
2. **Missing profile after reload:** `saveAuth` originally stored only tokens and `role_name`, so **name** and **department** disappeared on full page reload even though the session was still valid.

### What We Implemented

1. **`App.jsx`** — `useState(() => loadAuth())` so the session is applied on the **first render** (no flash to `/login` when tokens are valid).

2. **`authStorage.js`** — `saveAuth` / `loadAuth` persist optional profile fields when the login API provides them:
   - `name` (display name; falls back from `full_name`, `username` when loading)
   - `username`
   - `department_id`
   - `department_name`

3. **`LoginPage.jsx`** — On success, maps common response shapes, including nested `department`:
   - `department_id` / `department_name` on the root, or  
   - `department.department_id` / `department.department_name` (and similar)

4. **UI** — `Sidebar` and `Header` show **role** and, for department admins, **department name** as soon as `user` is set (including after reload if the backend returned those fields at login and they were saved).

### Backend Expectation

For department admins to see their department after every refresh, the **login response should include** `department_name` (and ideally `department_id`) or a nested `department` object. If the API does not send these fields, the UI cannot show them until you extend the login payload.

---

## Layout Components

- **`MainLayout`** passes `user`, `onLogout`, and `onMenuClick` into **`Header`**; **`Sidebar`** shows nav + user block.
- **`Header`** shows the signed-in name, role label, and department (for department admins) and a mobile menu button wired to `onMenuClick`.

---

## Implementation Progress (Admin Client)

| Area | Status |
|------|--------|
| Login + token storage + role gating | Done |
| Persisted profile (name, department) on login + reload | Done (depends on API fields) |
| Superadmin: departments list + create + delete | Create/list/delete wired; edit is placeholder |
| Superadmin: roles / users pages | Present in routes (verify against backend) |
| Department admin dashboard & team flows | Routed; align with backend as needed |
| Form validation hook | Done; must pass **per-form** rule subsets |

### Known Follow-Ups

- Implement **edit department** where the API supports it.
- Confirm **login JSON** schema with the backend and add any missing fields (e.g. `full_name`, `department`) so persisted profile is complete.
- Align `BACKEND_SETUP.md` route versions (`/api/v1/...` vs `/api/...`) with the actual FastAPI mount and proxy config.

---

## Related Docs

- `BACKEND_SETUP.md` — local backend and proxy expectations  
- `README.md` — project entry and scripts  

This document is the **single place** for admin validation behavior, auth/profile persistence, and how department creation fits the Batti Nala product context.
