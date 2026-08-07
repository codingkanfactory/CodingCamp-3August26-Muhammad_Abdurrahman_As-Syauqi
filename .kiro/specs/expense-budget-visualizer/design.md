# Design Document: Expense & Budget Visualizer

## Introduction

This document describes the architecture and implementation approach for the Expense & Budget Visualizer application. The application is a mobile-friendly web app for tracking daily expenses with visualizations of spending patterns.

## System Architecture

### Overall Structure

The application follows a modular architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Form        │  │  Balance     │  │  Charts      │      │
│  │  Input       │  │  Display     │  │  Visual      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Transaction  │  │ Category     │  │ Filter/      │      │
│  │ Manager      │  │ Manager      │  │ Aggregator   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  LocalStorageAdapter                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Dependencies

```
UI Layer
   │
   ├── TransactionForm → TransactionManager → LocalStorageAdapter
   │                       ↑
   │                       │
   ├── CategoryManager ◄───┘
   │       ↑
   │       │
   ├── BalanceDisplay
   │
   ├── ChartContainer
   │       ↑
   │       │
   └── Filter/Aggregator ──► CategoryManager

Data Layer
   └── LocalStorageAdapter (shared by all managers)
```

## Data Models

### Transaction

```typescript
interface Transaction {
  id: string;              // UUID v4
  amount: number;          // Positive number, 0.01 - 999,999,999.99
  categoryId: string;      // Reference to category
  category: string;        // Category name (denormalized for easier display)
  date: string;            // ISO 8601 date string (YYYY-MM-DD)
  timestamp: number;       // Unix timestamp
}
```

### Category

```typescript
interface Category {
  id: string;              // UUID v4
  name: string;            // 1-50 chars, no whitespace-only
}
```

### Storage Schema

```typescript
interface StorageState {
  transactions: Transaction[];
  categories: Category[];
}
```

## Component Structure

### 1. TransactionManager

**Responsibilities:**
- Create new transactions
- Delete existing transactions
- Validate transaction data
- Retrieve all transactions
- Filter transactions by date range

**Key Methods:**
- `createTransaction(amount, categoryId, date)`: Create and store a new transaction
- `deleteTransaction(id)`: Remove a transaction from storage
- `getAllTransactions()`: Retrieve all transactions sorted by date descending
- `getTransactionsByDate(date)`: Filter transactions for a specific date
- `getTransactionsByMonth(year, month)`: Filter transactions for a month

**Validation Rules:**
- Amount: positive number, 0.01 - 999,999,999.99
- Category: must exist
- Date: valid date string

### 2. CategoryManager

**Responsibilities:**
- Create new categories
- Retrieve all categories
- Validate category names
- Ensure unique category names
- Provide default "General" category

**Key Methods:**
- `createCategory(name)`: Create and store a new category
- `getAllCategories()`: Retrieve all categories
- `getDefaultCategory()`: Get or create the default "General" category
- `categoryExists(name)`: Check if a category name already exists

**Validation Rules:**
- Name: 1-50 characters
- No whitespace-only names
- No duplicate names

### 3. BalanceCalculator

**Responsibilities:**
- Calculate total balance from all transactions
- Format balance for display

**Key Methods:**
- `calculateBalance(transactions)`: Sum all transaction amounts
- `formatBalance(amount)`: Format number to 2 decimal places

### 4. ChartAggregator

**Responsibilities:**
- Aggregate expenses by category
- Calculate percentages for chart visualization
- Handle empty data cases

**Key Methods:**
- `aggregateByCategory(transactions)`: Group transactions by category
- `calculatePercentages(aggregated)`: Calculate percentage for each category
- `formatChartData(aggregated, percentages)`: Prepare data for Chart.js

### 5. StorageAdapter

**Responsibilities:**
- Read/write data to localStorage
- Handle storage errors gracefully
- Provide default initial state

**Key Methods:**
- `loadData()`: Retrieve data from localStorage or return default
- `saveData(state)`: Store state to localStorage
- `clearData()`: Clear all stored data

