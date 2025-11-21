/**
 * Chat Simulations
 * Pre-defined conversation flows for simulated chatbot experiences
 */

export interface SimulatedMessage {
    role: "user" | "ai";
    content: string;
    delay?: number; // Delay in ms before showing this message
}

export interface SimulatedFlow {
    messages: SimulatedMessage[];
    autoSend?: boolean; // Whether to auto-send the first user message
}

/**
 * COA Application Simulation
 * Simulates the AI agent applying Certificate of Attendance for the user
 */
export const coaApplicationFlow: SimulatedFlow = {
    autoSend: true,
    messages: [
        {
            role: "user",
            content:
                "I need help applying for Certificate of Attendance for my missing clock in/out logs. Can you assist me with this?",
            delay: 500, // Wait 500ms after opening chat
        },
        {
            role: "ai",
            content:
                "I'll help you apply for your Certificate of Attendance right away. Let me check your missing logs and prepare the application for you.",
            delay: 1000, // Wait 1s after user message
        },
        {
            role: "ai",
            content:
                "I found 3 missing log entries for this pay period:\n\n• January 15, 2025 - Missing clock out\n• January 18, 2025 - Missing clock in\n• January 20, 2025 - Missing clock out\n\nI'm now preparing your Certificate of Attendance application with these details.",
            delay: 2000, // Wait 2s after previous AI message
        },
        {
            role: "ai",
            content:
                "✅ **Certificate of Attendance Application Submitted**\n\nYour application has been successfully submitted for review. Here's what I've done:\n\n• Verified your missing log entries\n• Prepared the Certificate of Attendance form\n• Submitted the application to your supervisor\n• Sent you a confirmation email\n\n**Next Steps:**\nYour supervisor will review and approve the application within 24-48 hours. You'll receive a notification once it's processed.\n\nIs there anything else I can help you with regarding your attendance?",
            delay: 2500, // Wait 2.5s after previous AI message
        },
    ],
};

/**
 * Leave Request Simulation
 */
export const leaveRequestFlow: SimulatedFlow = {
    autoSend: true,
    messages: [
        {
            role: "user",
            content:
                "I'd like to request vacation leave. Can you help me with the process?",
            delay: 500,
        },
        {
            role: "ai",
            content:
                "I'll help you submit your vacation leave request. Let me guide you through the process.",
            delay: 1000,
        },
    ],
};

/**
 * Run Payroll Simulation
 * Simulates the AI agent running payroll for all companies
 */
export const runPayrollFlow: SimulatedFlow = {
    autoSend: true,
    messages: [
        {
            role: "user",
            content:
                "I need to run payroll for all companies. Can you help me process it?",
            delay: 500,
        },
        {
            role: "ai",
            content:
                "I'll process payroll for all companies right away. Let me verify attendance logs and prepare the payroll run.",
            delay: 1000,
        },
        {
            role: "ai",
            content:
                "✅ **Verification Complete**\n\nI've verified attendance logs for all 12 companies:\n\n• All attendance records are complete\n• Overtime calculations verified\n• Leave balances updated\n• Compliance checks passed\n\nReady to process payroll.",
            delay: 2000,
        },
        {
            role: "ai",
            content:
                "🚀 **Payroll Processing Started**\n\nProcessing payroll for:\n\n• Company A - 320 employees\n• Company B - 245 employees\n• Company C - 180 employees\n• ... (9 more companies)\n\nEstimated completion: 2-3 minutes.",
            delay: 2500,
        },
        {
            role: "ai",
            content:
                "✅ **Payroll Processing Complete**\n\nAll payroll runs have been successfully processed!\n\n**Summary:**\n• 12 companies processed\n• 1,847 employees paid\n• Total payroll amount: $2,345,678.90\n• All payments scheduled for next pay date\n• Confirmation emails sent to all supervisors\n\nPayroll is now ready for final review and approval.",
            delay: 3000,
        },
    ],
};

/**
 * Auto-Fix Anomalies Simulation
 * Simulates the AI agent automatically fixing payroll anomalies
 */
