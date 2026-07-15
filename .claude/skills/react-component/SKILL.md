---
name: react-component
description: Generate a React JS component with Tailwind CSS for the admin web panel. Use this when creating any UI element, page, form, table, card, or layout for the bookbinding management system. Always applies the official design system and color palette.
---

## Bookbinding Admin Panel — React Component Generator

Always generate components that follow this design system exactly.

---

## 🎨 Official Color Palette

```js
// tailwind.config.js — extend with these
colors: {
  primary: {
    50:  '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',  // main brand
    600: '#4f46e5',  // buttons, CTA
    700: '#4338ca',  // hover states
    800: '#3730a3',  // dark accents
    900: '#312e81',  // navy headers
  },
  navy: {
    DEFAULT: '#1e1b4b',
    light: '#2d2a6e',
  },
  surface: {
    DEFAULT: '#f8fafc',  // page background
    card: '#ffffff',     // card background
    border: '#e2e8f0',   // borders/dividers
  },
  status: {
    success: '#22c55e',
    warning: '#f59e0b',
    error:   '#ef4444',
    info:    '#3b82f6',
  }
}
```

---

## 📐 Design Rules

- **Page background:** `bg-surface` (slate-50)
- **Cards:** `bg-white rounded-2xl shadow-sm border border-surface-border`
- **Primary buttons:** `bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2`
- **Secondary buttons:** `border border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg px-4 py-2`
- **Danger buttons:** `bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2`
- **Page headings:** `text-navy text-2xl font-bold`
- **Section headings:** `text-slate-700 text-lg font-semibold`
- **Body text:** `text-slate-600 text-sm`
- **Labels:** `text-slate-500 text-xs font-medium uppercase tracking-wide`
- **Input fields:** `border border-surface-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-full`
- **Table header:** `bg-primary-900 text-white text-xs uppercase tracking-wider`
- **Table rows:** `hover:bg-primary-50 border-b border-surface-border`
- **Sidebar:** `bg-navy text-white`
- **Active nav item:** `bg-primary-600 text-white rounded-lg`
- **Badges:** rounded-full, use status colors

---

## 🧩 Component Templates

### Standard Page Layout

```jsx
export default function PageName() {
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1e1b4b]">Page Title</h1>
          <p className="text-slate-500 text-sm mt-1">Subtitle or description</p>
        </div>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white 
                           px-4 py-2 rounded-lg text-sm font-medium 
                           flex items-center gap-2 transition-colors"
        >
          + Add New
        </button>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {/* content here */}
      </div>
    </div>
  );
}
```

### Data Table

```jsx
<div className="overflow-x-auto">
  <table className="w-full text-sm">
    <thead>
      <tr className="bg-[#312e81] text-white">
        <th className="px-4 py-3 text-left text-xs uppercase tracking-wider">
          Column
        </th>
      </tr>
    </thead>
    <tbody>
      {data.map((item) => (
        <tr
          key={item.id}
          className="border-b border-slate-200 hover:bg-indigo-50 transition-colors"
        >
          <td className="px-4 py-3 text-slate-600">{item.field}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### Form Card

```jsx
<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-2xl">
  <h2 className="text-lg font-semibold text-slate-700 mb-4">Form Title</h2>
  <div className="grid grid-cols-1 gap-4">
    <div>
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1">
        Field Label
      </label>
      <input
        className="border border-slate-200 rounded-lg px-3 py-2 text-sm 
                   focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                   outline-none w-full"
      />
    </div>
  </div>
  <div className="flex gap-3 mt-6">
    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
      Save
    </button>
    <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
      Cancel
    </button>
  </div>
</div>
```

### Status Badge

```jsx
// Usage: <StatusBadge status="pending" />
const statusStyles = {
  pending:    'bg-yellow-100 text-yellow-700',
  completed:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
  processing: 'bg-blue-100 text-blue-700',
}
<span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
  {status}
</span>
```

### Stat Card (Dashboard)

```jsx
<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
    Label
  </p>
  <p className="text-3xl font-bold text-[#1e1b4b] mt-1">0</p>
  <p className="text-xs text-slate-400 mt-1">supporting info</p>
</div>
```

---

## 📦 Bookbinding-Specific Components to Always Know

- **Order status flow:** `pending → processing → binding → quality check → ready → delivered`
- **Common entities:** Orders, Customers, Book Types, Materials, Binding Styles, Staff, Invoices
- **Admin pages:** Dashboard, Orders, Customers, Inventory, Reports, Settings
- **Key actions:** Create Order, Assign Staff, Update Status, Generate Invoice, Print Receipt

---

## ✅ Every Component Must Have

- Loading state (`isLoading` with spinner)
- Empty state (when no data)
- Error state (try/catch with error message)
- Responsive layout (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Transition animations (`transition-colors`, `transition-all duration-200`)