## UI Structure

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     Header Section                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Expense & Budget Visualizer            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                  Balance Display Card                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Total Balance: $0.00                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│              Transaction Input Form                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Amount] [Category ▼] [Date] [Add ▼]              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│            Category Management (Collapsible)                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Categories: [General ▼] [+]                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│              Time Period Selector                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Today] [This Month]                               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                  Chart Container                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                     Pie Chart                       │   │
│  │                                                     │   │
│  │         [Chart Canvas or Message]                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│               Transaction History List                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Transaction 1] [Delete]                           │   │
│  │  [Transaction 2] [Delete]                           │   │
│  │  ...                                                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout (≤768px)

The layout adapts for touch interaction:
- Input fields become full-width
- Buttons increase to minimum 44x44px tap area
- Stack all sections vertically
- Increase spacing between interactive elements

## Data Flow

### Creating a Transaction

```
User Input → Form Validation → CategoryManager.checkExists()
                                     ↓
                              TransactionManager.create()
                                     ↓
                              StorageAdapter.saveData()
                                     ↓
                              Update UI: Balance, Charts, List
```

### Loading Application

```
App Load → StorageAdapter.loadData()
                ↓
    ┌───────────┴───────────┐
    ↓                       ↓
TransactionManager      CategoryManager
    ↓                       ↓
Update List              Set Categories
    ↓
Update Balance & Charts
```

### Deleting a Transaction

```
Delete Click → TransactionManager.delete()
                    ↓
              StorageAdapter.saveData()
                    ↓
              Update UI: Balance, Charts, List
```

## Chart Implementation

### Chart Library: Chart.js

**Why Chart.js:**
- Lightweight and well-documented
- Supports responsive canvas rendering
- Good mobile performance
- Supports pie/doughnut charts for expense visualization

### Chart Configuration