export const autoFixAnomaliesFlow: SimulatedFlow = {
    autoSend: true,
    messages: [
        {
            role: "user",
            content:
                "I found anomalies in payroll runs. Can you auto-fix them?",
            delay: 500,
        },
        {
            role: "ai",
            content:
                "I'll analyze and auto-fix the payroll anomalies for you. Let me scan the payroll runs and identify the issues.",
            delay: 1000,
        },
        {
            role: "ai",
            content:
                "🔍 **Anomaly Analysis Complete**\n\nFound 3 anomalies:\n\n1. **Company A** - +15% payroll increase\n   • Issue: Duplicate overtime entries\n   • Fix: Removed duplicate entries\n\n2. **Company B** - Unexpected bonuses\n   • Issue: Incorrect bonus calculation\n   • Fix: Recalculated based on actual performance\n\n3. **Company C** - +8% overtime costs\n   • Issue: Missing shift differential adjustments\n   • Fix: Applied correct shift differentials",
            delay: 2000,
        },
        {
            role: "ai",
            content:
                "🔧 **Auto-Fixing Anomalies...**\n\nApplying corrections to all identified issues...",
            delay: 2500,
        },
        {
            role: "ai",
            content:
                "✅ **Anomalies Fixed Successfully**\n\nAll payroll anomalies have been automatically corrected:\n\n**Fixed Issues:**\n• Company A: Removed duplicate entries (-$12,450)\n• Company B: Recalculated bonuses (-$3,200)\n• Company C: Applied shift differentials (-$5,800)\n\n**Total Savings:** $21,450\n\nPayroll runs are now accurate and ready for processing. All changes have been logged for audit purposes.",
            delay: 3000,
        },
    ],
};

/**
 * Recommend Reallocation Simulation - Under-Staffed Queues
 * Simulates the AI agent analyzing under-staffed queues and recommending reallocation
 */
export const recommendReallocationUnderstaffedFlow: SimulatedFlow = {
    autoSend: true,
    messages: [
        {
            role: "user",
            content:
                "I need recommendations for reallocating staff to address under-staffed queues. Queue A and Queue C need 3 additional agents each to meet SLA targets.",
            delay: 500,
        },
        {
            role: "ai",
            content:
                "I'll analyze your current staffing situation and provide reallocation recommendations to address the under-staffed queues. Let me examine queue loads, staffing levels, and available resources.",
            // Previous: ~200 chars * 10ms = 2000ms typing + 1000ms buffer = 3000ms delay
            delay: 3000,
        },
        {
            role: "ai",
            content:
                "🔍 **Workforce Analysis Complete**\n\nI've analyzed your current staffing situation:\n\n**Current State:**\n• Queue A: Under-staffed (3 agents below threshold)\n• Queue B: Over-staffed (4 agents idle)\n• Queue C: Under-staffed (3 agents below threshold)\n• Queue D: Optimal staffing\n\n**Performance Impact:**\n• Queue A SLA: 87% (below 90% target)\n• Queue B Utilization: 45% (low efficiency)\n• Queue C SLA: 85% (below 90% target)",
            // Previous: ~180 chars * 10ms = 1800ms typing + 500ms loading + 1000ms buffer = 3300ms delay
            delay: 3300,
        },
        {
            role: "ai",
            content:
                "📊 **Reallocation Recommendations**\n\nBased on current demand patterns and SLA targets, here are my recommendations:\n\n**Recommended Moves:**\n\n1. **Move 2 agents from Queue B → Queue A**\n   • Impact: Queue A SLA improves to 92%\n   • Queue B utilization increases to 68%\n\n2. **Move 2 agents from Queue B → Queue C**\n   • Impact: Queue C SLA improves to 91%\n   • Queue B maintains 60% utilization\n\n**Expected Outcomes:**\n• All queues meet 90%+ SLA targets\n• Overall efficiency improves by 12%\n• Better resource utilization across teams",
            // Previous: ~420 chars * 10ms = 4200ms typing + 500ms loading + 1000ms buffer = 5700ms delay
            delay: 5700,
        },
        {
            role: "ai",
            content:
                "✅ **Reallocation Plan Ready**\n\nI've prepared a detailed reallocation plan:\n\n**Plan Summary:**\n• 4 agents reallocated from Queue B\n• 2 agents → Queue A\n• 2 agents → Queue C\n• Effective immediately\n\n**Next Steps:**\n1. Review the recommended changes\n2. Approve to apply reallocation\n3. Notify affected team leads\n4. Monitor SLA improvements\n\nWould you like me to apply these reallocations now, or would you prefer to review and adjust first?",
            // Previous: ~520 chars * 10ms = 5200ms typing + 500ms loading + 1000ms buffer = 6700ms delay
            delay: 6700,
        },
    ],
};

/**
 * Recommend Reallocation Simulation - Absenteeism Spike
 * Simulates the AI agent analyzing absenteeism spike and recommending reallocation to prevent service level drops
 */
