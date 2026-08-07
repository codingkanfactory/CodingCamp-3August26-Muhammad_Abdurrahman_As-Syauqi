# Requirements Document: Expense & Budget Visualizer

## 1. Introduction

### 1.1 Purpose
This document defines the functional and non-functional requirements for the Expense & Budget Visualizer - a client-side web application that enables users to track, visualize, and analyze personal expenses with bank-style UI design.

### 1.2 Scope
The application provides expense tracking, category management, data visualization, theme customization, and real-time statistical calculations with localStorage persistence.

### 1.3 Target Users
- Individuals managing personal finances
- Users seeking visual expense insights
- Anyone needing simple budget tracking without backend complexity

---

## 2. Functional Requirements (EARS Format)

### REQ-1: Premium Bank-Style Balance Card Display
**Category:** UI  
**Priority:** Must Have

**EARS Description:**  
WHEN the application loads, the system SHALL display a premium bank-style card with gradient teal background showing:
- Golden chip icon (credit-card Lucide icon)
- Live formatted date (e.g., "Jumat, 7 Agustus 2026")
- Total Pengeluaran (main balance amount)
- 2x2 glassmorphism grid displaying: Hari Ini, Rata-rata, Transaksi, Bulan Ini
- Card number decoration ("•••• •••• •••• 2026")

