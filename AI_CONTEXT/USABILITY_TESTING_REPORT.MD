# Attrition Dashboard Usability Testing: Key Insights Report

## Executive Summary

This report presents critical insights from usability testing sessions with HR leaders and senior executives on the Attrition Dashboard prototype. The findings reveal both strategic needs and tactical pain points that must be addressed to ensure the dashboard delivers maximum value to decision-makers.

**Key Takeaways:**
- HR leaders need comprehensive, granular attrition data to drive strategic workforce decisions
- Current AI features lack trust due to generic, non-company-specific responses
- Time-bound analysis and comparison capabilities are essential for effective planning
- Clear data presentation with both percentages and absolute numbers is crucial
- The dashboard's core design is well-received, but requires refinement

---

## Strategic Insights

### INS-001: Understanding Attrition's Multi-Dimensional Impact

**Priority: High | Strength: Strong**

#### The Business Context

HR heads and senior leaders manage organizational capacity, brand reputation, cost control, succession planning, and service quality. Attrition directly affects all these critical business functions.

#### Why This Matters

Attrition creates a ripple effect across the organization:
- **Capacity Impact**: Reduced workforce bandwidth affects productivity
- **Knowledge Loss**: Institutional knowledge walks out the door
- **Financial Burden**: Significant recruitment and training costs
- **Service Quality**: Customer satisfaction suffers during transitions
- **Morale Issues**: Remaining employees experience engagement drops
- **Critical Roles**: Losing hard-to-replace talent has outsized negative impact

#### Key User Quotes

> "Of course, as the head of HR, you want to understand the attrition level of your organization because it would affect your capacity and bandwidth."

> "So reputation wise it has a significant impact if it goes out to the public."

> "See for instance, if I'm a sales-oriented and sales-led organization, so certainly having a high attrition rate in the sales is something that would impact my financials moving forward."

#### Recommendation

Implement a comprehensive attrition dashboard that integrates all relevant data points (reasons, costs, tenure, criticality) and provides deep drill-down capabilities to enable proactive management and strategic decision-making by HR leaders and management.

---

### INS-002: Need for Granular Data Breakdowns

**Priority: High | Strength: Strong**

#### The Problem

Current attrition data often lacks specific breakdowns by:
- Department and job role (experts vs. operations)
- Type of separation (voluntary/involuntary, regrettable/unregrettable)
- Tenure (probationary vs. FTE)
- Specific reasons for departure

This prevents clear diagnosis of where and why attrition is problematic.

#### Business Impact

Without granular data, decision-makers cannot:
- Pinpoint areas of concern effectively
- Allocate resources efficiently
- Address critical talent gaps
- Distinguish between hiring issues vs. training problems
- Identify if attrition is coming from revenue-critical roles

#### Key User Quotes

> "If you're a professional services firm, makikita mo na... nanggagaling yung attrition mo sa mga operations, not really with your experts? I think hindi ka magiging very conscious about it. But kung makita mo nag-aalis sa'yo yung mga accountants mo. Ayun talagang very critical sa'yo yan."

> "So one of the things that I want to see immediately is how much of my attrition is regrettable versus unregrettable. And this is a very important metric."

> "Because that gives you an insight into, is there something wrong with your hiring? Because let's say 187 separations, let's say a third of those are for probationary employees... there is a big glaring question that what are we doing in our hiring process?"

#### Recommendation

Prioritize development of granular breakdown capabilities for attrition data, including:
- Department and role criticality dimensions
- Tenure segmentation (probationary/FTE)
- Separation type classification (voluntary/involuntary, regrettable/unregrettable)
- Integration with exit survey data to capture true reasons for voluntary separations

---

### INS-003: Time-Bound Analysis is Critical

**Priority: High | Strength: Strong**

#### The Need

Users need to analyze attrition data across various timeframes (monthly, quarterly, yearly) to:
- Compare current performance to past periods
- Identify seasonal patterns
- Set and track targets
- Support strategic planning

#### Current Limitations

- Lack of explicit time-bound definitions for comparison metrics (e.g., 'last period')
- Unclear historical trend displays
- Limited flexible filtering for specific quarters or custom date ranges
- Ambiguity prevents accurate interpretation

#### Business Impact

Without robust time analysis, users cannot:
- Establish clear benchmarks
- Track progress against strategic goals
- Identify seasonal attrition factors (e.g., post-bonus resignations)
- Justify resource allocation
- Make proactive decisions instead of reactive ones

#### Key User Quotes

> "It's impactful because we can compare kasi the performance din. Like for example, if we compare it with operations, let's say bakit parang ang baba ng productivity this quarter. So maybe factor din kasi yung attrition."

> "So it's a really, really good idea na mayroong ganyan na timeline comparison. So that can be a standard metric... Para siyang magiging target ng department na we should have fewer attrition this upcoming quarter."

> "Based on my experience, Q1 of every year marami talaga nag-resign kasi they're looking for another job and they got their 13th month pay already from the current company."

#### Recommendation

Enhance the dashboard with:
- Clear, configurable time-bound filters (custom date ranges, pre-set quarters/years)
- Explicit period definitions for all comparison metrics
- Advanced trend analysis features highlighting seasonal fluctuations
- Ability to drill down into specific periods or departments

---

## Critical Pain Points

### INS-004: AI Lacks Trust and Actionable Insights

**Priority: Critical | Strength: Strong**

#### The Problem

Users expect contextualized, data-driven insights from AI features (AI overview, Sidekick), but currently receive:
- Generic definitions instead of specific insights
- Hypothetical or non-company-specific data
- No actionable recommendations
- Contradictory insights that don't match dashboard data

#### User Impact