export const recommendReallocationAbsenteeismFlow: SimulatedFlow = {
    autoSend: true,
    messages: [
        {
            role: "user",
            content:
                "Absenteeism rate is 12%, higher than the daily target of 8%. The spike is concentrated in morning shifts. I need recommendations for reallocation to prevent service level drops in Queue 2.",
            delay: 500,
        },
        {
            role: "ai",
            content:
                "I'll analyze the absenteeism spike and provide reallocation recommendations to maintain service levels. Let me examine morning shift coverage, reserve staff availability, and queue performance metrics.",
            // Previous: ~200 chars * 10ms = 2000ms typing + 1000ms buffer = 3000ms delay
            delay: 3000,
        },
        {
            role: "ai",
            content:
                "🔍 **Absenteeism Impact Analysis Complete**\n\nI've analyzed the absenteeism spike and its impact:\n\n**Current Situation:**\n• Absenteeism rate: 12% (4% above 8% target)\n• Spike concentrated in morning shifts\n• Queue 2 at risk: Service levels may drop below threshold\n• Morning shift coverage: 15% below optimal\n\n**Available Resources:**\n• Reserve staff: 8 agents available\n• Afternoon shift: Can spare 4 agents\n• Evening shift: Can spare 2 agents",
            // Previous: ~200 chars * 10ms = 2000ms typing + 500ms loading + 1000ms buffer = 3500ms delay
            delay: 3500,
        },
        {
            role: "ai",
            content:
                "📊 **Reallocation Recommendations**\n\nTo address the morning shift absenteeism spike and protect Queue 2 service levels:\n\n**Recommended Actions:**\n\n1. **Activate 4 reserve staff → Morning shift**\n   • Immediate coverage for absent morning agents\n   • Prevents Queue 2 service level drop\n\n2. **Reallocate 2 agents from Afternoon → Morning shift**\n   • Additional buffer for Queue 2\n   • Afternoon shift maintains adequate coverage\n\n3. **Cross-train 2 Evening shift agents for Queue 2**\n   • Backup support if needed\n   • Minimal impact on evening operations\n\n**Expected Outcomes:**\n• Queue 2 service levels maintained above threshold\n• Morning shift coverage restored to optimal levels\n• Absenteeism impact mitigated within 2 hours",
            // Previous: ~450 chars * 10ms = 4500ms typing + 500ms loading + 1000ms buffer = 6000ms delay
            delay: 6000,
        },
        {
            role: "ai",
            content:
                "✅ **Reallocation Plan Ready**\n\nI've prepared an immediate action plan:\n\n**Plan Summary:**\n• 4 reserve staff activated for morning shift\n• 2 agents reallocated from afternoon → morning\n• 2 evening agents cross-trained for Queue 2 backup\n• Implementation: Immediate (within 30 minutes)\n\n**Next Steps:**\n1. Activate reserve staff immediately\n2. Notify affected team leads\n3. Monitor Queue 2 service levels\n4. Adjust if absenteeism continues\n\nThis plan will prevent Queue 2 service levels from dropping in the next 2 hours. Should I proceed with activating the reserve staff now?",
            // Previous: ~650 chars * 10ms = 6500ms typing + 500ms loading + 1000ms buffer = 8000ms delay
            delay: 8000,
        },
    ],
};

/**
 * View Contributors Simulation - Team Delta Productivity
 * Simulates the AI agent analyzing Team Delta productivity decline and showing contributors
 */
export const viewContributorsProductivityFlow: SimulatedFlow = {
    autoSend: true,
    messages: [
        {
            role: "user",
            content:
                "Team Delta productivity is down by 14% today. Can you show me what's contributing to this decline?",
            delay: 500,
        },
        {
            role: "ai",
            content:
                "I'll analyze Team Delta's productivity decline and identify the key contributors. Let me examine performance metrics, call data, and system logs.",
            delay: 3000,
        },
        {
            role: "ai",
            content:
                "🔍 **Productivity Analysis Complete**\n\nI've identified the main contributors to Team Delta's 14% productivity decline:\n\n**Primary Contributors:**\n\n1. **Increased Call Complexity** (+8% impact)\n   • Average call duration increased by 2.3 minutes\n   • Complex technical issues up 35%\n   • Resolution time increased by 18%\n\n2. **System Delays** (+5% impact)\n   • System response time increased by 40%\n   • Database queries taking 2-3x longer\n   • Multiple system timeouts reported\n\n3. **Training Gaps** (+1% impact)\n   • 3 team members handling new product lines\n   • Limited experience with updated procedures",
            delay: 3500,
        },
        {
            role: "ai",
            content:
                "📊 **Detailed Breakdown**\n\n**By Team Member:**\n• Agent A: -18% (most affected by system delays)\n• Agent B: -15% (handling complex technical calls)\n• Agent C: -12% (new product line training)\n• Agent D: -10% (increased call complexity)\n• Agent E: -8% (system performance issues)\n\n**By Time Period:**\n• Morning shift: -12% decline\n• Afternoon shift: -16% decline (peak system delays)\n• Evening shift: -10% decline",
            delay: 6000,
        },
        {
            role: "ai",
            content:
                "💡 **Recommendations**\n\nTo address Team Delta's productivity decline:\n\n**Immediate Actions:**\n1. Escalate system performance issues to IT team\n2. Provide quick reference guides for new product lines\n3. Assign senior agents to mentor those handling complex calls\n\n**Short-term Solutions:**\n• Implement system performance monitoring\n• Schedule additional training sessions\n• Redistribute complex calls to specialized agents\n\n**Expected Impact:**\n• System fixes: +5-7% productivity recovery\n• Training improvements: +3-4% productivity recovery\n• Better call routing: +2-3% productivity recovery\n\nWould you like me to create an action plan to address these contributors?",
            delay: 8000,
        },
    ],
};

