PRD — Focused & Deterministic Insight Cards (BPO-Focused MVP)

Product: People Intelligence – Org Health / Operations Dashboard
Version: MVP
Author: Michael
Date: 2025

1. Overview

The Focused & Deterministic Cards feature provides AI-generated insights framed within strict guardrails—ensuring reliability, consistency, and clarity for BPO operations.
These cards summarize urgent or important workforce signals (e.g., absenteeism, productivity, headcount risks) using a controlled template, making AI output predictable and safe for high-stakes management decisions.

The goal:

Make insights highly digestible

Reduce noise

Provide actions, not just data

Ensure data integrity through deterministic card structures

2. Problem Statement

BPO companies handle high-volume operations where even small deviations (absenteeism, occupancy, schedule adherence) have large downstream impacts. Current dashboards overwhelm users with raw data and lack synthesized insights.
AI is powerful but risks hallucinations or inconsistent phrasing without strong structure.

We need:
A controlled set of insight cards with predefined categories and templates, ensuring that AI only fills in validated analytics.

3. Goals & Success Metrics
   Goals

Provide fast, reliable insight summaries for BPO operations

Make AI outputs predictable and safe

Create visually appealing, scannable cards

Reduce cognitive load for supervisors and managers

Success Metrics

30% faster insight comprehension (via usability tests)

25% reduction in supervisors requesting manual data exports

90% of cards generated remain within deterministic guardrails

Increased daily dashboard usage

4. Core Concept

Each card is:

Deterministic in structure (AI fills values only)

BPO-specific in category

High signal, low noise

Action-oriented

Visualized in a consistent UI pattern

Card Structure Template:

**Header:**

-   Title (fixed per card type)
-   Timestamp (relative time, e.g., "3d 2h ago")
-   Priority Badge (High/Medium/Low with color coding)

**Body:**

-   Primary Metric (large, bold, centered message)
-   Comparison Badge (optional - shows trend vs previous period)
-   AI-Generated Insight (with rotating gradient border animation)
-   Impact Statement (label + message)

**Footer:**

-   Action Buttons (1-3 buttons with variants: outline, primary, purple border)

5. Card Categories (MVP – BPO-Focused)

These are simplified, deterministic categories tailored for BPO operations:

(1) Workforce Stability

High Absenteeism Today

High Tardiness Today

Sudden Attrition Risk

High No-Show Rate

(2) Productivity & Efficiency

Low Productivity Score Today

SLA / KPI Performance Drop

Understaffed Hour Block

Occupancy Rate Below Target

(3) Scheduling & Staffing

Overstaffed Hour Block

Overtime Spike

Scheduling Conflicts Detected

High Volume of Pending Shift Swaps

(4) Engagement & Wellness

Engagement Drop in Team

Increased Sick Leave Pattern

High Fatigue Indicator

Each card type has a fixed schema (e.g., absenteeism always uses absenteeism rate, target, variance).

6. Example Card — Final Refined Version (High Absenteeism Today)

**Header Section:**