This fundamental disconnect causes:
- Loss of confidence in AI utility
- Additional time spent cross-referencing information
- Negation of AI's intended value
- Frustration and reduced adoption

#### Key User Quotes

> "E parang hindi naman siya useful kasi sorry ah. I cannot provide you with the exact top 3 departments with high attrition... the data is not company specific. So parang it breaks my heart... Who's telling the truth? Is it the sidekick? Or the figures that we have in the attrition dashboard."

> "It created the impression that it already knew the data from my organization. So that's why it's not helpful."

> "If the average tenure of resigned people has decreased it's a good thing right not a bad thing so why is it saying you know it's you get what i'm saying right... this insight is off."

> "How can you trust the AI overview? Kasi kung ang magagawa lang ng AI is magbigay siya sa akin ng isang overview... Baka hindi tama ang pagsisynthesize niya... So paano ba? How will I trust?"

#### What Users Actually Need

Users want AI to:
- Provide insights based on actual company data
- Offer quantitative breakdowns, not just percentages
- Generate actionable projections
- Answer specific questions about their organization
- Predict future trends based on historical patterns

#### Recommendation

**Critical Priority**: Rework AI development to:
1. Leverage real, company-specific data for all responses
2. Move beyond generic definitions and hypothetical scenarios
3. Generate contextualized insights and quantitative breakdowns
4. Provide actionable projections and recommendations
5. Implement simple feedback mechanism (thumbs up/down) for AI responses
6. Focus on accuracy verification before feature expansion

---

## Tactical Improvements

### INS-005: Always Show Both Percentages and Headcount

**Priority: Medium | Strength: Strong**

#### The Issue

Displaying attrition data solely as percentages can be misleading:
- Small departments: 1 person leaving from 4 = 25% (looks severe)
- Large departments: 10 people leaving from 200 = 5% (looks manageable)
- Without context, users misinterpret severity

#### Key User Quote

> "One problem when it comes to showing attrition by percentages, right, or only percentages is that there is a department in Sprout that has only four people. If one of them resigns, you will say that their attrition is 33.3%... So that's why it has to be balanced by count as well."

#### Recommendation

Always display both percentage and absolute headcount (e.g., "12.5% (23 people)") for all attrition metrics.

---

### INS-006: Clarify Terminology and Consolidate UI

**Priority: Medium | Strength: Strong**

#### Current Issues

- Ambiguous terminology ('last period', 'average tenure')
- Undefined metrics requiring user guesswork
- Inconsistent data presentation
- Redundant AI widgets creating clutter

#### User Impact

- Extra effort to understand data
- Increased cognitive load
- Potential misinterpretation
- Frustration with lack of clarity

#### Key User Quotes

> "There might be some terms here if I'm not exactly in the HR practice that may not be understandable right away like voluntary turnover."

> "Total separations, when you say last period, what is the period? Like what period are you talking about? Are you talking about last quarter, last year? That's not clear."

> "Siguro yung madami lang sidekick dito parang redundant siya for me when there is this na bugs naman. Put it in one AI na talaga."

#### Recommendation

1. Conduct terminology review and standardize definitions
2. Link all metrics to a glossary or provide clear definitions
3. Implement consistent timeframe indicators
4. Consolidate redundant AI widgets into single comprehensive assistant

---

### INS-007: Maintain Strong Core UX and Add Mobile Support

**Priority: Medium | Strength: Strong**

#### What's Working Well

Users appreciate:
- Clean, intuitive visual design
- Fast loading times and responsiveness
- AI overview's 'nudge' for critical data
- Supervisory rankings for quick insights
- Overall innovation compared to older systems

#### What's Missing

- Mobile responsiveness (users want to check data on-the-go)
- More prominent visual cues for critical data
- Bolder "nudges" to draw immediate attention

#### Key User Quotes

> "The first thing that I've noticed is the AI overview... it's giving me a nudge that since it's zero, it has increased from the previous quarter, it requires my immediate attention... Parang it would really help me understand on a very high glance kung ano na yan nangyayari sa akin."

> "Well, just because I'm using mobile now, hopefully it becomes mobile responsive."

> "This is the first time I've been invited to a session like this... This has a wow factor."

#### Recommendation

1. **Prioritize**: Implement full mobile responsiveness
2. Continue iterating on UI/UX for critical data highlights
3. Explore bolder visual cues (bold text, color indicators) for "attention needed" items
4. Leverage positive user perception for marketing and adoption campaigns

---

## Implementation Priorities

### Immediate (P0)
1. **Fix AI to use real company data** - This is breaking user trust
2. **Add headcount to all percentages** - Critical for accurate interpretation
3. **Define all ambiguous terms** - 'Last period', timeframes, etc.

### Short-term (P1)
4. **Implement granular breakdowns** - Regrettable/unregrettable, probationary/FTE, voluntary/involuntary
5. **Add robust time filtering** - Custom date ranges, quarter selection, year-over-year
6. **Consolidate AI widgets** - Single comprehensive assistant

### Medium-term (P2)
7. **Mobile responsiveness** - Critical for daily monitoring use cases
8. **Enhanced visual cues** - Better highlighting of critical data
9. **AI feedback mechanism** - Thumbs up/down to improve accuracy

---

## Conclusion

The Attrition Dashboard has a strong foundation with positive user reception of its core design and concept. However, **trust in AI features is currently broken** and must be addressed immediately. Users need granular, time-bound data presented clearly with both percentages and absolute numbers to make strategic decisions confidently.

By addressing the critical AI issues and implementing the recommended granular breakdowns and time analysis features, the dashboard can become an indispensable tool for strategic workforce planning and proactive talent management.