**Acceptance Criteria:**
1. Card displays with 3-layer teal gradient (135deg: #14b8a6 → #0d9488 → #0f766e)
2. Golden chip uses linear gradient (#fbbf24 → #f59e0b)
3. Date updates live with Indonesian locale (day name + date + month + year)
4. All four stat boxes have glassmorphism effect (backdrop-filter blur)
5. Card shows hover animation with lift effect (translateY -2px)
6. Shine overlay effect visible on card surface

---

### REQ-2: Vibrant Colorful Chart Visualization
**Category:** UI  
**Priority:** Must Have

**EARS Description:**  
WHEN transactions exist, the system SHALL render a Chart.js doughnut chart using a 16-color vibrant palette to display expense distribution by category.

**Acceptance Criteria:**
1. Chart uses Chart.js v4.4.3 doughnut type
2. 16 distinct colors applied: #FF6B6B, #4ECDC4, #45B7D1, #FFA07A, #98D8C8, #F7DC6F, #BB8FCE, #85C1E2, #F8B195, #52B788, #F72585, #7209B7, #F77F00, #06FFA5, #FF006E, #8338EC
3. Colors rotate cyclically if categories exceed 16
4. Empty state message displayed when no transactions exist
5. Tooltip shows formatted Rupiah amount and percentage
6. Legend positioned at bottom with Poppins font

---

### REQ-3: Transaction CRUD Operations
**Category:** Functional  
**Priority:** Must Have

**EARS Description:**  
WHEN the user submits the transaction form, the system SHALL validate all fields and, IF valid, add the transaction with a unique ID, THEN update all displays and persist to localStorage.

**Acceptance Criteria:**
1. Add transaction: Creates transaction with {id, name, amount, date, category}
2. Unique ID generated using timestamp + random string
3. Transaction added to beginning of transactions array (newest first)
4. Delete transaction: Removes transaction by ID from state
5. Clear all: Removes all transactions after confirmation
6. All operations trigger renderAll() and saveAll()
7. Success/failure toast notifications shown

---

### REQ-4: Category Management System
**Category:** Functional  
**Priority:** Must Have

**EARS Description:**  
WHILE using the application, the system SHALL provide 3 built-in categories (Makanan, Transportasi, Hiburan) and allow users to create up to 30-character custom categories with rotating Lucide icons.

**Acceptance Criteria:**
1. Built-in categories: Makanan (utensils), Transportasi (bus), Hiburan (gamepad-2)
2. Custom category input limited to 30 characters
3. Duplicate detection (case-insensitive)
4. Custom categories assigned rotating icons from: tag, shopping-bag, heart-pulse, book-open, laptop, dumbbell, plane, gift, wrench, lightbulb
5. Custom categories deletable individually
6. Category dropdown updates automatically after add/delete
7. Deleted category transactions remain unchanged

---

### REQ-5: Sorting Functionality
**Category:** Functional  
**Priority:** Should Have

**EARS Description:**  
WHEN the user selects a sort option, the system SHALL reorder transactions according to: Newest (default), Oldest, Highest, Lowest, or Category, and persist the preference.

**Acceptance Criteria:**
1. Five sort options available in dropdown
2. Newest: Date descending (default state order)
3. Oldest: Date ascending (oldest first)
4. Highest: Amount descending (highest first)
5. Lowest: Amount ascending (lowest first)
6. Category: Alphabetical by category name
7. Sort preference saved to localStorage (STORAGE_KEY_SORT)
8. Sort preference restored on page load

---

### REQ-6: Expense Threshold Highlighting
**Category:** UI  
**Priority:** Should Have

**EARS Description:**  
WHEN the user enters a threshold amount, the system SHALL highlight transactions exceeding that amount with warning colors and pulse animation.

**Acceptance Criteria:**
1. Threshold input accepts numbers ≥ 0
2. Transactions with amount > threshold get class "highlight-threshold"
3. Highlighted items display warning background (--warning-light)
4. Highlighted items display warning border (--warning)
5. Pulse animation applied to highlighted items (1.5s ease-in-out)
6. Threshold value saved to localStorage (STORAGE_KEY_THRESH)
7. Threshold value restored on page load

---

### REQ-7: Dark/Light Mode Toggle
**Category:** UI  
**Priority:** Should Have

**EARS Description:**  
WHEN the user clicks the theme toggle button, the system SHALL switch between light and dark themes, update the icon, and persist the choice to localStorage.

**Acceptance Criteria:**
1. Toggle button switches between moon (light mode) and sun (dark mode) icons
2. Theme applied via data-theme attribute on <html>
3. Light theme: Fresh teal colors, white backgrounds
4. Dark theme: Deep teal colors, dark backgrounds
5. CSS variables updated for both themes
6. Chart text color adapts to theme
7. Theme preference saved to localStorage (STORAGE_KEY_THEME)
8. Theme preference restored on page load
9. Smooth transitions (0.2s ease) on theme switch

---

### REQ-8: LocalStorage Persistence
**Category:** Data  
**Priority:** Must Have

**EARS Description:**  
WHEN any data changes occur, the system SHALL save all state (transactions, custom categories, theme, sort preference, threshold) to localStorage using designated keys.

**Acceptance Criteria:**
1. Storage keys defined: ebv_transactions, ebv_custom_categories, ebv_theme, ebv_sort_preference, ebv_threshold
2. saveAll() function writes all state properties to localStorage
3. loadAll() function reads all state properties on initialization
4. JSON serialization/deserialization for complex data
5. Error handling for localStorage failures (console warning)
6. Fallback to default values if localStorage read fails
7. Data persists across browser sessions

---

### REQ-9: Form Validation
**Category:** Functional  
**Priority:** Must Have

**EARS Description:**  
WHEN the user submits the transaction form, IF any field is invalid, the system SHALL display inline error messages, apply error styling, and prevent submission.

**Acceptance Criteria:**
1. Nama Item: Required, must be non-empty after trim
2. Jumlah: Required, must be number > 0
3. Tanggal: Required, must be selected
4. Kategori: Required, must be selected from dropdown
5. Error messages displayed below each invalid field
6. Error styling (red border, red text) applied to invalid fields
7. Error states cleared on user interaction (input/change events)
8. Form submission blocked if any validation fails
9. Custom category: Duplicate check, empty check

---

### REQ-10: Mobile-First Responsive Design
**Category:** UI  
**Priority:** Must Have

**EARS Description:**  
WHERE the viewport width changes, the system SHALL adapt the layout using breakpoints: Mobile (<480px), Tablet (480-768px), Desktop (>768px).

**Acceptance Criteria:**
1. Mobile (<480px): Single column, reduced padding, smaller fonts
2. Tablet (480-768px): Single column, standard spacing
3. Desktop (>768px): 2-column grid (1fr 1.4fr ratio)
4. Balance card responsive: Padding adjusts, grid maintains 2x2
5. Chart wrapper max-width: 280px, centered
6. Transaction list scrollable with max-height
7. Controls row wraps on small screens
8. Touch-friendly button sizes (min 38px)
9. Readable font sizes at all breakpoints

---

### REQ-11: Monthly Summary Aggregation
**Category:** Functional  
**Priority:** Should Have

**EARS Description:**  
WHEN transactions exist, the system SHALL aggregate spending by month (YYYY-MM format), display month name in Indonesian, show transaction count, and sort descending.

**Acceptance Criteria:**
1. Transactions grouped by YYYY-MM key extracted from date
2. Each month shows: Indonesian month name + year (e.g., "Januari 2025")
3. Each month shows: Total amount in Rupiah
4. Each month shows: Transaction count (e.g., "5 transaksi")
5. Months sorted descending (newest month first)
6. Empty state when no transactions exist
7. List scrollable with max-height: 240px

---

### REQ-12: Real-Time Date Display
**Category:** UI  
**Priority:** Nice to Have

**EARS Description:**  
WHEN the page loads, the system SHALL display the current date in Indonesian format on the balance card header.

**Acceptance Criteria:**
1. Format: "DayName, Day Month Year" (e.g., "Jumat, 7 Agustus 2026")
2. Indonesian day names: Minggu, Senin, Selasa, Rabu, Kamis, Jumat, Sabtu
3. Indonesian month names: Januari through Desember
4. Date updates on page load (not real-time ticking)
5. Displayed in balance-card__date element

---

### REQ-13: Lucide Icons Integration
**Category:** UI  
**Priority:** Should Have

**EARS Description:**  
WHERE icons are needed, the system SHALL use Lucide icons loaded from CDN with createIcons() initialization.

**Acceptance Criteria:**
1. Lucide script loaded from unpkg.com/lucide@latest
2. Icons specified via data-lucide attributes
3. lucide.createIcons() called on init and after dynamic content updates
4. Icons used: wallet, moon, sun, credit-card, plus, trash-2, alert-circle, arrow-down-up, gamepad-2, bus, utensils, and custom category icons
5. Icon sizes specified inline or via CSS (14px-28px range)

---

### REQ-14: Poppins Font Typography
**Category:** UI  
**Priority:** Should Have

**EARS Description:**  
WHERE text is rendered, the system SHALL use Poppins font from Google Fonts with weights 300-800.

**Acceptance Criteria:**
1. Poppins loaded from Google Fonts CDN
2. Weights available: 300, 400, 500, 600, 700, 800
3. Font applied via CSS variable: --font: 'Poppins', sans-serif
4. Display=swap parameter used for performance
5. Preconnect hints for fonts.googleapis.com and fonts.gstatic.com
6. Fallback to sans-serif if load fails

---

### REQ-15: BEM Naming Convention
**Category:** Code Quality  
**Priority:** Should Have

**EARS Description:**  
WHERE CSS classes are defined, the system SHALL follow BEM (Block__Element--Modifier) naming convention throughout the codebase.

**Acceptance Criteria:**
1. Blocks: app-header, balance-card, card, form, transaction-item, etc.
2. Elements: balance-card__header, balance-card__chip, tx-icon, tx-body, etc.
3. Modifiers: is-error, highlight-threshold, show (for toast)
4. No nesting beyond BEM structure
5. Consistent naming throughout HTML, CSS, and JS
6. Class names self-documenting and semantic

---

## 3. Non-Functional Requirements

### NFR-1: Performance
**Priority:** Should Have
- Page load time: < 2 seconds on standard broadband
- UI interactions (add/delete): < 100ms response time
- Chart render time: < 500ms for up to 100 transactions
- localStorage operations: < 50ms

### NFR-2: Browser Compatibility
**Priority:** Must Have
- Modern browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile browsers: iOS Safari 14+, Chrome Mobile 90+
- No IE11 support required

### NFR-3: Accessibility
**Priority:** Should Have
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader compatible
- Sufficient color contrast (WCAG AA)
- Focus indicators visible

### NFR-4: Data Storage
**Priority:** Must Have
- LocalStorage limit: ~5MB (sufficient for ~10,000 transactions)
- No external database required
- Data loss acceptable if localStorage cleared by user
- No sensitive data encryption needed

### NFR-5: Code Maintainability
**Priority:** Should Have
- Vanilla JavaScript (no framework dependencies)
- Modular function structure
- Clear commenting for complex logic
- BEM for CSS organization
- Consistent code formatting

---

## 4. Data Models

### 4.1 Transaction
```javascript
{
  id: string,        // Unique ID (timestamp + random)
  name: string,      // Transaction name (max 255 chars)
  amount: number,    // Amount in Rupiah (positive integer)
  date: string,      // ISO date format (YYYY-MM-DD)
  category: string   // Category name
}
```

### 4.2 Category
```javascript
{
  name: string,      // Category name (max 30 chars)
  icon: string       // Lucide icon name
}
```

### 4.3 Application State
```javascript
{
  transactions: Array<Transaction>,        // All transactions
  customCategories: Array<Category>,       // User-defined categories
  theme: 'light' | 'dark',                 // Current theme
  sortPreference: string,                  // Sort option (5 choices)
  threshold: number                        // Alert threshold (Rupiah)
}
```

---

## 5. External Dependencies

### 5.1 Required Libraries
- **Chart.js v4.4.3** (MIT License) - Doughnut chart visualization
- **Lucide Icons** (ISC License) - Icon library
- **Google Fonts Poppins** (OFL) - Typography

### 5.2 CDN Resources
- Chart.js: cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js
- Lucide: unpkg.com/lucide@latest
- Poppins: fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800

---

## 6. Constraints & Assumptions

### 6.1 Constraints
- Client-side only (no backend)
- localStorage browser limit (~5MB)
- No user authentication
- No data export/import features
- Single currency (Indonesian Rupiah)

### 6.2 Assumptions
- Users have modern browsers with JavaScript enabled
- Users have localStorage enabled
- Users understand basic expense tracking concepts
- No multi-user or synchronization needed
- Desktop and mobile access patterns similar

---

## 7. Success Metrics

1. **Usability:** User can add first transaction within 30 seconds
2. **Performance:** Chart renders within 500ms for 50 transactions
3. **Reliability:** No data loss after 100 add/delete operations
4. **Accessibility:** All actions completable via keyboard
5. **Responsiveness:** Functional on screens 320px - 2560px wide

---

## 8. Glossary

- **BEM:** Block Element Modifier (CSS naming convention)
- **EARS:** Easy Approach to Requirements Syntax
- **Glassmorphism:** UI design with frosted glass effect
- **localStorage:** Browser storage API for persistent data
- **Lucide:** Open-source icon library
- **Rupiah (Rp):** Indonesian currency
- **Toast:** Temporary notification message

---

**Document Version:** 1.0  
**Last Updated:** 2025  
**Status:** Complete Implementation
