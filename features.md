# TPC Alumni Management System — Final Output & Features Spec

> **Purpose:** This file defines the FINAL expected output, UI, and features for every role.
> Any agent or developer must read this before building any page or endpoint.
> This is the ground truth for what the system should look like when fully complete.

> **Stack:** Laravel 12 (backend API) · React + Tailwind CSS (admin-web) · Docker
> **Roles:** `super_admin` · `admin` · `user`
> **Color tokens:** Use TPC tokens only — never hardcode hex values.

---

## ROLE 1 — Super Admin (President / Career Office)

### Who Uses This

The school president, career office head, or ICT officer.
Has full visibility across all departments.

---

### Pages & Final Output

---

#### 📊 `/president/dashboard` — Dashboard

**What the user sees:**

- Top stats row (4 cards):
  - Total Alumni (all departments combined)
  - Employed Alumni
  - Unemployed Alumni
  - Pending Approvals (across all depts)
- Employment Rate gauge or percentage bar (school-wide)
- Top 5 Industries chart (bar or donut) — based on `job_histories`
- Top 5 Departments by employment rate
- Recent Activity feed — latest approve/reject actions from `account_activity_logs`
- Upcoming Events list (next 3–5 events, school-wide)
- Recent Announcements list (last 3)

**API calls this page makes:**

```
GET /api/super-admin/dashboard-stats
GET /api/events?limit=5
GET /api/announcements?limit=3
GET /api/account-activity-logs?limit=10
```

---

#### 🏛️ `/president/departments` — Department List

**What the user sees:**

- Page title: "Departments"
- "Add Department" button (top right, pill-shaped, tpc-gold bg)
- Table or card grid showing all departments:
  - Department Name
  - Department Code (e.g. BSIT)
  - Description
  - Assigned Department Head (name or "No head assigned")
  - Total Graduates count
  - Total Registered Alumni count
  - Actions: Edit · Delete (with confirmation modal)
- Search bar (filter by name or code)
- Empty state if no departments yet

**API calls:**

```
GET  /api/departments
POST /api/departments         ← Create
PATCH /api/departments/{id}   ← Edit
DELETE /api/departments/{id}  ← Soft delete
```

---

#### ➕ `/president/departments/create` — Create Department (Modal or Page)

**What the user sees:**

- Form fields:
  - Department Name (text, required)
  - Department Code (text, required, uppercase, e.g. "BSIT")
  - Description (textarea, optional)
- Submit button: "Create Department"
- Validation: code must be unique
- On success: redirect back to `/president/departments` with success toast

---

#### 👤 `/president/department-heads` — Department Head Accounts

**What the user sees:**

- Page title: "Department Head Accounts"
- "Add Department Head" button
- Table of all admin accounts:
  - Name
  - Email
  - Assigned Department
  - Status (Active / Inactive badge)
  - Date Created
  - Actions: Deactivate · Reactivate
- Filter by department, filter by status
- Empty state if none

**API calls:**

```
GET   /api/admin-accounts
POST  /api/admin-accounts                      ← Create
PATCH /api/admin-accounts/{id}/deactivate      ← Deactivate
PATCH /api/admin-accounts/{id}/reactivate      ← Reactivate
```

---

#### ➕ Create Department Head (Modal inside `/president/department-heads`)

**What the user sees:**

- Modal form:
  - Full Name (text, required)
  - Email (email, required)
  - Department (dropdown from departments list, required)
  - Temporary Password (auto-generated or manual input)
- Warning if department already has an active head: "This department already has an active head. Proceed?"
- On success: toast "Department Head account created. Welcome email sent."

---

#### 🎓 `/president/graduates` — All Graduates

**What the user sees:**

- Page title: "Graduates"
- "Add Graduate" button
- Filters: Department dropdown · Batch Year · Registration Status (Registered / Not Yet)
- Search: by name or student number
- Table:
  - Student Number
  - Name
  - Department
  - Course
  - Batch Year
  - Registration Status badge (green = Registered, gray = Not Yet)
  - Actions: Delete (soft delete)
