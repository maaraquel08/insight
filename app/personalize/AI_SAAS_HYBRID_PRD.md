🧭 PRODUCT REQUIREMENTS DOCUMENT (PRD)
Feature: AI-Augmented Widgets & Frontend Interaction Model

Product Area: Dashboard 2.0 (People Intelligence + All Sprout Products)
Audience: Design, Product, Frontend Engineering
Status: Draft — UX-Focused

1. 🧠 Purpose

This initiative upgrades the dashboard from a static display of widgets into an interactive, contextual, intelligent experience.

Widgets will no longer just show data—they will also:

Explain what’s happening

Provide context and summaries

Highlight anomalies

Suggest actions

Respond to questions

Evolve based on user behavior

This PRD defines the frontend experience, widget behavior, AI interactions, and UI states.

2. ✨ Experience Principles
1. Show → Explain → Guide

Every widget should:

Show the metric

Explain what’s happening

Guide what to do next

2. Context at the Point of Need

Users should never wonder:

“Is this good or bad?”

“Why did this change?”

“What should I do?”

AI surfaces context next to the data—not hidden in another screen.

3. Natural & Conversational

AI should feel like a product teammate, not a chatbot thrown into the UI.

4. Zero Cognitive Overload

Users see what matters. AI reveals depth only when needed.

3. 🧱 Core UX Components

The AI-augmented dashboard introduces five key UI components:

AI-Enhanced Widget

Context Panel

Widget-Level Ask AI Button

AI Insight Bubbles (Micro-Insights)

Global Conversational Panel (Sidebar)

Each is detailed below.

4. 🧩 Component 1: AI-Enhanced Widgets
   Definition

Widgets are no longer static boxes. They have three layers of intelligence:

Data Layer: The chart or metric

Context Layer: AI’s instant interpretation

Action Layer: Suggested next steps

Default Structure

A widget includes:

Title

Chart or KPI number

“AI Context Summary” (1–2 sentences)

Insight Bubbles (if relevant)

Icon buttons (Explain, Why, Next Steps)

4.1 Widget States
A. Default View

What users see on load:

Metric or chart

AI Summary (collapsed to 1–2 lines)

Up to 2 insight bubbles

Example:

“Headcount increased by 7% this month. Growth is driven by Sales hires.”

B. Expanded View (On Click or Hover)

Shows:

Full explanation (3–5 sentences)

Trend interpretation

Risk indicators

Benchmarks (if applicable)

C. Interaction State: Ask AI

User clicks a button:

Why is this happening?

What should I do?

Explain this trend

Widget animates to show loading shimmer → then answer inline or in context panel.

5. 📌 Component 2: Context Panel (Right-Side Drawer)
   Purpose

When a user clicks a widget, they unlock a deep-dive contextual panel on the right.

Content Includes:

Full explanation of what the widget means

Trend narrative (AI-generated)

Contributing factors

Predictions / forward signals

Recommended actions

Shortcut buttons to launch deeper tools

Interactions

Opens when user clicks Explain, Insights, or Why

Slides in from right

Closing returns to dashboard state

Sticky header with the Widget Title

UX Goal

This promotes focus — users get depth without leaving the dashboard.

6. 🧠 Component 3: Widget-Level Ask AI Button
   Buttons / Actions (configurable per widget)

Explain this

Why did this change?

Show risks

Recommend actions

Compare to last X

Predict next month

Interaction Flow

User clicks “Why did this change?”

Loading shimmer inside widget

Inline answer appears OR context panel opens

Answer can be:

Text (default)

Micro chart

Highlighted data points

7. 💬 Component 4: AI Insight Bubbles (Micro-Insights)

Tiny bubbles appearing inside or under widgets when something meaningful happens.

Examples

“⚠️ Unusual spike detected”

“⬆ Higher than industry benchmark”

“📉 Significant drop compared to last month”

“✨ Opportunity area identified”

Behavior

Appears automatically when AI detects a signal

Clicking a bubble opens Context Panel

Bubbles fade when not relevant

These act like AI notifications inside widgets.

8. 🧑‍💻 Component 5: AI Conversational Sidebar

Right-side full-height chat interface.

Purpose

Allows users to ask:

“Why did attrition increase?”

“What team is driving OT cost?”

“Show me the top risks this week.”

UX Behavior

Collapsible chatbot panel

Summons snippets from widgets

AI can reference charts directly

Replies can open specific context panels

9. 🧭 User Flows
   9.1 Flow A: User exploring the dashboard (passive)

User lands → sees AI summaries → reads quick insights → continues.

What AI does:

Auto-generates summaries

Highlights anomalies

Displays contextual hints

9.2 Flow B: User interacting with a widget (active)

User clicks widget

Widget expands

Insight bubble highlights new info

User clicks “Explain this”

Context Panel opens on the right

AI narrates trend + context

User clicks recommended action

System navigates to relevant feature

9.3 Flow C: User asking AI a question

User opens AI sidebar

Types: “Why is OT high?”

AI analyzes widgets + metadata

AI shows:

Chart snapshot

Explanation

Recommendation

User applies changes

9.4 Flow D: Predictive Scenario

User clicks “Forecast next month” in a widget

AI expands widget with predictive chart

Users get explanation + risks

10. 🎨 Visual Design Guidelines (High-Level)

Widgets height auto-expands when showing AI summaries

AI summaries use muted secondary text style

Insight bubbles use pill-style UI with light backgrounds

Context panel uses a card-stack system for readability

Ask AI button should be visually consistent across all widgets

Animations

Gentle fade-in for AI content

Loading shimmer when AI is generating

11. 🔐 Permissions & UX Behavior

If user cannot access a metric →
widget hides AI details or shows “You do not have access to this insight.”

AI cannot reveal cross-team data unless allowed

Widget smart summaries adapt depending on data visibility

12. 📅 MVP vs. Full Vision
    MVP (Dashboard 2.0 Launch)

AI summary inside widgets

Context panel

Insight bubbles

Ask AI (Explain / Why / What’s next)

AI sidebar basic version

Full Vision

Predictive charts

What-if simulations

Automatic weekly briefings

Smart widget suggestions

Personalized dashboards powered by AI preferences

13. ❓ Open UX Questions

Should AI summaries always be visible, or toggleable?

Do we want floating insights or anchored insights?

What tone of voice should AI use?

Should widgets auto-resize when AI adds long explanations?

Do we allow “pinning” AI insights to the widget?
