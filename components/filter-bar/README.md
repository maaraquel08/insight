# Filter Bar Component

A modular, three-step filter builder for data tables. This component provides an intuitive UI for creating complex filters with attribute selection, operator selection, and value input.

## Architecture

The Filter Bar follows a modular architecture with clear separation of concerns:

### Directory Structure

```
components/filter-bar/
├── filter-bar.tsx              # Main orchestration component
├── types.ts                    # TypeScript type definitions
├── utils.ts                    # Helper functions and utilities
├── index.ts                    # Public API exports
├── attribute-selection.tsx     # Step 1: Attribute selection
├── operator-selection.tsx      # Step 2: Operator selection
├── value-selection.tsx         # Step 3: Value input coordinator
├── filter-actions.tsx          # Cancel/Apply buttons
└── value-inputs/
    ├── date-input.tsx          # Date picker input
    ├── number-input.tsx        # Number range input
    └── text-checkbox-list.tsx  # Multi-select checkboxes
```

## Components

### Main Component: `FilterBar`

The main orchestrator that manages the three-step filter creation process.

**Features:**
- Three-step wizard (attribute → operator → value)
- Visual filter chips display
- Edit and remove filters
- Clear all filters
- Duplicate prevention

**Usage:**
```tsx
import { FilterBar } from "@/components/filter-bar";

function MyPage() {
  return <FilterBar />;
}
```

### Step Components

#### 1. AttributeSelection

Displays a searchable, categorized list of available columns.

**Props:**
- `searchTerm`: Current search value
- `onSearchChange`: Search handler
- `onSelectAttribute`: Selection handler

#### 2. OperatorSelection

Shows operators based on the selected attribute's data type.

**Props:**
- `attributeId`: Selected column ID
- `onBack`: Back navigation handler
- `onSelectOperator`: Operator selection handler

#### 3. ValueSelection

Routes to the appropriate input component based on data type.

**Props:**
- `filterRule`: Current filter being built
- `onBack`: Back navigation handler
- `onValueChange`: Value change handler
- `onValue2Change`: Second value handler (for "between")

### Value Input Components

#### DateInput

Calendar-based date picker with support for single date and date ranges.

#### NumberInput

Number input fields with support for single value and ranges (min/max).

#### TextCheckboxList

Multi-select checkbox list populated from dataset values.

## Utilities

### Type Detection

- `isDateAttribute(attribute)` - Checks if column is a date field
- `isNumericAttribute(attribute)` - Checks if column is numeric

### Data Access

- `getAvailableColumns()` - Returns all columns
- `groupColumnsByCategory()` - Groups columns by category
- `findColumnById(id)` - Finds a specific column
- `getUniqueValuesForAttribute(attribute)` - Gets unique values from dataset

### Operators

- `getOperatorsForAttribute(attribute)` - Returns appropriate operators for data type

### Date Formatting

- `formatDateForInput(date)` - Formats Date to YYYY-MM-DD
- `parseDateString(dateString)` - Parses string to Date

## State Management

The FilterBar uses React Context for state management through `useFilters()` hook:

```tsx
const { filters, setFilters } = useFilters();
```

### Filter Flow

1. **Creation:**
   - User clicks "Add Filter"
   - Selects attribute (column)
   - Selects operator
   - Enters value(s)
   - Clicks "Apply"

2. **Editing:**
   - User clicks on existing filter chip
   - Popover opens at value step
   - User modifies value
   - Clicks "Apply" to update

3. **Removal:**
   - User clicks X icon on filter chip
   - Filter is removed from list

## Data Types

### FilterRule

Internal representation while building a filter:

```typescript
interface FilterRule {
  id: string;
  when: string;           // "WHEN" | "AND" | "OR"
  attribute: string;      // Column ID
  operator: string;       // Comparison operator
  value: string | string[]; // Single or multiple values
  value2?: string;        // Second value for "between"
}
```

### Filter (from context)

Final format stored in state:

```typescript
interface Filter {
  id: string;
  field: string;
  operator: string;
  values: (string | number)[];
  logicalOperator?: "AND" | "OR";
}
```

## Extending

### Adding New Data Types

1. Add type detection function in `utils.ts`:
   ```typescript
   export function isCustomType(attribute: string): boolean {
     // Your detection logic
   }
   ```

2. Add operators in `getOperatorsForAttribute()`:
   ```typescript
   if (isCustomType) {
     return [/* your operators */];
   }
   ```

3. Create input component in `value-inputs/`:
   ```typescript
   export function CustomInput({ value, onChange }: Props) {
     // Your input UI
   }
   ```

4. Add routing in `value-selection.tsx`:
   ```typescript
   {isCustomType ? (
     <CustomInput ... />
   ) : ...}
   ```

### Adding New Operators

Update the operator list in `utils.ts` → `getOperatorsForAttribute()`:

```typescript
return [
  { value: "your_operator", label: "Your Label" },
  // ... existing operators
];
```

Then handle it in `handleApplyFilter()` in `filter-bar.tsx` if special processing is needed.

## Styling

The component uses Tailwind CSS with custom color values:

- **Primary Green:** `#158039`
- **Red/Danger:** `#b61f27`, `#da2f38`
- **Borders:** `#d9dede`, `#b8c1c0`
- **Background:** `#f1f2f3`, `#e8e9ea`
- **Text:** `#262b2b`

All styling is done through className props and can be customized via Tailwind configuration.

## Best Practices

1. **Don't mutate FilterRule directly** - Use `updateFilterField()` helper
2. **Always validate before applying** - Check for required fields
3. **Reset state on cancel** - Use `resetFilterBuilder()` helper
4. **Handle both single and array values** - Value can be `string | string[]`
5. **Type conversion** - Convert strings to numbers for numeric fields

## Performance Considerations

- **Memoization:** Components use React hooks efficiently
- **Conditional Rendering:** Only renders active step
- **Lazy Data Loading:** Values fetched only when needed
- **Small Bundle:** Modular structure allows tree-shaking

## Testing

Key test scenarios:

1. Create filter with each data type (date, number, text)
2. Edit existing filter
3. Remove filter
4. Clear all filters
5. Handle "between" operator
6. Multi-select values
7. Search attributes
8. Navigate back through steps
9. Cancel filter creation
10. Duplicate prevention (same field)

## Migration from Legacy

If upgrading from the old monolithic filter-bar.tsx:

```tsx
// Old import (still works)
import { FilterBar } from "@/components/filter-bar";

// New modular import (recommended)
import { FilterBar } from "@/components/filter-bar/filter-bar";
```

The legacy file now re-exports from the new structure for backward compatibility.

