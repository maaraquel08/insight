# Dashboard Customization Implementation Plan

This document outlines the step-by-step implementation plan for building the customizable dashboard experience as specified in the PRD.

## 📋 Implementation Phases

### Phase 1: Foundation & Core Infrastructure (Tasks 1-4)

**Goal**: Set up the foundational types, context, and core components.

#### Task 1: TypeScript Types & Interfaces

-   Create `types/dashboard.ts` with:
    -   `DashboardConfig` interface
    -   `WidgetLayout` interface
    -   `WidgetMetadata` interface
    -   `WidgetSize` type (Small | Medium | Large | Full)
    -   `LayoutDensity` type (Compact | Spacious)

#### Task 2: Dashboard Context

-   Create `contexts/dashboard-context.tsx`:
    -   Dashboard state management
    -   Edit mode state
    -   Layout configuration state
    -   Actions: toggleEditMode, saveLayout, resetLayout, addWidget, removeWidget, resizeWidget, reorderWidgets

#### Task 3: Dashboard Configuration Service

-   Create `lib/dashboard-config.ts`:
    -   `loadDashboardConfig(userId, role)` - Load user's dashboard config from local storage
    -   `saveDashboardConfig(config)` - Save dashboard config to local storage
    -   `resetToDefault(role)` - Get default config for role
    -   `getDefaultConfig(role)` - Get default dashboard for role
    -   Local storage helpers for persistence (frontend-only prototype)

#### Task 4: Dashboard Container Component

-   Create `components/dashboard/dashboard-container.tsx`:
    -   Main wrapper component
    -   Provides DashboardContext
    -   Handles initial data loading from local storage
    -   Manages edit mode state
    -   Client Component (frontend-only prototype)

---

### Phase 2: Grid Layout & Drag-and-Drop (Tasks 5-6)

**Goal**: Implement the responsive grid system with drag-and-drop functionality.

#### Task 5: Dashboard Grid Component

-   Create `components/dashboard/dashboard-grid.tsx`:
    -   Uses `@dnd-kit` for drag-and-drop
    -   12-column responsive grid system
    -   Handles widget positioning
    -   Grid snapping logic
    -   Responsive breakpoints (mobile: 1 col, tablet: 2 cols, desktop: 12 cols)

#### Task 6: Widget Wrapper Component

-   Create `components/dashboard/widget-wrapper.tsx`:
    -   Wraps individual widget components
    -   Shows drag handles in edit mode
    -   Shows resize handles in edit mode
    -   Shows remove button (except locked widgets)
    -   Handles widget interactions
    -   Visual states: default, dragging, locked, loading, error

---

### Phase 3: Edit Mode & Controls (Tasks 7-12)

**Goal**: Implement edit mode functionality and user controls.

#### Task 7: Edit Mode Controls

-   Create `components/dashboard/edit-mode-controls.tsx`:
    -   Edit/Done button in header
    -   Save Changes button
    -   Cancel/Revert button
    -   Visual indicator banner when in edit mode
    -   Unsaved changes warning

#### Task 8: Edit Mode Toggle

-   Implement toggle functionality:
    -   Button click handler
    -   Keyboard shortcut (Cmd/Ctrl + E)
    -   State management in context
    -   Visual feedback

#### Task 9: Visual Indicators

-   Add edit mode visual indicators:
    -   Widget borders/highlights
    -   Drag handles visibility
    -   Grid lines toggle (optional)
    -   Edit mode banner/overlay

#### Task 10: Drag-and-Drop Implementation

-   Implement using `@dnd-kit`:
    -   Drag handles on widgets
    -   Ghost preview during drag
    -   Drop zones highlighting
    -   Smooth animations
    -   Touch support for mobile

#### Task 11: Widget Resizing

-   Implement resize functionality:
    -   Resize handles (bottom-right corner)
    -   Size options: Small (4 cols), Medium (6 cols), Large (8 cols), Full (12 cols)
    -   Size constraints (min/max per widget type)
    -   Visual feedback during resize
    -   Context menu for quick resize

#### Task 12: Widget Removal

-   Implement removal functionality:
    -   Remove button on each widget (edit mode)
    -   Confirmation dialog for removal
    -   Skip confirmation for non-critical widgets
    -   Prevent removal of locked widgets

---

### Phase 4: Widget Library (Tasks 13-19)

**Goal**: Build the widget library for discovering and adding widgets.

#### Task 13: Widget Library Component

-   Create `components/dashboard/widget-library.tsx`:
    -   Sidebar or modal panel
    -   Opens in edit mode or via "Add Widget" button
    -   Displays widget grid/list
    -   Search and filter controls

#### Task 14: Widget Library Item

