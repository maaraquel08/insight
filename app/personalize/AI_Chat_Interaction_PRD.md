🌟 PRODUCT REQUIREMENTS DOCUMENT (PRD)
Feature: Drag-to-Chat Interaction + Widget Chips

Product Area: Dashboard 2.0 (AI-Augmented Experience)
Audience: UX, Product, Frontend Engineering
Status: Draft — UX Vision Only

1. 🎯 Purpose

Enable a powerful new interaction where users can:

Drag UI elements (widgets, charts, cards) from the dashboard → into the AI chat panel

This action automatically generates a Widget Chip in the chat representing the dropped component.

This unlocks:

Conversational analysis of visual data

Multi-widget comparisons

“Explain this” in the context of selected widgets

AI workflows powered by visual elements

This is a new UI paradigm where dashboards and chat work together seamlessly.

2. 🌱 UX Vision Summary

The user experience should feel like this:

The dashboard is not separate from the AI assistant.

Users can grab any widget → drop it into chat → and the AI immediately understands:

What widget it is

What metric or chart it represents

What insights or context it should talk about

The chip becomes the “context container”

A compact representation of the widget inside the chat.
No data needed — just metadata + structure.

3. 🧩 Core UX Components
   3.1 Draggable Widgets (Dashboard Side)

Every widget on the dashboard becomes a draggable UI element.

Key UX Requirements

Hover state shows a subtle “Grab Handle” (⋮⋮ icon or grip area)

Cursor changes to “grab” hand

Long press (mobile/tablet) enables drag

Entire widget moves as a ghost element

Widget gets a shadow while dragging

Success visual

When near the chat box, a drop zone highlight appears.

3.2 Chat Drop Zone

The chat input area must have a “magnetic” drop zone state.

Drop Zone UX States

Idle: normal chat

Hover: glowing border or expanding outline

Ready-to-drop: subtle animation, “Drop to reference this widget”

3.3 Widget Chips (Rendered in Chat)

When dropped, the widget becomes a Chip inside the chat input or the message history.

Chip Contents (Frontend Only)

Widget Title

Widget Type (KPI, Trend, Chart, Table, Gauge, etc.)

Timestamp (optional)

Small icon representing widget type

Invisible metadata tag (for AI, not visible to user)

UX Behavior

Chips appear inline with text (like tags)

Chips are removable (x icon)

Chips can be reordered

Clicking chip highlights associated widget on dashboard

Hovering chip shows mini-preview of the widget

3.4 Ghost Card Animation

When dragging, the widget turns into a floating ghost version:

60–80% opacity

Slight blur

Drop shadow

Scales down to chip size during drop animation

This creates a magical UI experience.

4. 🔄 User Interaction Flow
   4.1 Flow A: Basic Drag → Chip Creation

User grabs a widget

Drags it across screen

Chat panel highlights

User drops widget into chat input

Widget shrinks → transforms into a chip

Chip appears in chat input

User types a question:
“Explain these trends”

Press Send

AI responds with context referencing the chip(s)

4.2 Flow B: Multi-Widget Comparison

User drags Widget A into chat → chip created

User drags Widget B into chat → second chip

User types:
“Compare these two over the last 6 months.”

AI uses the two chips as context

Chat shows:

Comparison summary

Narratives

Recommendations

4.3 Flow C: Use Chips to Build Workflows

User drags:

“Headcount Trend” widget

“Attrition Trend” widget

Then types:

“Create an Org Health summary using these.”

AI generates:

Narrative

Key risks

Suggested actions

4.4 Flow D: Reverse Interaction (From Chat → Dashboard)

AI gives a suggestion

User clicks “Visualize this”

AI creates a temporary preview widget

User can drag that widget back into the dashboard

(You can decide if this is future phase.)

5. 🎨 Visual & Motion Design
   5.1 Chips (Frontend Detail)
   Chip Style

Rounded pill edges

Light background (e.g., surface-02)

Thin border

Icon + label

Close button

Tooltip preview on hover

Chip Size

Small to medium (≈ 32–40px height)

Fits inside single line of chat input

5.2 Transitions & Animations
Drag Start

Widget lifts by 4–8px

Shadow intensifies

Slight scale up (1.02)

Drag Over Chat

Chat box glows or pulses

Optional: bounce effect

Drop Moment

Widget shrinks in mid-air

Snaps into chip form

Chip slides into the input field

6. 💬 Chat-Level Behaviors
   Sending Message with Chips

When user presses send:

Chips remain visible

AI sees chip metadata

Chat message includes chips visually

Editing a message with chips (optional)

If user edits, chips remain editable.

Selecting multiple chips

Dragging multiple widgets at once creates multiple chips.

7. 📐 Accessibility & UX Considerations

Keyboard mode:
Users can select widgets with keyboard and press “Send to Chat”

A11y names for chips (screen readers)

Visual but non-obtrusive drop zone cues

Chips should not overwhelm the chat input

Use overflow scroll if more than 5 chips are added

8. 🚦 Scope & MVP Recommendations
   MVP Features

Drag + drop a widget

Ghost animation

Chip rendering

Chips inside chat message

AI message referencing chips

Hover preview for chips

Future Additions

Multi-widget drag

Chips that reference dashboard filters

Reverse drag from chat → dashboard

AI-created custom temporary widgets

Voice commands referencing chips

9. 🧪 Open UX Questions (Discovery Needed)

Should chips be collapsible into a single group if >5?

Should there be a “Send to Chat” button alternative to dragging for accessibility?

Should chat automatically suggest insights when a chip is added?

What tone should the chip tooltip use?

Should chips auto-scroll if overflow?

10. 📄 Output of This Feature
    This feature enables:

Natural visual-to-conversational workflows

A new mental model:
“Dashboards are objects you can talk to.”

Multi-dimensional insights

Quick comparisons

Powerful storytelling workflows