- Pagination

**API calls:**

```
GET    /api/super-admin/graduates
POST   /api/super-admin/graduates
DELETE /api/super-admin/graduates/{id}
```

---

#### 👥 `/president/alumni` — All Alumni (Approved)

**What the user sees:**

- Page title: "Alumni"
- Tabs: All · By Department · By Batch Year
- Search: by name, email, student number
- Filter: Department · Employment Status · Batch Year
- Table or card list:
  - Profile photo (avatar)
  - Name
  - Department
  - Batch Year
  - Employment Status badge (Employed / Unemployed / Self-Employed)
  - Current Job & Company
  - Actions: View Profile
- Clicking "View Profile" opens a read-only profile modal or page

**API calls:**

```
GET /api/super-admin/alumni
GET /api/super-admin/alumni/{id}
```

---

#### ⏳ `/president/alumni/pending` — Pending Approvals

**What the user sees:**

- Page title: "Pending Alumni Approvals"
- Card grid layout:
  - Name
  - Email
  - Department
  - Student Number
  - Registration Date
  - Approve button (green) · Reject button (red)
- Reject opens a modal with optional reason textarea
- Empty state: "No pending approvals."

**API calls:**

```
GET   /api/admin/alumni/pending
PATCH /api/admin/alumni/{id}/approve
PATCH /api/admin/alumni/{id}/reject
```

---

#### 📅 `/president/events` — Events

**What the user sees:**

- Page title: "Events"
- "Create Event" button
- Filter: Scope (All / School-Wide / Department-Specific) · Date range
- Search by title
- Card grid:
  - Title
  - Description (truncated)
  - Event Date & Time
  - Location
  - Scope badge (School-Wide / Dept-Specific)
  - Department (if dept-specific)
  - Actions: Edit · Delete
- Past events toggle: "Show Past Events"

**API calls:**

```
GET    /api/events
POST   /api/events
PATCH  /api/events/{id}
DELETE /api/events/{id}
```

---

#### 📢 `/president/announcements` — Announcements

**What the user sees:**

- Page title: "Announcements"
- "Create Announcement" button
- List view (newest first):
  - Title
  - Content preview
  - Scope badge
  - Date posted
  - Actions: Edit · Delete
- Search by title

**API calls:**

```
GET    /api/announcements
POST   /api/announcements
PATCH  /api/announcements/{id}
DELETE /api/announcements/{id}
```

---

#### 📈 `/president/reports` — Reports (Phase 3)

**What the user sees:**

- Employment Rate per Department (bar chart)
- Top Industries (donut chart)
- Alumni by Location (list or map)
- Career Distribution (pie chart)
- Filters: Department · Batch Year · Date Range
- Export to Excel button

> Status: [SKIP — Phase 3]

---

---

## ROLE 2 — Department Admin (Department Head / Program Chair)

### Who Uses This

The head of a specific department (e.g. BSIT Head).
Sees ONLY data belonging to their own `department_id`.
Cannot see or touch other departments.

---

### Pages & Final Output

---

#### 📊 `/admin/dashboard` — Dashboard

**What the user sees:**

- Department name displayed prominently (e.g. "BSIT Department")
- Stats row (4 cards):
  - Total Graduates in their dept
  - Total Registered Alumni in their dept
  - Pending Approvals (their dept only)
  - Employed Alumni (their dept only)
- Employment Rate for their department (percentage)
- Recent alumni approvals/rejections (their dept only, from `account_activity_logs`)
- Upcoming Events (their dept + school-wide, next 3–5)
- Recent Announcements (their dept + school-wide, last 3)

**API calls:**

```
GET /api/admin/dashboard-stats
GET /api/events?limit=5
GET /api/announcements?limit=3
```

---

#### 🎓 `/admin/graduates` — Graduates (Own Department Only)

**What the user sees:**

