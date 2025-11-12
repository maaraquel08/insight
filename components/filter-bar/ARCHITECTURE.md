# Filter Bar Architecture

## Component Hierarchy

```
FilterBar (Main Orchestrator)
│
├── Popover (Filter Builder)
│   │
│   ├── Step 1: AttributeSelection
│   │   ├── Input (Search)
│   │   └── Categorized Column List
│   │
│   ├── Step 2: OperatorSelection
│   │   ├── Header (with back button)
│   │   └── Operator List
│   │
│   └── Step 3: ValueSelection + FilterActions
│       ├── Header (with back button)
│       ├── Body (routes to input type)
│       │   ├── DateInput
│       │   │   ├── Single Date Picker
│       │   │   └── Date Range Picker
│       │   │
│       │   ├── NumberInput
│       │   │   ├── Single Number Input
│       │   │   └── Number Range Input
│       │   │
│       │   └── TextCheckboxList
│       │       └── Multi-select Checkboxes
│       │
│       └── Footer (FilterActions)
│           ├── Cancel Button
│           └── Apply Button
│
├── Active Filter Chips
│   └── ChipsFilter (for each filter)
│       ├── Icon
│       ├── Label
│       ├── Count Badge (optional)
│       └── Remove Button
│
├── Clear Filters Button (conditional)
│
└── Action Buttons
    ├── Share Button
    └── Download Button
```

## Data Flow

```
User Action
    ↓
FilterBar Event Handler
    ↓
Update FilterRule State
    ↓
Convert to Filter Format
    ↓
Update Context (setFilters)
    ↓
Re-render FilterBar
    ↓
Display Updated Chips
```

## State Management

```
┌─────────────────────────────────────┐
│         Filter Context              │
│  (Global state via React Context)   │
│                                     │
│  filters: Filter[]                  │
│  setFilters: (filters) => void      │
└─────────────────────────────────────┘
           ↑           ↓
           │           │
┌──────────┴───────────┴───────────────┐
│          FilterBar Component          │
│  (Local state for filter builder)    │
│                                      │
│  currentFilterRule: FilterRule       │
│  filterStep: "attribute" | "operator"│
│              | "value"               │
│  addFilterPopoverOpen: boolean       │
│  filterSearchTerm: string            │
└──────────────────────────────────────┘
```

## Three-Step Wizard Pattern

```
Step 1: ATTRIBUTE         Step 2: OPERATOR       Step 3: VALUE
┌─────────────────┐      ┌─────────────────┐   ┌─────────────────┐
│ Search Input    │      │ ← Back          │   │ ← Back          │
├─────────────────┤      │ "Employee ID"   │   │ "Employee ID"   │
│ Employee Info   │      ├─────────────────┤   ├─────────────────┤
│ • Employee ID   │──>   │ □ Equals        │──>│ ☑ Value1        │
│ • First Name    │      │ □ Contains      │   │ ☑ Value2        │
│ • Last Name     │      │ □ Starts With   │   │ □ Value3        │
│                 │      │ □ Ends With     │   ├─────────────────┤
│ Job Info        │      └─────────────────┘   │ Cancel | Apply  │
│ • Job Title     │                            └─────────────────┘
│ • Department    │
└─────────────────┘

filterRule.attribute     filterRule.operator     filterRule.value
```

## Type Detection & Routing

```
Selected Attribute
        ↓
Check Data Type
        ↓
    ┌───┴───┐
    │       │
  isDate  isNumeric  (else) isText
    │       │               │
    ↓       ↓               ↓
DateInput NumberInput TextCheckboxList
```

## File Dependency Graph

```
filter-bar.tsx (Legacy re-export)
        ↓
filter-bar/filter-bar.tsx ──────┐
        ↓                        │
        ├── types.ts ←───────────┤
        ├── utils.ts ←───────────┤
        ↓                        │
        ├── attribute-selection.tsx
        ├── operator-selection.tsx
        ├── value-selection.tsx ─┤
        ├── filter-actions.tsx   │
        └── value-inputs/        │
            ├── date-input.tsx ←─┤
            ├── number-input.tsx │
            └── text-checkbox-list.tsx
```

