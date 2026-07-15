# Project Memory — Alumni Management System

A web app: React JS admin/user panel powered by a Laravel 12 REST API
and MySQL database. Three roles: Super Admin (President), Admin (Dept Head),
User (Student/Alumni).

---

## 📁 Project Structure — Never Deviate From This

capstone/
├── backend/
│ ├── app/
│ │ ├── Http/
│ │ │ ├── Controllers/Api/V1/ # Versioned API controllers
│ │ │ ├── Requests/ # One folder per feature
│ │ │ │ ├── User/
│ │ │ │ ├── Department/
│ │ │ │ ├── AlumniProfile/
│ │ │ │ └── Event/
│ │ │ └── Resources/ # API Resource classes
│ │ ├── Models/ # Eloquent models only
│ │ ├── Policies/ # Authorization (role + department scoping)
│ │ ├── Services/ # Business logic
│ │ │ └── Interfaces/ # Service interfaces
│ │ ├── Repositories/ # Database queries only
│ │ │ └── Interfaces/ # Repository interfaces
│ │ └── Providers/
│ │ └── RepositoryServiceProvider.php
│
└── admin-web/
└── src/
├── components/
│ ├── ui/ # Generic: Button, Input, Badge, Modal
│ └── shared/ # App-specific: Sidebar, Navbar, Table
├── pages/ # One folder per feature
│ ├── users/
│ ├── departments/
│ ├── alumni-profiles/
│ ├── events/
│ └── settings/
├── services/ # One file per feature (userService.js)
├── hooks/ # Custom React hooks only
├── context/ # Auth and app context (role, department)
├── utils/ # Pure helper functions
└── constants/ # App-wide constants and enums

---

## 🚨 Golden Rules — Never Break These

- NEVER create a file unless explicitly required by the task
- NEVER create placeholder, demo, sample, or test files unless asked
- NEVER modify a file unrelated to the current task
- NEVER install a package without asking for approval first
- NEVER assume anything unclear — ask before doing
- ALWAYS do the minimum required to complete the task cleanly
- ALWAYS follow existing patterns in the codebase
- ALWAYS check if a file or component already exists before creating a new one
- NEVER leave a feature half-done — complete it end to end

---

## 👥 Roles & Access Model

| Role          | Maps to          | Scope                                                                                  |
| ------------- | ---------------- | -------------------------------------------------------------------------------------- |
| `super_admin` | President        | Full access — all departments, all data                                                |
| `admin`       | Dept Head        | Scoped to own `department_id` only — cannot view/edit other departments' users or data |
| `user`        | Student / Alumni | Own profile and own data only                                                          |

### Account Creation

- **super_admin** — seeded directly via DB seeder/artisan command, never created via UI (no one above this role to create it)
- **admin** — created directly by a super_admin via an admin form (super_admin selects the department when creating the account). Admins are never "promoted" from existing users.
- **user** — open self-registration; selects/assigns `department_id` at signup

### Enforcement Rules

- Role checks AND department checks always happen in **Policies**, never just hidden in the UI
- Every Repository query for `admin`-scoped data must filter by `department_id` matching the authenticated admin — never trust a department ID passed from the frontend
- `super_admin` bypasses department scoping entirely
- Frontend role/department checks are for UI/UX only — Laravel Policies are the real enforcement layer

---

## ⚙️ Backend Architecture — Repository Pattern (Strict)

### Request Flow — Always Follow This Exact Order

Request → Controller → FormRequest → Service → Repository → Model → Database

### Never Skip Layers

- Controllers NEVER talk to Repository directly
- Controllers NEVER talk to Model directly
- Services NEVER talk to Database directly
- Repositories are the ONLY layer that touches Models
- Never write Eloquent queries outside Repository classes
- Policies are the ONLY layer that decides role/department access — never inline `if ($user->role === ...)` checks in Controllers or Services

### File Naming

- Controllers: `EventController.php` (PascalCase, singular)
- Models: `Event.php` (PascalCase, singular)
- Requests: `StoreEventRequest.php`, `UpdateEventRequest.php`
- Resources: `EventResource.php`, `EventCollection.php`
- Policies: `EventPolicy.php`
- Services: `EventService.php` + `EventServiceInterface.php`
- Repositories: `EventRepository.php` + `EventRepositoryInterface.php`

### Each Layer Responsibility

- Controller → HTTP in/out only, calls one Service method, try/catch always
- FormRequest → validation and authorization only
- Service → business logic only, uses DB::transaction for multi-step ops
- Repository → Eloquent queries only, extends BaseRepository, applies department scoping for non-super_admin callers
- Model → fillable, casts, relationships only, always use SoftDeletes
- Policy → role + department comparison logic only

### Standard API Response Shape

{
"status": true,
"message": "Success",
"data": {}
}

### Error Response Shape

{
"status": false,
"message": "Error message",
"errors": {}
}

### Rules

- Every controller method must have try/catch
- Every model must have $fillable and use SoftDeletes
- Never return raw Eloquent models — always use Resource classes
- Always validate using Form Request classes, never in controllers
- Always use Route::apiResource() for CRUD routes
- Always group routes under auth:sanctum middleware
- Always apply role middleware (`role:super_admin,admin`, etc.) at the route-group level for feature access
- Always bind interfaces in RepositoryServiceProvider
- Always version routes under /api/v1/