-   Create `components/dashboard/widget-library-item.tsx`:
    -   Widget card with preview
    -   Widget name and description
    -   Data source tags
    -   Required permissions indicator
    -   "Add to Dashboard" button
    -   Already added indicator

#### Task 15: Widget Search

-   Implement search functionality:
    -   Search bar in widget library
    -   Search by name and description
    -   Real-time filtering
    -   Clear search button

#### Task 16: Widget Filtering

-   Implement filtering:
    -   Filter by category (People Health, Payroll, T&A, etc.)
    -   Filter by data source
    -   Filter by permissions
    -   Multi-select filters
    -   Sort options (Alphabetical, Most Popular, Recently Added)

#### Task 17: Widget Preview Modal

-   Create `components/dashboard/widget-preview-modal.tsx`:
    -   Opens on widget card click
    -   Shows full widget description
    -   Shows data sources and permissions
    -   Preview with sample data
    -   "Add to Dashboard" CTA

#### Task 18: Add Widget Functionality

-   Implement add widget:
    -   Adds widget to current layout
    -   Places widget at end or in next available spot
    -   Updates dashboard state
    -   Shows success feedback
    -   Handles duplicate widgets

#### Task 19: Widget Metadata Registry

-   Create `lib/widget-registry.ts`:
    -   Registry of all available widgets
    -   Widget metadata (id, name, description, category, etc.)
    -   Default sizes and constraints
    -   Permission requirements
    -   Component mappings

---

### Phase 5: Save & Reset Functionality (Tasks 20-23)

**Goal**: Implement persistence and reset capabilities.

#### Task 20: Save Changes

-   Implement save functionality:
    -   Save button handler
    -   Save config to local storage (frontend-only)
    -   Success feedback
    -   Loading state during save (simulated)

#### Task 21: Cancel/Revert Changes

-   Implement cancel functionality:
    -   Cancel button handler
    -   Revert to last saved state
    -   Unsaved changes warning on navigation
    -   Confirmation dialog if changes exist

#### Task 22: Auto-Save Draft

-   Implement auto-save:
    -   Saves draft every 30 seconds in edit mode
    -   Stores in local storage
    -   Does not overwrite saved state
    -   Visual indicator for draft state

#### Task 23: Reset to Default

-   Implement reset functionality:
    -   Reset button in settings or edit mode
    -   Confirmation dialog
    -   Loads default config for user's role
    -   Updates layout immediately
    -   Success feedback

---

### Phase 6: Advanced Features (Tasks 24-27)

**Goal**: Add advanced personalization features.

#### Task 24: Locked Widget Support

-   Implement locked widgets:
    -   Mark widgets as locked in config
    -   Prevent removal
    -   Prevent resizing below minimum
    -   Admin-configurable

#### Task 25: Locked Widget Visual Indicators

-   Add visual indicators:
    -   Lock icon on locked widgets
    -   Different border/styling
    -   Tooltip explaining why locked
    -   Disabled remove/resize controls

#### Task 26: Layout Density Toggle

-   Implement density options:
    -   Toggle in dashboard settings or edit mode
    -   Compact: 8px padding between widgets
    -   Spacious: 16px padding between widgets
    -   Applies to all widgets consistently
    -   Saves preference per user

#### Task 27: Show/Hide Widgets

-   Implement visibility toggle:
    -   Hide button in widget menu
    -   Hidden widgets remain in layout
    -   "Show Hidden Widgets" option in edit mode
    -   Visual indicator for hidden widgets

---

### Phase 7: Default Configurations & Permissions (Tasks 28-30)

**Goal**: Set up role-based defaults and permission handling.

#### Task 28: Default Dashboard Configurations

-   Create `lib/default-dashboards.ts`:
    -   Default configs for each role:
        -   HR Admin: People Health widgets
        -   Executive: High-level KPIs
        -   Payroll Manager: Payroll widgets
        -   Manager: Team metrics
    -   Widget positions and sizes
    -   Default density settings

#### Task 29: Role-Based Widget Filtering

-   Implement permission filtering:
    -   Filter widgets based on user role
    -   Check required permissions
    -   Hide unavailable widgets from library
    -   Show empty states appropriately

#### Task 30: Empty States

-   Create empty state components:
    -   Empty state for widgets without data
    -   Empty state for widgets without permissions
    -   Empty dashboard state
    -   Helpful messages and CTAs

---

### Phase 8: Error Handling & Loading States (Tasks 31-32)

**Goal**: Implement robust error handling and loading states.

#### Task 31: Error Handling

-   Implement error handling:
    -   Error boundaries for widget failures
    -   Retry functionality for failed loads
    -   Error state UI components
    -   Error logging and monitoring
    -   Graceful degradation

#### Task 32: Loading States

-   Implement loading states:
    -   Skeleton loaders for widgets
    -   Loading indicators during data fetch
    -   Progressive loading (critical widgets first)
    -   Loading state for save operations