## Operator Decision Tree

```
                    Column Selected
                          │
                 ┌────────┴────────┐
                 │                 │
            isDateAttribute?   isNumericAttribute?
                 │                 │
            ┌────┴────┐       ┌────┴────┐
           Yes       No      Yes       No
            │                 │         │
    Date Operators    Numeric Operators  Text Operators
    • Equals          • Equals          • Equals
    • Before          • Greater Than    • Is not Equal
    • After           • Less Than
    • Between         • Between
```

## Filter Lifecycle

```
1. CREATE
   User clicks "Add Filter"
   → filterStep = "attribute"
   → User selects column
   → filterStep = "operator"
   → User selects operator
   → filterStep = "value"
   → User enters value(s)
   → User clicks "Apply"
   → Convert FilterRule to Filter
   → Add to filters array
   → Close popover

2. EDIT
   User clicks filter chip
   → Convert Filter to FilterRule
   → filterStep = "value" (skip to last step)
   → User modifies value
   → User clicks "Apply"
   → Update existing filter in array
   → Close popover

3. REMOVE
   User clicks X on chip
   → Remove from filters array
   → Re-render

4. CLEAR ALL
   User clicks "Clear Filters"
   → setFilters([])
   → Re-render
```

## Module Responsibilities

| Module                    | Responsibility                                    | Dependencies               |
| ------------------------- | ------------------------------------------------- | -------------------------- |
| `filter-bar.tsx`          | Main orchestration, state management, filter CRUD | All modules                |
| `types.ts`                | Type definitions                                  | None                       |
| `utils.ts`                | Helper functions, data type detection             | types.ts, data sources     |
| `attribute-selection.tsx` | Render searchable column list                     | utils.ts, types.ts         |
| `operator-selection.tsx`  | Render operator list                              | utils.ts, types.ts         |
| `value-selection.tsx`     | Route to input component                          | All value-inputs, utils.ts |
| `filter-actions.tsx`      | Cancel/Apply buttons                              | None                       |
| `value-inputs/*.tsx`      | Render specific input UI                          | utils.ts, types.ts         |

## Benefits of Modular Structure

### 1. **Maintainability**

-   Each component has a single responsibility
-   Changes are isolated to specific files
-   Easier to debug and test

### 2. **Reusability**

-   Input components can be used elsewhere
-   Utilities are shared across components
-   Types ensure consistency

### 3. **Scalability**

-   Easy to add new data types
-   Simple to extend operators
-   Can add new filter steps

### 4. **Readability**

-   Clear component hierarchy
-   Self-documenting structure
-   Logical file organization

### 5. **Performance**

-   Tree-shakable modules
-   Smaller bundle size
-   Better code splitting

## Adding New Features

### Example: Adding a Boolean Input Type

1. **Add type detection** (`utils.ts`):

```typescript
export function isBooleanAttribute(attribute: string): boolean {
    const column = findColumnById(attribute);
    return column?.format === "boolean";
}
```

2. **Add operators** (`utils.ts`):

```typescript
if (isBooleanAttribute) {
    return [
        { value: "is_true", label: "Is True" },
        { value: "is_false", label: "Is False" },
    ];
}
```

3. **Create component** (`value-inputs/boolean-input.tsx`):

```typescript
export function BooleanInput({ value, onChange }: Props) {
    return (
        <div className="p-4">
            <Button onClick={() => onChange("true")}>True</Button>
            <Button onClick={() => onChange("false")}>False</Button>
        </div>
    );
}
```

4. **Add routing** (`value-selection.tsx`):

```typescript
{isBoolean ? (
  <BooleanInput ... />
) : isDate ? ...}
```

Done! The new type is fully integrated.