- Page title: "Graduates — [Department Name]"
- "Add Graduate" button
- Filters: Batch Year · Registration Status
- Search: by name or student number
- Table:
  - Student Number
  - Name
  - Course
  - Batch Year
  - Registration Status badge
  - Actions: Delete
- Pagination
- NOTE: Department column NOT shown (they only see their own dept)

**API calls:**

```
GET    /api/admin/graduates           ← auto-scoped to their dept_id
POST   /api/admin/graduates           ← dept_id auto-set from auth user
DELETE /api/admin/graduates/{id}      ← only if belongs to their dept
```

---

#### ➕ Add Graduate (Modal inside `/admin/graduates`)

**What the user sees:**

- Modal form:
  - Student Number (text, required, unique)
  - Full Name (text, required)
  - Course (text, required, e.g. "BSIT")
  - Batch Year (number, required, e.g. 2024)
  - Department: auto-filled from their account — NOT a dropdown
- Submit: "Add Graduate"
- On success: toast "Graduate added successfully."

---

#### ⏳ `/admin/alumni/pending` — Pending Alumni Approvals

**What the user sees:**

- Same card grid layout as super_admin pending page
- BUT only shows alumni from their department
- Approve / Reject with same behavior
- Empty state: "No pending approvals for your department."

**API calls:**

```
GET   /api/admin/alumni/pending       ← scoped
PATCH /api/admin/alumni/{id}/approve
PATCH /api/admin/alumni/{id}/reject
```

---

#### 👥 `/admin/alumni` — Active Alumni (Own Department)

**What the user sees:**

- Page title: "Alumni — [Department Name]"
- Search: by name, email, student number
- Filter: Employment Status · Batch Year
- Table or card list:
  - Profile photo (avatar)
  - Name
  - Batch Year
  - Employment Status badge
  - Current Job & Company
  - Actions: View Profile (read-only)
- No department column (all same dept)

**API calls:**

```
GET /api/admin/alumni           ← scoped to their dept
GET /api/admin/alumni/{id}      ← view profile (read-only)
```

---

#### 📅 `/admin/events` — Events

**What the user sees:**

- Same layout as super_admin events page
- BUT can only see: school_wide events + their dept events
- Can only CREATE department_specific events (scope auto-set, no school-wide option)
- Can only EDIT/DELETE events they created

**API calls:**

```
GET    /api/events                ← filtered by scope + dept
POST   /api/events                ← scope forced to department_specific
PATCH  /api/events/{id}           ← only own events
DELETE /api/events/{id}           ← only own events
```

---

#### 📢 `/admin/announcements` — Announcements

**What the user sees:**

- Same layout as super_admin announcements
- Can only see: school_wide + their dept announcements
- Can only create department-scoped announcements
- Can only edit/delete own announcements

**API calls:**

```
GET    /api/announcements
POST   /api/announcements         ← scope forced to department_specific
PATCH  /api/announcements/{id}
DELETE /api/announcements/{id}
```

---

---

## ROLE 3 — Alumni (User / Graduate)

### Who Uses This

A verified graduate who has registered and been approved.

---

### Pages & Final Output

---

#### 👤 `/student/profile` — My Profile

**What the user sees:**

- Profile photo (large, with upload button)
- Name
- Student Numberthe (read-only)
- Department (read-only)
- Editable fields:
  - Contact Number
  - Location (city/province)
  - Email (read-only — cannot change)
- Employment Status badge (auto-derived): Employed / Unemployed / Self-Employed
- Current Job & Company (auto-derived from latest job_histories entry)
- "Edit Profile" button → inline edit or edit mode toggle
- "Upload Photo" button

**API calls:**

```
GET   /api/profile
PATCH /api/profile
POST  /api/profile/photo
```

---

#### 💼 `/student/employment` — Employment History

**What the user sees:**