/**
 * See Insights Simulation - QA Pass Rate Decline
 * Simulates the AI agent analyzing QA pass rate decline and providing insights
 */
export const seeInsightsQAFlow: SimulatedFlow = {
    autoSend: true,
    messages: [
        {
            role: "user",
            content:
                "QA pass rate decreased from 92% to 86%. The decline is concentrated in compliance-related errors. Can you provide insights on what's causing this?",
            delay: 500,
        },
        {
            role: "ai",
            content:
                "I'll analyze the QA pass rate decline and provide detailed insights on the compliance-related errors. Let me examine QA scores, error patterns, and recent changes.",
            delay: 3000,
        },
        {
            role: "ai",
            content:
                "🔍 **QA Analysis Complete**\n\nI've analyzed the 6% drop in QA pass rate (92% → 86%). Here's what I found:\n\n**Error Breakdown:**\n\n**Compliance-Related Errors (68% of failures):**\n• Missing required disclosures: 24% of failures\n• Incorrect compliance statements: 18% of failures\n• Documentation gaps: 15% of failures\n• Policy violations: 11% of failures\n\n**Other Errors (32% of failures):**\n• Communication issues: 12%\n• Process errors: 10%\n• Technical errors: 10%",
            delay: 3500,
        },
        {
            role: "ai",
            content:
                "📊 **Root Cause Analysis**\n\n**Primary Causes:**\n\n1. **Recent Policy Updates** (40% impact)\n   • New compliance requirements introduced 2 weeks ago\n   • Team not fully trained on updated procedures\n   • Quick reference materials not yet available\n\n2. **Increased Call Volume** (25% impact)\n   • 30% increase in compliance-related calls\n   • Agents rushing through required disclosures\n   • Less time for proper documentation\n\n3. **Training Gaps** (20% impact)\n   • 5 team members missed recent compliance training\n   • New hires not yet certified on compliance procedures\n   • Refresher training overdue for 3 agents\n\n4. **System Changes** (15% impact)\n   • Updated compliance checklists not fully integrated\n   • Some required fields not clearly marked\n   • Workflow changes causing confusion",
            delay: 6000,
        },
        {
            role: "ai",
            content:
                "💡 **Actionable Insights**\n\n**Immediate Actions:**\n1. Schedule urgent compliance refresher training (all team members)\n2. Create quick reference cards for new compliance requirements\n3. Review and simplify compliance checklist in system\n4. Assign compliance specialists to mentor struggling agents\n\n**By Team Member:**\n• High priority: 3 agents with 3+ compliance errors\n• Medium priority: 5 agents with 2 compliance errors\n• Low priority: 7 agents with 1 compliance error\n\n**Expected Recovery:**\n• With training: +4-5% QA pass rate improvement\n• With system improvements: +1-2% improvement\n• Target: Return to 90%+ pass rate within 2 weeks\n\n**Risk Mitigation:**\n• Client satisfaction scores may drop if not addressed quickly\n• Compliance violations could lead to regulatory issues\n• Team morale affected by increased error rates\n\nWould you like me to create a detailed training plan to address these compliance errors?",
            delay: 8000,
        },
    ],
};

/**
 * View Patterns Simulation - Attrition Risk
 * Simulates the AI agent analyzing attrition risk patterns and showing patterns
 */