```javascript
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 12,
        padding: 15
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.label}: $${context.raw.toFixed(2)} (${context.pct.toFixed(1)}%)`;
        }
      }
    }
  },
  scales: {}
};
```

### Chart Data Format

```javascript
const chartData = {
  labels: ['Food', 'Transport', 'Utilities', ...],
  datasets: [{
    data: [150.00, 75.50, 200.00, ...],
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', ...],
    hoverOffset: 4
  }]
};
```

### Empty State Handling

When no data is available:
- Display "No data available for [time period]" message
- Show placeholder illustration or icon
- Keep chart container visible but empty

## State Management

### State Structure

```typescript
interface AppState {
  transactions: Transaction[];
  categories: Category[];
  selectedTimePeriod: 'today' | 'thisMonth';
  error: string | null;
  isCategoryManagerOpen: boolean;
}
```

### State Updates

State is updated synchronously in response to:
- User actions (form submission, deletion)
- Data persistence (after storage operations)
- View changes (time period selection)

### Persistence Strategy

- **On Write**: Immediately save to localStorage after any mutation
- **On Load**: Retrieve from localStorage on app initialization
- **Error Handling**: If localStorage fails, continue with empty state

## Error Handling Strategy

### Error Categories

1. **Validation Errors**
   - Display inline error messages
   - Prevent form submission
   - Highlight invalid fields

2. **Storage Errors**
   - Catch localStorage exceptions
   - Display user-friendly error message
   - Continue operation with in-memory state

3. **Data Errors**
   - Handle missing/invalid data gracefully
   - Use fallback values where possible
   - Log errors for debugging

### Error Message Display

```css
.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  padding: 0.5rem;
  background-color: #f8d7da;
  border-radius: 0.25rem;
}
```

### Error Scenarios

| Scenario | Handling |
|----------|----------|
| Invalid amount | Show "Amount must be between $0.01 and $999,999,999.99" |
| Duplicate category | Show "Category already exists" |
| Empty category name | Show "Category name is required" |
| localStorage unavailable | Show "Data storage unavailable. Changes won't be saved." |
| No data for chart | Show "No expenses for this period" |

## Responsive Design

### Breakpoints

- **Mobile**: ≤768px (touch-optimized)
- **Tablet/Desktop**: >768px (standard layout)

### Mobile Optimizations

```css
@media (max-width: 768px) {
  /* Full-width inputs */
  .input-field {
    width: 100%;
  }
  
  /* Larger touch targets */
  .btn {
    min-width: 44px;
    min-height: 44px;
    padding: 12px;
  }
  
  /* Stack layout */
  .form-row {
    flex-direction: column;
  }
  
  /* Increased spacing */
  .card {
    margin-bottom: 1rem;
  }
}
```

### Touch Targets

All interactive elements meet or exceed 44x44px:
- Form submission buttons
- Delete buttons
- Category dropdown
- Time period tabs
- Chart legend items

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Transaction Amount Validation

*For any* transaction input, if the amount is outside the valid range (0.01 to 999,999,999.99), the system shall reject the transaction and display an error message.

**Validates: Requirements 1.2, 1.3**

### Property 2: Transaction Preservation

*For any* valid transaction that is created, storing the transaction and then retrieving all transactions shall include the newly created transaction with all its fields intact.

**Validates: Requirements 1.1, 7.1**

### Property 3: Transaction Deletion

*For any* transaction that exists in the system, deleting that transaction shall remove it from storage and ensure it no longer appears in the transaction list.

**Validates: Requirements 3.3, 7.4**

### Property 4: Transaction Sorting

*For any* set of transactions stored in the system, retrieving all transactions shall return them sorted by date in descending order (most recent first).

**Validates: Requirements 3.1**

### Property 5: Balance Calculation

*For any* set of transactions, the balance displayed by the system shall equal the sum of all transaction amounts, formatted to two decimal places.

**Validates: Requirements 4.1, 4.2**

### Property 6: Category Uniqueness

*For any* category creation attempt, if a category with the same name already exists, the system shall reject the creation and display an error message.

**Validates: Requirements 2.4**

### Property 7: Category Validation

*For any* category name input, if the name is less than 1 character, more than 50 characters, or contains only whitespace, the system shall reject the category creation.

**Validates: Requirements 2.3**

### Property 8: Default Category

*For any* system state where no categories exist, retrieving categories shall return at least one category named "General".

**Validates: Requirements 2.1**

### Property 9: Daily Chart Accuracy

*For any* set of transactions, when the "Today" time period is selected, the chart shall display only expenses from the current day, aggregated by category with correct percentages.

**Validates: Requirements 5.1, 5.2, 5.3**

### Property 10: Monthly Chart Accuracy

*For any* set of transactions, when the "This Month" time period is selected, the chart shall display only expenses from the current month and year, aggregated by category with correct percentages.

**Validates: Requirements 6.1, 6.2**

### Property 11: Chart Empty State

*For any* time period with no matching expenses, the chart section shall display a message indicating no data is available for that period.

**Validates: Requirements 5.4, 6.3**

### Property 12: Data Persistence

*For any* transaction or category that is created, stored, or deleted, the operation shall be immediately persisted to localStorage and survive browser refresh or closure.

**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

### Property 13: Mobile Touch Targets

*For any* screen with a width of 768 pixels or less, all interactive elements shall have a minimum tap area of 44 by 44 pixels.

**Validates: Requirements 8.1, 8.2**

### Property 14: Local Storage Error Handling

*For any* localStorage operation that fails, the system shall display an error message to the user and continue operation with a clean state.

**Validates: Requirements 9.1**

### Property 15: Non-numeric Amount Rejection

*For any* non-numeric value entered as an amount, the system shall display an error message and prevent transaction creation.

**Validates: Requirements 9.2**

### Property 16: Zero/Negative Amount Rejection

*For any* zero or negative value entered as an amount, the system shall display an error message and prevent transaction creation.

**Validates: Requirements 9.3**