- Page title: "My Career"
- Career path visual (timeline):
  - Each job as a card in vertical timeline
  - Shows: Company · Position · Industry · Start Date → End Date (or "Present")
  - Current job highlighted with green badge "Current"
- "Add Job" button (top right)
- Edit / Delete buttons on each entry
  - Edit disabled if `is_employer_updated = true` (shows lock icon + tooltip)
- Empty state: "No employment history yet. Add your first job."

**API calls:**

```
GET    /api/employment
POST   /api/employment
PATCH  /api/employment/{id}
DELETE /api/employment/{id}
```

---

#### ➕ Add Job (Modal on `/student/employment`)

**What the user sees:**

- Modal form:
  - Company (text, required)
  - Position / Job Title (text, required)
  - Industry (dropdown from seeded industries list, required)
  - Start Date (date picker, required)
  - End Date (date picker, optional)
  - Currently Working Here? (checkbox — if checked, hides End Date)
- Submit: "Save Job"
- On success: timeline updates immediately

---

#### 📅 `/student/events` — Events

**What the user sees:**

- Page title: "Events"
- Card grid (upcoming first):
  - Title
  - Description
  - Date & Time
  - Location
  - Scope badge (School-Wide / [Dept Name])
- Toggle: "Show Past Events"
- Search by title
- Read-only — alumni cannot create events

**API calls:**

```
GET /api/events       ← filtered: school_wide + their dept only
```

---

#### 📢 `/student/announcements` — Announcements

**What the user sees:**

- Page title: "Announcements"
- List (newest first):
  - Title
  - Content
  - Date posted
  - Scope badge
- Search by title
- Read-only — alumni cannot create announcements

**API calls:**

```
GET /api/announcements    ← filtered: school_wide + their dept only
```

---

---

## Shared UI Rules (All Roles)

- Sidebar: `bg-tpc-greenDeep`, active nav `bg-white/10`, inactive `text-white/70`
- All buttons: `rounded-full` pill shape
- Primary action buttons: `bg-tpc-gold text-black hover:bg-tpc-goldDeep`
- Danger buttons: `bg-red-600 text-white hover:bg-red-700`
- Success badges: `bg-tpc-green text-white`
- Pending badges: `bg-yellow-500 text-black`
- Inactive badges: `bg-gray-400 text-white`
- Form fields: `bg-tpc-cream/40 border border-white/20 rounded-lg`
- Toasts: use the project's existing toast system (not browser alerts)
- Modals: centered overlay, `bg-white rounded-2xl shadow-xl`
- Empty states: centered illustration or icon + descriptive message
- Loading states: skeleton loaders (not spinners where possible)
- All tables: have pagination (10 items per page default)
- All lists: have search bar at top

---

## Route Map Summary

| Role        | Path                          | Page                         | Status    |
| ----------- | ----------------------------- | ---------------------------- | --------- |
| super_admin | /president/dashboard          | Dashboard                    | [TODO]    |
| super_admin | /president/departments        | Department List              | [PARTIAL] |
| super_admin | /president/departments/create | Create Department            | [TODO]    |
| super_admin | /president/department-heads   | Dept Head Accounts           | [DONE]    |
| super_admin | /president/graduates          | All Graduates                | [DONE]    |
| super_admin | /president/alumni             | All Alumni (Active)          | [TODO]    |
| super_admin | /president/alumni/pending     | Pending Approvals            | [DONE]    |
| super_admin | /president/events             | Events CRUD                  | [DONE]    |
| super_admin | /president/announcements      | Announcements CRUD           | [DONE]    |
| super_admin | /president/reports            | Reports & Analytics          | [SKIP]    |
| admin       | /admin/dashboard              | Dashboard                    | [TODO]    |
| admin       | /admin/graduates              | Graduates (own dept)         | [TODO]    |
| admin       | /admin/alumni                 | Active Alumni (own dept)     | [TODO]    |
| admin       | /admin/alumni/pending         | Pending Approvals (own dept) | [DONE]    |
| admin       | /admin/events                 | Events (dept-scoped)         | [DONE]    |
| admin       | /admin/announcements          | Announcements (dept-scoped)  | [DONE]    |
| user        | /student/profile              | My Profile                   | [TODO]    |
| user        | /student/employment           | Employment History           | [TODO]    |
| user        | /student/events               | View Events                  | [DONE]    |
| user        | /student/announcements        | View Announcements           | [DONE]    |