export const viewPatternsAttritionFlow: SimulatedFlow = {
    autoSend: true,
    messages: [
        {
            role: "user",
            content:
                "7 agents show early indicators of potential attrition risk. Risk indicators include attendance dips and engagement score declines. Can you show me the patterns you've detected?",
            delay: 500,
        },
        {
            role: "ai",
            content:
                "I'll analyze the attrition risk patterns for the 7 agents showing early indicators. Let me examine their attendance patterns, engagement trends, and other risk factors.",
            delay: 3000,
        },
        {
            role: "ai",
            content:
                "🔍 **Attrition Risk Patterns Identified**\n\nI've identified consistent patterns across the 7 at-risk agents:\n\n**Common Patterns:**\n\n1. **Attendance Decline Pattern** (6 out of 7 agents)\n   • 3-4 unplanned absences in the last 30 days\n   • Increased late arrivals (15-20% increase)\n   • Pattern: Declining attendance over past 2 months\n\n2. **Engagement Score Drop** (7 out of 7 agents)\n   • Average engagement drop: 12-18 points\n   • Declining trend over past 6 weeks\n   • Below team average by 15-25 points\n\n3. **Performance Shift** (5 out of 7 agents)\n   • Productivity decreased by 8-12%\n   • Quality scores dropped 5-8%\n   • Less participation in team activities",
            delay: 3500,
        },
        {
            role: "ai",
            content:
                "📊 **Detailed Pattern Analysis**\n\n**By Agent:**\n\n**High Risk (3 agents):**\n• Agent A: Attendance -22%, Engagement -18pts, Performance -12%\n• Agent B: Attendance -18%, Engagement -15pts, Performance -10%\n• Agent C: Attendance -20%, Engagement -16pts, Performance -11%\n\n**Medium Risk (4 agents):**\n• Agent D: Attendance -12%, Engagement -12pts, Performance -8%\n• Agent E: Attendance -15%, Engagement -14pts, Performance -9%\n• Agent F: Attendance -10%, Engagement -10pts, Performance -7%\n• Agent G: Attendance -14%, Engagement -13pts, Performance -8%\n\n**Timeline Pattern:**\n• Week 1-2: Initial engagement decline\n• Week 3-4: Attendance patterns start changing\n• Week 5-6: Performance metrics begin dropping\n• Current: All indicators showing continued decline",
            delay: 6000,
        },
        {
            role: "ai",
            content:
                "💡 **Risk Assessment & Recommendations**\n\n**Risk Level:** High - Early intervention critical\n\n**Predicted Timeline:**\n• Without intervention: 2-4 weeks to potential departure\n• With intervention: 60-70% retention probability\n\n**Recommended Actions:**\n\n1. **Immediate (This Week):**\n   • Schedule 1-on-1 meetings with all 7 agents\n   • Address attendance concerns directly\n   • Gather feedback on engagement decline causes\n\n2. **Short-term (Next 2 Weeks):**\n   • Implement retention strategies (flexible schedules, recognition programs)\n   • Provide additional support and resources\n   • Assign mentors or career development opportunities\n\n3. **Ongoing:**\n   • Monitor engagement scores weekly\n   • Track attendance patterns\n   • Regular check-ins with at-risk agents\n\n**Expected Impact:**\n• Early intervention can prevent 4-5 agent departures\n• Improved engagement scores within 4-6 weeks\n• Better team stability and knowledge retention\n\nWould you like me to create a detailed intervention plan for these agents?",
            delay: 8000,
        },
    ],
};

/**
 * See Feedback Summary Simulation - Team Engagement Decline
 * Simulates the AI agent analyzing team engagement feedback and providing summary
 */