-   Title: "Workforce Attendance & Adherence"
-   Timestamp: "3d 2h ago"
-   Priority Badge: "High priority" (Red background #fee2e3, red border #b61f27)

**Body Section:**

Primary Metric (large, bold, centered):

-   "Absenteeism is at 12%, higher than your daily target of 8%."
-   Displayed in a gray card background (#f7f8f8) with border

Comparison Badge:

-   "4 vs last month" (Green background #dcfce6, green border #158039)
-   CaretUp icon for upward trend
-   Red variant for downward trends

AI-Generated Insight (with rotating gradient border animation):

-   "Growth driven by new client onboarding in Cebu site."
-   Visual indicator: Sparkle icon (✨) with animated purple/white gradient border
-   Gradient background overlay

Impact Statement:

-   Label: "Impact"
-   Message: "Service levels for Queue 2 may drop in the next 2 hours if no adjustments are made."

**Footer Section:**

-   Action Buttons (right-aligned):
    -   "View Affected Teams" (Outline button with gray border)
    -   "Apply Suggestions" (Outline button with purple border #8139ee)

**Priority Indicator System:**

-   High Priority: Red (#b61f27) - Critical issues requiring immediate attention
-   Medium Priority: Yellow/Amber (#d97706) - Issues that need attention but are not critical
-   Low Priority: Blue (#2563eb) - Informational items or positive trends

7. UX & UI Recommendations
   Visual System for Deterministic Cards

To make cards visually appealing and consistent:

1. Compact Card Layout (3 Sections with Dividers)

**Header Section:**

-   Title + Timestamp + Priority Badge
-   Divider (full-width border)

**Body Section:**

-   Primary Metric Card (centered, large text)
-   Comparison Badge (if applicable)
-   AI-Generated Section (with rotating gradient border)
-   Impact Statement
-   Divider (full-width border)

**Footer Section:**

-   Action Buttons (right-aligned)

2. UI Components

**Priority Badges:**

-   High Priority: Red background (#fee2e3) with red border (#b61f27)
-   Medium Priority: Yellow background (#fef3c7) with amber border (#d97706)
-   Low Priority: Blue background (#dbeafe) with blue border (#2563eb)

**Comparison Badges:**

-   Up Trend: Green background (#dcfce6) with green border (#158039) + CaretUp icon
-   Down Trend: Red background (#fee2e2) with red border (#da2f38) + CaretDown icon

**AI-Generated Section:**

-   Rotating gradient border animation (purple/white gradient)
-   Sparkle icon (✨) indicator
-   Gradient background overlay

**Action Buttons:**

-   Outline variant (default gray border)
-   Primary variant (green background)
-   Purple border variant (for AI-suggested actions)

3. Color System (Semantic)

Priority-based color system for status indicators:

High Priority: Red (#b61f27, #fee2e3 background) - Critical issues requiring immediate attention
Medium Priority: Yellow/Amber (#d97706, #fef3c7 background) - Issues that need attention but are not critical
Low Priority: Blue (#2563eb, #dbeafe background) - Informational items or positive trends

Metric Comparison Colors:

-   Positive/Up Trend: Green (#158039, #dcfce6 background)
-   Negative/Down Trend: Red (#da2f38, #fee2e2 background)

Neutral: Gray (#5d6c6b) - Secondary text and labels

4. Card Patterns

**Layout:**

-   Max-width: 480px (centered in feed)
-   Rounded corners: 12px (rounded-xl)
-   Border: 1px solid #d9dede
-   White background
-   Full-width dividers between sections

**Spacing:**

-   Header padding: px-4 py-3
-   Body padding: p-6
-   Footer padding: px-4 py-3
-   Gap between cards: 16px (gap-4)

**Feed Layout:**

-   Single column, centered
-   Vertical scroll
-   Social media feed style (similar to LinkedIn/Instagram)

5. Interaction

**Card Interaction:**

-   Static cards (no hover effects to maintain focus)
-   Action buttons have hover states (bg-gray-50 for outline, opacity change for primary)

**Button Actions:**

-   Each button can have custom onClick handlers
-   Actions are defined in the data structure
-   Buttons support multiple variants and border colors

8. Guardrails for AI
   Strict Deterministic Rules

AI must:

-   Only fill metric values from validated data sources
-   Never invent targets or thresholds
-   Use only approved phrasing structures
-   Follow fixed template structure (header, body, footer)
-   Keep AI-generated insights to 1-2 sentences maximum
-   Use controlled vocabulary for impact statements
-   Maintain consistency in timestamp formatting
-   Only generate priority badges based on actual threshold violations

Allowed Variable Types

**Metrics:**

-   Percentage values (%)
-   Absolute numbers (counts, amounts)
-   Trend values (vs last period, vs target)
-   Threshold comparisons (above/below target)

**Time References:**

-   Relative timestamps ("3d 2h ago", "5h ago", "1d ago")
-   Time ranges ("today", "this week", "last 7 days")

**Priority Assignment:**

-   High: Critical threshold violations, immediate impact
-   Medium: Moderate deviations, potential impact
-   Low: Informational, positive trends, or minor variations

Prohibited

Predictive statements (unless using approved forecast model)

Mentioning individuals

Overly narrative explanations
