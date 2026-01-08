import {
    LucideIcon,
    Clock,
    Calendar,
    FileText,
    Users,
    UserCheck,
    List,
    TrendingDown,
    Award,
    DollarSign,
    Receipt,
    Percent,
    Heart,
    TrendingUp,
    PieChart,
    Wallet,
    Building2,
    BarChart3,
    Database,
    Link,
    RefreshCw,
    UserCog,
    Timer,
    Gift,
    Shield,
    BarChart,
    Settings,
} from "lucide-react";

/**
 * Maps report titles to appropriate Lucide React icons.
 * Using an object instead of Map for better tree-shaking detection in production builds.
 * 
 * To add new reports:
 * 1. Add the report title (lowercase) as a key
 * 2. Assign an appropriate icon from lucide-react
 * 
 * The mapping is case-insensitive for flexibility.
 */
const reportIconMap: Record<string, LucideIcon> = {
    // HR Reports
    overtime: Clock,
    leaves: Calendar,
    "attendance logs": FileText,
    attrition: TrendingDown,
    "employee demographics": Users,
    "employee list report": List,
    absenteeism: Clock,
    "performance review": Award,
    
    // Payroll Reports
    salary: DollarSign,
    "payroll summary": Receipt,
    "tax deductions": Percent,
    "benefits report": Heart,
    
    // Finance Reports
    "financial summary": TrendingUp,
    "budget analysis": PieChart,
    "expense report": Wallet,
    "revenue report": TrendingUp,
    "cost center analysis": Building2,
    "financial forecast": BarChart3,
    
    // Workday Reports
    "workday integration": Database,
    "workday sync status": RefreshCw,
    "workday employee data": Users,
    "workday payroll sync": RefreshCw,
    "workday time tracking": Timer,
    "workday benefits": Gift,
    "workday compliance": Shield,
    "workday analytics": BarChart,
    "workday custom fields": Settings,
    
    // App 1 Reports (generic)
    "custom report 2": FileText,
    "custom report 3": FileText,
};

/**
 * Fallback icon for reports that don't have a specific mapping
 */
const FALLBACK_ICON: LucideIcon = FileText;

/**
 * Explicit icon registry to prevent tree-shaking in production builds.
 * This ensures all icons used in the map are included in the bundle.
 * Exporting this array ensures Next.js can detect all icon usage.
 */
export const iconRegistry: LucideIcon[] = [
    Clock,
    Calendar,
    FileText,
    Users,
    List,
    TrendingDown,
    Award,
    DollarSign,
    Receipt,
    Percent,
    Heart,
    TrendingUp,
    PieChart,
    Wallet,
    Building2,
    BarChart3,
    Database,
    RefreshCw,
    Timer,
    Gift,
    Shield,
    BarChart,
    Settings,
];

/**
 * Gets the appropriate icon for a report based on its title.
 * 
 * @param title - The report title (case-insensitive)
 * @returns The Lucide icon component for the report, or fallback icon if not found
 */
export function getReportIcon(title: string): LucideIcon {
    const normalizedTitle = title.toLowerCase().trim();
    return reportIconMap[normalizedTitle] || FALLBACK_ICON;
}
