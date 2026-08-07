# Design Document: Expense & Budget Visualizer

## 1. System Overview

### 1.1 Architecture Pattern
**Type:** Client-Side Single Page Application (SPA)  
**Paradigm:** Event-Driven Architecture  
**State Management:** Centralized state object with localStorage persistence  
**Rendering:** Imperative DOM manipulation (Vanilla JS)

### 1.2 Technology Stack
- **HTML5:** Semantic markup with BEM naming
- **CSS3:** Custom properties (variables), Flexbox, Grid
- **JavaScript (ES6+):** Strict mode, modular functions
- **Chart.js 4.4.3:** Data visualization
- **Lucide Icons:** Icon library
- **Google Fonts:** Poppins typography

### 1.3 Key Design Principles
1. **Progressive Enhancement:** Core functionality works without JS fallback
2. **Mobile-First:** Design starts from smallest viewport
3. **Accessibility:** ARIA labels, keyboard navigation, semantic HTML
4. **Performance:** Minimal dependencies, lazy rendering where possible
5. **Maintainability:** Clear separation of concerns, BEM naming, modular functions

---

## 2. Data Architecture

### 2.1 State Management

**Central State Object:**
```javascript
let state = {
  transactions: [],      // Array<Transaction>
  customCategories: [],  // Array<Category>
  theme: 'light',        // 'light' | 'dark'
  sortPreference: 'newest',  // 'newest' | 'oldest' | 'highest' | 'lowest' | 'category'
  threshold: 0,          // number (Rupiah)
};
```


**State Update Flow:**
```
User Action → Event Handler → Update State → saveAll() → renderAll()
```

### 2.2 Data Models

#### Transaction Model
```javascript
{
  id: string,        // uid() - timestamp36 + random36
  name: string,      // User-entered transaction name
  amount: number,    // Positive number (Rupiah)
  date: string,      // ISO format YYYY-MM-DD
  category: string   // Category name reference
}
```

#### Category Model
```javascript
{
  name: string,      // Unique category name (max 30 chars)
  icon: string       // Lucide icon name (e.g., 'utensils', 'bus')
}
```

#### Built-in Categories
```javascript
const BASE_CATEGORIES = [
  { name: 'Makanan',       icon: 'utensils' },
  { name: 'Transportasi',  icon: 'bus' },
  { name: 'Hiburan',       icon: 'gamepad-2' },
];
```


#### Custom Category Icons (Rotating)
```javascript
const CUSTOM_ICONS = [
  'tag', 'shopping-bag', 'heart-pulse', 'book-open', 'laptop',
  'dumbbell', 'plane', 'gift', 'wrench', 'lightbulb'
];
// Icon assigned: CUSTOM_ICONS[index % 10]
```

### 2.3 LocalStorage Schema

**Storage Keys:**
- `ebv_transactions` → JSON.stringify(transactions[])
- `ebv_custom_categories` → JSON.stringify(customCategories[])
- `ebv_theme` → 'light' | 'dark'
- `ebv_sort_preference` → sort option string
- `ebv_threshold` → number as string

**Persistence Strategy:**
- Write: After every state-modifying operation
- Read: Once on application initialization
- Error Handling: Try-catch with fallback to defaults

---

## 3. Visual Design System

### 3.1 Color Palette

#### Light Theme
```css
--bg-page: #f0f9f8;          /* Soft teal background */
--bg-card: #ffffff;          /* Pure white cards */
--bg-input: #f0fdf9;         /* Light teal inputs */
--bg-hover: #f0fdfa;         /* Hover state */

--text-primary: #0f172a;     /* Almost black */
--text-secondary: #475569;   /* Medium gray */
--text-muted: #94a3b8;       /* Light gray */

--accent: #14b8a6;           /* Teal primary */
--accent-hover: #0d9488;     /* Darker teal */
--accent-light: #ccfbf1;     /* Very light teal */

--danger: #ef4444;           /* Red */
--warning: #f59e0b;          /* Amber */
--success: #10b981;          /* Green */
```


#### Dark Theme
```css
--bg-page: #0a0f14;          /* Very dark blue-gray */
--bg-card: #151b23;          /* Dark card background */
--bg-input: #1f2937;         /* Darker input fields */
--bg-hover: #1f2937;         /* Hover state */

--text-primary: #f1f5f9;     /* Almost white */
--text-secondary: #cbd5e1;   /* Light gray */
--text-muted: #64748b;       /* Medium gray */

--accent: #14b8a6;           /* Teal (same as light) */
--accent-hover: #2dd4bf;     /* Brighter teal */
--accent-light: #134e4a;     /* Dark teal */

--danger: #f87171;           /* Light red */
--warning: #fbbf24;          /* Light amber */
--success: #34d399;          /* Light green */
```