export const seeFeedbackSummaryFlow: SimulatedFlow = {
    autoSend: true,
    messages: [
        {
            role: "user",
            content:
                "Engagement scores for Team Gamma dropped this week. The sentiment decline may be linked to recent schedule changes. Can you provide a summary of the feedback?",
            delay: 500,
        },
        {
            role: "ai",
            content:
                "I'll analyze Team Gamma's engagement feedback and provide a comprehensive summary. Let me gather feedback from team members, review recent changes, and identify key themes.",
            delay: 3000,
        },
        {
            role: "ai",
            content:
                "📋 **Feedback Summary - Team Gamma**\n\nI've compiled feedback from 24 team members (89% response rate):\n\n**Overall Sentiment:**\n• Engagement score: 68/100 (down from 82/100 last week)\n• Net Promoter Score: -15 (down from +12)\n• Overall satisfaction: 6.2/10 (down from 7.8/10)\n\n**Key Themes Identified:**\n\n1. **Schedule Changes** (mentioned by 18/24 respondents)\n   • 75% negative feedback on new shift patterns\n   • Concerns about work-life balance\n   • Difficulty adjusting to new schedules\n\n2. **Communication Issues** (mentioned by 12/24 respondents)\n   • Lack of advance notice on schedule changes\n   • Insufficient explanation of changes\n   • Feeling uninformed about decisions",
            delay: 3500,
        },
        {
            role: "ai",
            content:
                '📊 **Detailed Feedback Breakdown**\n\n**Schedule-Related Feedback:**\n\n**Negative (18 responses):**\n• "New schedule conflicts with family commitments" (8 mentions)\n• "Not enough time to adjust to changes" (6 mentions)\n• "Shift times don\'t work for my commute" (4 mentions)\n• "Feeling burned out from constant changes" (5 mentions)\n\n**Positive (6 responses):**\n• "Appreciate the flexibility options" (3 mentions)\n• "Some shifts work better for me" (3 mentions)\n\n**Other Concerns:**\n• Workload distribution (9 mentions)\n• Recognition and appreciation (7 mentions)\n• Career development opportunities (5 mentions)\n• Team communication (6 mentions)',
            delay: 6000,
        },
        {
            role: "ai",
            content:
                "💡 **Actionable Insights & Recommendations**\n\n**Root Cause:**\nRecent schedule changes implemented without adequate consultation or transition period, causing significant disruption to work-life balance.\n\n**Immediate Actions:**\n1. **Schedule Review** (This Week)\n   • Review individual schedule conflicts\n   • Offer flexible alternatives where possible\n   • Provide transition period for adjustments\n\n2. **Communication Improvements** (This Week)\n   • Hold team meeting to address concerns\n   • Explain rationale behind schedule changes\n   • Establish feedback channels for future changes\n\n3. **Support Measures** (Next 2 Weeks)\n   • Provide resources for work-life balance\n   • Offer schedule swap options\n   • Consider phased implementation approach\n\n**Expected Recovery:**\n• With immediate action: Engagement scores recover to 75+ within 2-3 weeks\n• Improved communication: Better understanding and acceptance\n• Flexible options: Reduced negative sentiment\n\n**Risk Mitigation:**\n• Without action: Engagement may drop further, increasing attrition risk\n• Team morale could continue declining\n• Productivity may be affected\n\nWould you like me to create a detailed action plan to address these feedback themes?",
            delay: 8000,
        },
    ],
};

/**
 * See Department Breakdown Simulation - Payroll Variance
 * Simulates the AI agent analyzing payroll variance and showing department breakdown
 */
export const seeDepartmentBreakdownFlow: SimulatedFlow = {
    autoSend: true,
    messages: [
        {
            role: "user",
            content:
                "Payroll cost is trending +11% vs last month. The variance is driven by overtime hours and shift differentials. Can you show me the department breakdown?",
            delay: 500,
        },
        {
            role: "ai",
            content:
                "I'll analyze the payroll variance and provide a detailed breakdown by department. Let me examine overtime hours, shift differentials, and department-level costs.",
            delay: 3000,
        },
        {
            role: "ai",
            content:
                "📊 **Department Breakdown - Payroll Variance**\n\nI've analyzed the 11% payroll increase across all departments:\n\n**Overall Summary:**\n• Total payroll increase: +11% ($245,680 increase)\n• Overtime hours: +18% increase\n• Shift differentials: +12% increase\n• Base payroll: +8% increase\n\n**By Department:**\n\n1. **Customer Service** (+15% / +$98,450)\n   • Overtime: +25% (peak season demand)\n   • Shift differentials: +18%\n   • Base payroll: +10%\n\n2. **Operations** (+12% / +$67,200)\n   • Overtime: +20% (project deadlines)\n   • Shift differentials: +15%\n   • Base payroll: +8%\n\n3. **Sales** (+9% / +$45,300)\n   • Overtime: +12% (quarter-end push)\n   • Shift differentials: +8%\n   • Base payroll: +7%",
            delay: 3500,
        },
        {
            role: "ai",
            content:
                "📈 **Detailed Analysis**\n\n**Remaining Departments:**\n\n4. **IT Support** (+8% / +$18,500)\n   • Overtime: +10%\n   • Shift differentials: +6%\n   • Base payroll: +7%\n\n5. **HR** (+6% / +$8,200)\n   • Overtime: +5%\n   • Shift differentials: +4%\n   • Base payroll: +6%\n\n6. **Finance** (+5% / +$8,030)\n   • Overtime: +8%\n   • Shift differentials: +3%\n   • Base payroll: +4%\n\n**Key Drivers:**\n• Customer Service: Peak season requiring extended hours\n• Operations: Critical project deadlines\n• Sales: Quarter-end performance push\n• Overall: Increased demand across all departments",
            delay: 6000,
        },
        {
            role: "ai",
            content:
                "💡 **Recommendations**\n\n**Budget Impact:**\n• Current trend: Budget may exceed allocation by $45,000 this month\n• If trend continues: Annual budget overrun risk\n\n**Cost Optimization Opportunities:**\n\n1. **Customer Service** (Highest impact)\n   • Consider hiring temporary staff instead of overtime\n   • Redistribute workload across shifts\n   • Expected savings: $25,000-30,000/month\n\n2. **Operations**\n   • Better project planning to reduce rush overtime\n   • Cross-train staff for flexibility\n   • Expected savings: $15,000-20,000/month\n\n3. **Sales**\n   • Incentive structure review (may reduce overtime need)\n   • Better forecasting for quarter-end\n   • Expected savings: $8,000-12,000/month\n\n**Action Items:**\n1. Review overtime approval process\n2. Analyze shift differential costs\n3. Consider hiring vs overtime trade-offs\n4. Monitor department budgets weekly\n\nWould you like me to create a detailed cost optimization plan?",
            delay: 8000,
        },
    ],
};