---

## 🖥️ Admin/User Panel Rules (React JS + Tailwind)

### File Naming

- Pages: `UserList.jsx`, `UserCreate.jsx`, `UserDetail.jsx`
- Components: `EventTable.jsx`, `AlumniStatusBadge.jsx`
- Hooks: `useUsers.js`, `useAuth.js`, `useRole.js`
- Services: `userService.js`, `departmentService.js`, `eventService.js`
- Utils: `formatDate.js`, `formatCurrency.js`

### Code Rules

- Always use Tailwind utility classes, never inline styles
- Never fetch data directly in a component — use a custom hook or service
- Never hardcode API URLs — use `REACT_APP_API_URL` from `.env`
- Always handle 3 states per data fetch: loading, success, error
- Always show empty state when a list has no data
- Reuse existing components before creating new ones
- Keep components under 200 lines — split if longer
- Never use window.location — always use React Router
- Always gate routes/pages by role using a `<RequireRole>` wrapper or `useRole()` hook — never rely on hiding nav links alone
- Store authenticated user's `role` and `department_id` in auth context after login; re-fetch on refresh, never persist as the source of truth client-side

### Official Color Palette — Talibon Polytechnic College (from official seal)

- Primary (laurel green): tpc-green (#3C9A3C)
- Primary hover/active: tpc-greenDeep (#02451C)
- Navy (headers, sidebar): tpc-navy (#0F3A5C)
- Navy deep (overlays/scrims): tpc-navyDeep (#0A2A44)
- Gold (accents, highlights): tpc-gold (#F4C430)
- Gold deep (pressed/shadow state): tpc-goldDeep (#D9A521)
- Cream (text on navy/green backgrounds): tpc-cream (#FBF6E9)
- Page background: bg-white
- Cards: bg-white rounded-xl shadow-sm border border-gray-200
- Table header: bg-gray-50 text-gray-500 (light) — use bg-tpc-navy text-white for emphasis tables
- Sidebar: bg-tpc-greenDeep text-white
- Active nav item: bg-white/20 text-white rounded-lg
- Primary button: bg-tpc-greenDeep hover:bg-tpc-green text-white

### Alumni/User Status Badge Colors

- pending_verification: bg-amber-100 text-amber-700
- active: bg-green-100 text-green-700
- inactive: bg-gray-100 text-gray-700
- suspended: bg-red-100 text-red-700

### Event Status Badge Colors

- upcoming: bg-blue-100 text-blue-700
- ongoing: bg-tpc-gold/20 text-tpc-goldDeep
- completed: bg-gray-100 text-gray-700
- cancelled: bg-red-100 text-red-700

---

## 🗄️ Database Rules

- Never edit an existing migration — always create a new one
- Always add foreign key constraints with onDelete cascade
- Always add indexes on: role, department_id, status, foreign keys, created_at
- Always use softDeletes on core entity tables
- Always seed in dependency order to avoid foreign key errors (Departments → super_admin → admins → users)
- Core entities: User, Department, AlumniProfile, Event

### User Role ENUM

super_admin → admin → user

### User Status ENUM

pending_verification → active → inactive → suspended

### Event Status ENUM

upcoming → ongoing → completed → cancelled

### Key Relationships

- `users.department_id` → `departments.id` (nullable — super_admin has none)
- `alumni_profiles.user_id` → `users.id`
- `events.department_id` → `departments.id` (nullable if school-wide event)

---

## 🧭 Decisions Log — Why We Did It This Way

> Short entries only. Purpose: stop re-litigating settled decisions. If a decision needs to be revisited, update the entry — don't just contradict it silently.

- **Admins are created directly by super_admin, never "promoted" from existing users** — keeps account creation explicit and avoids a separate promotion/permission-escalation flow that this school context doesn't need.
- **Dept Head scoping enforced in Policies + Repositories, never trusted from frontend** — frontend role/department checks are UX only; real enforcement is server-side so a tampered request can't cross department boundaries.
- **`department_id` nullable on `users` and `events`** — super_admin has no department; some events are school-wide rather than department-specific.

---

## 🔐 Auth & Security Rules

- Use Laravel Sanctum for all API authentication
- Admin/User web app: store token in localStorage
- Never expose API keys in frontend code
- Always validate and sanitize on the backend
- Never trust frontend-provided data — especially `role` and `department_id`, which must always be derived server-side from the authenticated user, never accepted from request payloads
- Only a super_admin can create an admin account or assign/change a user's `department_id` on creation by an admin

---

## 🧹 Code Quality Rules

- No commented-out code
- No console.log in production code
- No unused imports or variables
- No duplicate code — extract to reusable function or component
- No magic numbers — use named constants
- No TODO comments — finish the task or ask
- Every function does ONE thing only
- All names must be descriptive — no single-letter variables except loop indices

---

## 📝 When Asked to Build a Feature — Always Follow This Order

1. Check if similar code already exists in the codebase
2. List the files that need to be created or modified — confirm before proceeding
3. Backend first: Migration → Model → Policy → Request → Resource → Controller → Route
4. Frontend second: Service → Hook → Page → Component (apply role/department guards)
5. Connect all pieces end to end
6. Do not leave anything incomplete