#### Balance Card Gradients
```css
/* Light Mode */
--balance-bg: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);

/* Dark Mode */
--balance-bg: linear-gradient(135deg, #0f766e 0%, #115e59 100%);
```

#### Chart Color Palette (16 Colors)
```javascript
const CHART_PALETTE = [
  '#FF6B6B',  // Bright Red
  '#4ECDC4',  // Turquoise
  '#45B7D1',  // Sky Blue
  '#FFA07A',  // Light Salmon
  '#98D8C8',  // Mint
  '#F7DC6F',  // Yellow
  '#BB8FCE',  // Purple
  '#85C1E2',  // Light Blue
  '#F8B195',  // Peach
  '#52B788',  // Green
  '#F72585',  // Magenta
  '#7209B7',  // Deep Purple
  '#F77F00',  // Orange
  '#06FFA5',  // Bright Cyan
  '#FF006E',  // Hot Pink
  '#8338EC',  // Electric Purple
];
```


### 3.2 Typography

**Font Family:**
```css
--font: 'Poppins', sans-serif;
```

**Font Weights & Usage:**
- 300 (Light): Reserved for decorative text
- 400 (Regular): Body text, labels
- 500 (Medium): Chart legends, subtle emphasis
- 600 (Semi-Bold): Form labels, buttons, transaction names
- 700 (Bold): Card titles, amounts, emphasis
- 800 (Extra-Bold): Balance card main amount

**Font Sizes:**
- Balance amount: clamp(2.5rem, 6vw, 3.5rem)
- Card titles: 0.95rem
- Transaction amount: 0.92rem
- Body text: 0.88-0.9rem
- Small text (meta): 0.72-0.75rem
- Tiny text (counts): 0.72rem

**Line Height:**
- Body: 1.6
- Headings: 1.1-1.2
- Buttons: 1

### 3.3 Spacing & Sizing

**Border Radius:**
```css
--radius-sm: 0.75rem;   /* Inputs, buttons, small elements */
--radius-md: 1rem;      /* Cards, modals */
--radius-lg: 1.25rem;   /* Balance card */
```


**Box Shadows:**
```css
--shadow-sm: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06);
--shadow-md: 0 4px 6px rgba(0,0,0,.07), 0 2px 4px rgba(0,0,0,.06);
--shadow-lg: 0 10px 15px rgba(0,0,0,.1), 0 4px 6px rgba(0,0,0,.05);

/* Balance card special shadow */
box-shadow: 0 20px 40px rgba(20,184,166,0.3), 0 10px 20px rgba(0,0,0,0.15);
```

**Transitions:**
```css
--transition: 0.2s ease;  /* Default for most properties */
```

**Container & Layout:**
- Max-width: 1100px (centered)
- Padding: 24px 20px 48px (desktop), 16px 14px 40px (mobile)
- Grid gap: 20px
- Card padding: 20px (desktop), 16px (mobile)

---

## 4. Component Architecture

### 4.1 Premium Bank-Style Balance Card

**HTML Structure:**
```
.balance-card
├── .balance-card__header
│   ├── .balance-card__chip (golden icon)
│   └── .balance-card__date
├── .balance-card__main
│   ├── .balance-card__label
│   └── .balance-card__amount (large total)
├── .balance-card__grid (2x2)
│   ├── .balance-card__stat (Hari Ini)
│   ├── .balance-card__stat (Rata-rata)
│   ├── .balance-card__stat (Transaksi)
│   └── .balance-card__stat (Bulan Ini)
└── .balance-card__number (card decoration)
```


**Visual Effects:**
- 3-layer gradient background (135deg teal)
- Glassmorphism overlay (radial gradients)
- Shine effect (diagonal gradient overlay)
- Hover lift animation (translateY -2px)
- Box shadow depth enhancement on hover
- Golden chip with gradient (#fbbf24 → #f59e0b)

**Data Calculations:**
```javascript
Total: sum(transactions.amount)
Today: sum(transactions.amount WHERE date = today)
Month: sum(transactions.amount WHERE date starts with current YYYY-MM)
Average: total / transactions.length
Count: transactions.length
```

### 4.2 Transaction Form

**HTML Structure:**
```
<form id="transactionForm">
├── .form__group (itemName)
│   ├── <label> + <input type="text">
│   └── .error-msg
├── .form__group (itemAmount)
│   ├── <label> + <input type="number">
│   └── .error-msg
├── .form__group (itemDate)
│   ├── <label> + <input type="date">
│   └── .error-msg
├── .form__group (itemCategory)
│   ├── <label> + <select>
│   └── .error-msg
└── <button type="submit" class="btn--primary">
```