/**
 * Notify Them Simulation - Missing Clock Logs
 * Simulates the AI agent notifying employees about missing clock in/out logs
 */
export const notifyThemMissingLogsFlow: SimulatedFlow = {
    autoSend: true,
    messages: [
        {
            role: "user",
            content:
                "15 employees have missing clock in/out logs affecting payroll processing. Missing logs detected for the current pay period. Can you notify them to submit attendance corrections?",
            delay: 500,
        },
        {
            role: "ai",
            content:
                "I'll notify all 15 employees about their missing clock in/out logs and guide them through submitting attendance corrections. Let me prepare personalized notifications for each employee.",
            delay: 3000,
        },
        {
            role: "ai",
            content:
                "📧 **Notification Preparation Complete**\n\nI've prepared notifications for all 15 employees:\n\n**Missing Logs Summary:**\n• Total employees affected: 15\n• Total missing log entries: 23\n• Pay period: Current pay period\n• Deadline: Before payroll cutoff (2 days remaining)\n\n**By Employee:**\n\n**High Priority (5 employees - 3+ missing logs):**\n• Employee A: 4 missing logs (Jan 15, 18, 20, 22)\n• Employee B: 3 missing logs (Jan 16, 19, 21)\n• Employee C: 3 missing logs (Jan 17, 20, 23)\n• Employee D: 3 missing logs (Jan 18, 21, 24)\n• Employee E: 3 missing logs (Jan 19, 22, 25)\n\n**Medium Priority (7 employees - 2 missing logs):**\n• Employee F-H: 2 missing logs each\n\n**Low Priority (3 employees - 1 missing log):**\n• Employee I-K: 1 missing log each",
            delay: 3500,
        },
        {
            role: "ai",
            content:
                "📨 **Notification Details**\n\n**Notification Method:**\n• Email: All 15 employees\n• SMS: High priority employees (5)\n• In-app notification: All 15 employees\n\n**Message Content:**\n• Clear explanation of missing logs\n• Step-by-step instructions for correction\n• Deadline reminder (2 days)\n• Link to attendance correction form\n• Support contact information\n\n**Personalized Elements:**\n• Specific missing dates for each employee\n• Individual correction links\n• Department-specific instructions\n• Manager contact information",
            delay: 6000,
        },
        {
            role: "ai",
            content:
                "✅ **Notifications Sent Successfully**\n\n**Delivery Status:**\n• Email notifications: 15/15 sent\n• SMS notifications: 5/5 sent\n• In-app notifications: 15/15 sent\n• All notifications delivered successfully\n\n**Next Steps:**\n1. Monitor response rate (check in 24 hours)\n2. Send reminder to non-responders (if needed)\n3. Track correction submissions\n4. Verify logs before payroll cutoff\n\n**Expected Timeline:**\n• Most employees will submit within 24 hours\n• Follow-up reminders for non-responders\n• All corrections should be completed within 48 hours\n\n**Impact:**\n• Payroll processing can proceed on schedule\n• Accurate payroll for all employees\n• Compliance maintained\n\n**Monitoring:**\nI'll track submission status and send you updates. Would you like me to set up automatic reminders for employees who haven't submitted corrections within 24 hours?",
            delay: 8000,
        },
    ],
};

/**
 * Approve Leaves Simulation - Vacation Leave Requests
 * Simulates the AI agent helping approve vacation leave requests
 */
