export type WidgetSize = "Small" | "Medium" | "Large" | "Full";

export type LayoutDensity = "Compact" | "Spacious";

export type WidgetCategory =
    | "People Health"
    | "Payroll"
    | "Time & Attendance"
    | "Analytics"
    | "KPIs";

export interface WidgetMetadata {
    id: string;
    name: string;
    description: string;
    category: WidgetCategory;
    dataSource?: string[];
    requiredPermissions?: string[];
    defaultSize: WidgetSize;
    minSize?: WidgetSize;
    maxSize?: WidgetSize;
    component: string; // Component name/path
    locked?: boolean;
    hidden?: boolean;
}

export interface WidgetLayout {
    id: string;
    widgetId: string;
    x: number; // Grid column start (0-11)
    y: number; // Grid row start
    width: number; // Grid columns (1-12)
    height: number; // Grid rows (auto-calculated or fixed)
    size: WidgetSize;
    order: number; // Display order
}

export interface DashboardConfig {
    userId: string;
    role: string;
    widgets: WidgetLayout[];
    density: LayoutDensity;
    lastSaved?: string;
    version?: number;
}

export interface DashboardState {
    config: DashboardConfig;
    isEditMode: boolean;
    hasUnsavedChanges: boolean;
    draftConfig?: DashboardConfig;
}