---

## Backend API Map Summary

| Method | Route                               | Access              | Status |
| ------ | ----------------------------------- | ------------------- | ------ |
| POST   | /api/auth/login                     | public              | [DONE] |
| POST   | /api/auth/register                  | public              | [DONE] |
| POST   | /api/auth/logout                    | all auth            | [DONE] |
| GET    | /api/auth/me                        | all auth            | [DONE] |
| GET    | /api/super-admin/dashboard-stats    | super_admin         | [TODO] |
| GET    | /api/departments                    | super_admin         | [DONE] |
| POST   | /api/departments                    | super_admin         | [TODO] |
| PATCH  | /api/departments/{id}               | super_admin         | [TODO] |
| DELETE | /api/departments/{id}               | super_admin         | [TODO] |
| GET    | /api/admin-accounts                 | super_admin         | [DONE] |
| POST   | /api/admin-accounts                 | super_admin         | [DONE] |
| PATCH  | /api/admin-accounts/{id}/deactivate | super_admin         | [DONE] |
| PATCH  | /api/admin-accounts/{id}/reactivate | super_admin         | [TODO] |
| GET    | /api/super-admin/graduates          | super_admin         | [DONE] |
| POST   | /api/super-admin/graduates          | super_admin         | [DONE] |
| DELETE | /api/super-admin/graduates/{id}     | super_admin         | [DONE] |
| GET    | /api/super-admin/alumni             | super_admin         | [TODO] |
| GET    | /api/super-admin/alumni/{id}        | super_admin         | [TODO] |
| GET    | /api/admin/dashboard-stats          | admin               | [TODO] |
| GET    | /api/admin/graduates                | admin               | [TODO] |
| POST   | /api/admin/graduates                | admin               | [TODO] |
| DELETE | /api/admin/graduates/{id}           | admin               | [TODO] |
| GET    | /api/admin/alumni                   | admin               | [TODO] |
| GET    | /api/admin/alumni/{id}              | admin               | [TODO] |
| GET    | /api/admin/alumni/pending           | admin+super_admin   | [DONE] |
| PATCH  | /api/admin/alumni/{id}/approve      | admin+super_admin   | [DONE] |
| PATCH  | /api/admin/alumni/{id}/reject       | admin+super_admin   | [DONE] |
| GET    | /api/profile                        | user                | [TODO] |
| PATCH  | /api/profile                        | user                | [TODO] |
| POST   | /api/profile/photo                  | user                | [TODO] |
| GET    | /api/employment                     | user                | [TODO] |
| POST   | /api/employment                     | user                | [TODO] |
| PATCH  | /api/employment/{id}                | user                | [TODO] |
| DELETE | /api/employment/{id}                | user                | [TODO] |
| GET    | /api/industries                     | all auth            | [TODO] |
| GET    | /api/events                         | all auth            | [DONE] |
| POST   | /api/events                         | super_admin+admin   | [DONE] |
| PATCH  | /api/events/{id}                    | creator/super_admin | [DONE] |
| DELETE | /api/events/{id}                    | creator/super_admin | [DONE] |
| GET    | /api/announcements                  | all auth            | [DONE] |
| POST   | /api/announcements                  | super_admin+admin   | [DONE] |
| PATCH  | /api/announcements/{id}             | creator/super_admin | [DONE] |
| DELETE | /api/announcements/{id}             | creator/super_admin | [DONE] |

---

_Last updated: 2026-06 · Maintainer: Eze (eizey)_
_This file defines the FINAL state. Update status markers as features are completed._