export const approveLeavesFlow: SimulatedFlow = {
    autoSend: true,
    messages: [
        {
            role: "user",
            content:
                "8 employees have requested vacation leave pending approval. Some requests overlap with peak hours. Can you help me review and approve these leave requests?",
            delay: 500,
        },
        {
            role: "ai",
            content:
                "I'll review all 8 vacation leave requests, check for conflicts, assess staffing impact, and help you approve them efficiently. Let me analyze each request against coverage requirements and peak hours.",
            delay: 3000,
        },
        {
            role: "ai",
            content:
                "📋 **Leave Request Review**\n\nI've analyzed all 8 vacation leave requests:\n\n**Request Summary:**\n• Total requests: 8\n• Total days requested: 42 days\n• Overlapping requests: 3 pairs\n• Peak hour conflicts: 2 requests\n\n**By Request:**\n\n**Safe to Approve (5 requests):**\n• Request 1: Employee A - 5 days (Feb 10-14)\n  ✓ Adequate coverage available\n  ✓ No peak hour conflicts\n  ✓ No overlapping requests\n\n• Request 2: Employee B - 3 days (Feb 18-20)\n  ✓ Adequate coverage available\n  ✓ No conflicts\n\n• Request 3: Employee C - 7 days (Feb 25-Mar 3)\n  ✓ Adequate coverage available\n  ✓ No peak hour conflicts",
            delay: 3500,
        },
        {
            role: "ai",
            content:
                "⚠️ **Requests Requiring Review (3 requests):**\n\n**Request 4: Employee D - 6 days (Feb 12-17)**\n  ⚠️ Overlaps with Request 1 (Feb 10-14)\n  ⚠️ Peak hours on Feb 12-13\n  💡 Recommendation: Approve but require coverage plan\n\n**Request 5: Employee E - 4 days (Feb 15-18)**\n  ⚠️ Overlaps with Request 2 (Feb 18-20)\n  ⚠️ Peak hours on Feb 15-16\n  💡 Recommendation: Approve with staggered coverage\n\n**Request 6: Employee F - 5 days (Feb 20-24)**\n  ⚠️ Overlaps with Request 2 (Feb 18-20)\n  ✓ No peak hour conflicts\n  💡 Recommendation: Approve with coverage plan\n\n**Remaining Requests:**\n• Request 7: Employee G - 7 days (Mar 5-11) - Safe to approve\n• Request 8: Employee H - 5 days (Mar 15-19) - Safe to approve",
            delay: 6000,
        },
        {
            role: "ai",
            content:
                "✅ **Approval Recommendation**\n\n**Recommended Action:**\n\n**Approve All 8 Requests** with the following conditions:\n\n**Immediate Approval (5 requests):**\n• Requests 1, 2, 3, 7, 8 - Approve immediately\n• No conflicts or concerns\n• Adequate coverage available\n\n**Conditional Approval (3 requests):**\n• Requests 4, 5, 6 - Approve with coverage requirements\n• Require coverage plans from department managers\n• Monitor staffing levels during leave periods\n\n**Coverage Plans Needed:**\n• Feb 12-17: Additional coverage for peak hours\n• Feb 15-18: Staggered coverage arrangement\n• Feb 20-24: Standard coverage plan\n\n**Expected Impact:**\n• All employees get approved leave\n• Adequate staffing maintained\n• Peak hours covered\n• Employee satisfaction maintained\n\n**Next Steps:**\n1. Approve all 8 requests\n2. Notify department managers about coverage needs\n3. Set up coverage plans for overlapping periods\n4. Send approval confirmations to employees\n\nWould you like me to proceed with approving all requests and notifying the relevant parties?",
            delay: 8000,
        },
    ],
};

/**
 * Generic simulation flows
 */
export const simulationFlows: Record<string, SimulatedFlow> = {
    coa: coaApplicationFlow,
    leave: leaveRequestFlow,
    "run-payroll": runPayrollFlow,
    "auto-fix-anomalies": autoFixAnomaliesFlow,
    "recommend-reallocation-understaffed":
        recommendReallocationUnderstaffedFlow,
    "recommend-reallocation-absenteeism": recommendReallocationAbsenteeismFlow,
    "view-contributors-productivity": viewContributorsProductivityFlow,
    "see-insights-qa": seeInsightsQAFlow,
    "view-patterns-attrition": viewPatternsAttritionFlow,
    "see-feedback-summary": seeFeedbackSummaryFlow,
    "see-department-breakdown": seeDepartmentBreakdownFlow,
    "notify-them-missing-logs": notifyThemMissingLogsFlow,
    "approve-leaves": approveLeavesFlow,
};