---

### Phase 9: Responsive Design & Accessibility (Tasks 33-36)

**Goal**: Ensure mobile responsiveness and accessibility.

#### Task 33: Responsive Design

-   Implement responsive layouts:
    -   Mobile: Single column layout
    -   Tablet: 2-column layout
    -   Desktop: Full 12-column grid
    -   Breakpoint handling
    -   Widget sizing adjustments

#### Task 34: Touch Interactions

-   Implement touch support:
    -   Long press to enter drag mode
    -   Touch-friendly target sizes (min 44x44px)
    -   Swipe gestures (future)
    -   Mobile-optimized edit mode

#### Task 35: Keyboard Navigation

-   Implement keyboard support:
    -   Tab through widgets in edit mode
    -   Arrow keys to move widgets
    -   Enter/Space to activate buttons
    -   Escape to exit edit mode
    -   Focus indicators

#### Task 36: Accessibility Features

-   Implement accessibility:
    -   ARIA labels for all interactive elements
    -   Screen reader support
    -   Live regions for dynamic updates
    -   Focus management in edit mode
    -   WCAG 2.1 AA compliance

---

### Phase 10: State Management & Persistence (Task 40)

**Goal**: Implement state persistence using local storage.

#### Task 40: Local Storage Persistence

-   Implement local storage:
    -   Save dashboard configs locally
    -   Save draft configs (auto-save)
    -   Load configs on page load
    -   Clear storage option (for testing)
    -   Storage key management (per user/role)

---

### Phase 11: Testing (Task 48)

**Goal**: Comprehensive testing of all functionality.

#### Task 48: Testing

-   Create tests:
    -   Unit tests for utilities and services
    -   Component tests for UI components
    -   Integration tests for workflows
    -   E2E tests for critical paths
    -   Accessibility tests
    -   Performance tests

---

## 🗂️ File Structure

```
app/
  personalize/
    page.tsx                    # Personalize page
    page-prd.md                 # PRD document
    IMPLEMENTATION_PLAN.md      # This file

components/
  dashboard/
    dashboard-container.tsx     # Main container (Task 4)
    dashboard-grid.tsx         # Grid layout (Task 5)
    widget-wrapper.tsx         # Widget wrapper (Task 6)
    edit-mode-controls.tsx     # Edit controls (Task 7)
    widget-library.tsx         # Widget library (Task 13)
    widget-library-item.tsx    # Widget card (Task 14)
    widget-preview-modal.tsx   # Preview modal (Task 17)
    [existing widgets...]      # Existing widget components

contexts/
  dashboard-context.tsx        # Dashboard context (Task 2)

lib/
  dashboard-config.ts          # Config service (Task 3)
  widget-registry.ts           # Widget registry (Task 19)
  default-dashboards.ts        # Default configs (Task 28)

types/
  dashboard.ts                 # TypeScript types (Task 1)
```

---

## 🎯 Implementation Order

**Recommended order for efficient development:**

1. **Foundation First** (Tasks 1-4): Set up types, context, and core infrastructure
2. **Grid & Drag** (Tasks 5-6): Get basic layout working
3. **Edit Mode** (Tasks 7-12): Enable customization interactions
4. **Widget Library** (Tasks 13-19): Allow adding widgets
5. **Persistence** (Tasks 20-23): Save and reset functionality (local storage only)
6. **Advanced Features** (Tasks 24-27): Locked widgets, density, show/hide
7. **Defaults & Permissions** (Tasks 28-30): Role-based defaults and empty states
8. **Error Handling** (Tasks 31-32): Error handling and loading states
9. **Responsive & Accessibility** (Tasks 33-36): Mobile support and a11y
10. **State Persistence** (Task 40): Local storage implementation
11. **Testing** (Task 48): Basic testing

---

## 📝 Notes

-   **Frontend-Only Prototype**: This is a frontend-only prototype using local storage for persistence
-   Use existing `@dnd-kit` library for drag-and-drop (already installed)
-   Follow existing patterns (Context API, Client Components)
-   Maintain consistency with existing design system (Shadcn UI, Tailwind)
-   All data persistence uses browser local storage (no backend/API calls)
-   Prioritize mobile responsiveness
-   Ensure accessibility from the start
-   Test incrementally as you build

---

## ✅ Definition of Done

Each task is considered complete when:

-   [ ] Code is written and follows project conventions
-   [ ] Component/feature works as specified in PRD
-   [ ] Responsive design works on mobile, tablet, desktop
-   [ ] Accessibility requirements met
-   [ ] Error handling implemented
-   [ ] Loading states implemented
-   [ ] No console errors or warnings
-   [ ] Code is properly typed (TypeScript)
-   [ ] Basic manual testing completed
