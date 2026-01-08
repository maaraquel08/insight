"use client";

import React from "react";
import { Sparkle, CaretRight, CaretDown, CaretUp } from "phosphor-react";
import { CompanyHealthCard } from "./company-health-card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function MetricCardsSection() {
    // AI-generated context summary (1-2 sentences)
    const aiContext =
        "Company health score improved by 3 points, driven by better retention rates and reduced overtime costs. Engagement metrics show steady growth across all departments.";

    return (
        <div className="bg-white border border-[#d9dede] border-solid relative rounded-2xl w-full overflow-hidden">
            {/* Card Header */}
            <div className="bg-white border-b border-[#d9dede] border-solid flex gap-2 items-center justify-center px-4 py-3 relative shrink-0 w-full">
                <div className="flex gap-2 grow items-center min-w-0 relative shrink-0">
                    <div className="flex flex-col grow items-start justify-center min-w-0 relative shrink-0">
                        <div className="flex gap-2 items-center relative shrink-0 w-full">
                            <p className="text-base font-medium leading-5 relative shrink-0 text-[#262b2b] whitespace-nowrap">
                                Company Health
                            </p>
                        </div>
                        <p className="text-sm font-normal leading-5 relative shrink-0 text-[#5d6c6b] w-full">
                            Overall company health metrics
                        </p>
                    </div>
                </div>
                {/* Change Badge */}
                <div className="bg-[#dcfce6] border border-[#158039] border-solid flex gap-0.5 items-center justify-center p-1 relative rounded-md shrink-0">
                    <p className="text-xs font-medium leading-3 uppercase tracking-[0.7px] whitespace-nowrap text-[#158039]">
                        +3 pts vs last month
                    </p>
                </div>
            </div>

            {/* AI Context Section */}
            <div className="border-b border-[#d9dede] border-solid relative shrink-0 w-full">
                <div className="rotating-gradient-border w-full">
                    <div className="flex gap-2 items-center p-4 relative z-10">
                        <Sparkle
                            className="w-6 h-6 text-[#8139ee] shrink-0"
                            weight="fill"
                        />
                        <p className="flex-1 font-normal grow leading-5 min-w-0 relative shrink-0 text-[#262b2b] text-sm">
                            {aiContext}
                        </p>
                        <Dialog>
                            <DialogTrigger asChild>
                                <button
                                    type="button"
                                    className="bg-white border border-[#b8c1c0] border-solid max-h-9 min-w-[48px] relative rounded-lg shrink-0 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <div className="box-border flex gap-2 items-center justify-center max-h-inherit min-w-inherit overflow-clip p-2 relative rounded-[inherit]">
                                        <div className="flex gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                                            <p className="flex flex-col font-medium justify-center leading-0 relative shrink-0 text-[#262b2b] text-sm text-nowrap tracking-normal">
                                                <span className="leading-4 whitespace-pre">
                                                    Explore Insight
                                                </span>
                                            </p>
                                        </div>
                                        <CaretRight
                                            className="w-3 h-3 text-[#262b2b] shrink-0"
                                            weight="fill"
                                        />
                                    </div>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[720px] max-h-[80vh] overflow-y-auto p-0">
                                <DialogHeader className="p-4 border-b border-[#d9dede]">
                                    <DialogTitle>
                                        Company Health Insights
                                    </DialogTitle>
                                    <DialogDescription>
                                        Understanding your organization&apos;s
                                        overall health and performance
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-4 items-start p-4 relative shrink-0 w-full">
                                    {/* Section 1: What is Company Health */}
                                    <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
                                        <h3 className="text-base font-medium text-[#262b2b] leading-5">
                                            What is Company Health?
                                        </h3>
                                        <p className="text-base font-normal text-[#5d6c6b] leading-6 w-full">
                                            Company Health is a comprehensive
                                            metric that measures the overall
                                            well-being and performance of your
                                            organization. It combines five key
                                            dimensions to provide a holistic
                                            view of how your company is
                                            performing across people, culture,
                                            and operations.
                                        </p>
                                    </div>

                                    {/* Section 2: Five Components */}
                                    <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
                                        <h3 className="text-base font-medium text-[#262b2b] leading-5">
                                            Five Components
                                        </h3>
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full space-y-4"
                                        >
                                            {/* Retention Accordion */}
                                            <AccordionItem
                                                value="retention"
                                                className="border border-[#d9dede] border-solid rounded-xl overflow-hidden"
                                            >
                                                <AccordionTrigger
                                                    showDefaultIcon={false}
                                                    className="flex gap-4 items-start justify-between min-w-[240px] p-4 hover:no-underline [&[data-state=open]>div>div>svg]:rotate-180 w-full"
                                                >
                                                    <div className="flex gap-4 items-start flex-1 w-full min-w-0">
                                                        <div className="bg-[#17ad49] rounded w-6 h-6 shrink-0" />
                                                        <div className="flex flex-col gap-2 flex-1 items-start justify-center min-w-0 w-full">
                                                            <h4 className="text-base font-medium text-[#262b2b] text-left w-full">
                                                                Retention (20%)
                                                            </h4>
                                                            <p className="text-base font-normal text-[#5d6c6b] leading-6 w-full text-left">
                                                                Measures
                                                                employee
                                                                retention rates
                                                                and turnover.
                                                                High retention
                                                                indicates
                                                                satisfied
                                                                employees and
                                                                reduced hiring
                                                                costs.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white border border-[#b8c1c0] border-solid max-h-9 relative rounded-md shrink-0 hover:bg-gray-50 transition-all pointer-events-none">
                                                        <div className="flex items-center justify-center max-h-inherit overflow-clip p-1.5 relative rounded-[inherit]">
                                                            <CaretDown
                                                                className="w-4 h-4 text-[#262b2b] shrink-0 transition-transform duration-200 ease-in-out"
                                                                weight="regular"
                                                            />
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-4 pb-4">
                                                    <div className="flex flex-col gap-4 w-full">
                                                        {/* What goes into the score section */}
                                                        <div className="flex flex-col gap-2 items-start w-full min-w-0">
                                                            <h5 className="text-base font-medium text-[#262b2b] leading-6">
                                                                What goes into
                                                                the score:
                                                            </h5>
                                                            <ul className="list-disc ml-6 text-base font-normal text-[#5d6c6b] leading-6 space-y-0">
                                                                <li className="mb-0">
                                                                    Monthly and
                                                                    quarterly
                                                                    attrition
                                                                    rate
                                                                </li>
                                                                <li className="mb-0">
                                                                    Early tenure
                                                                    turnover
                                                                </li>
                                                                <li className="mb-0">
                                                                    Average
                                                                    tenure
                                                                </li>
                                                                <li>
                                                                    Voluntary vs
                                                                    involuntary
                                                                    separations
                                                                </li>
                                                            </ul>
                                                        </div>

                                                        {/* Retention Score Formula Box */}
                                                        <div className="bg-[#f7f8f8] rounded-xl p-3 w-full">
                                                            <div
                                                                className="flex flex-col gap-2 text-sm font-normal text-[#5d6c6b] leading-normal"
                                                                style={{
                                                                    fontFamily:
                                                                        "var(--font-roboto-mono, 'Roboto Mono', monospace)",
                                                                }}
                                                            >
                                                                <p className="mb-0 text-[#985008]">
                                                                    Retention
                                                                    Score =
                                                                </p>
                                                                <p>
                                                                    <span className="text-[#158039]">
                                                                        100
                                                                    </span>
                                                                    <span>{` – (`}</span>
                                                                    <span className="text-[#1356ba]">
                                                                        Attrition
                                                                        Rate
                                                                        Penalty
                                                                    </span>
                                                                    <span>{` + `}</span>
                                                                    <span className="text-[#b61f27]">
                                                                        Early
                                                                        Tenure
                                                                        Dropoff
                                                                        Penalty
                                                                    </span>
                                                                    )
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>

                                            {/* Engagement Accordion */}
                                            <AccordionItem
                                                value="engagement"
                                                className="border border-[#d9dede] border-solid rounded-xl overflow-hidden"
                                            >
                                                <AccordionTrigger
                                                    showDefaultIcon={false}
                                                    className="flex gap-4 items-start justify-between min-w-[240px] p-4 hover:no-underline [&[data-state=open]>div>div>svg]:rotate-180 w-full"
                                                >
                                                    <div className="flex gap-4 items-start flex-1 w-full min-w-0">
                                                        <div className="bg-[#8139ee] rounded w-6 h-6 shrink-0" />
                                                        <div className="flex flex-col gap-2 flex-1 items-start justify-center min-w-0 w-full">
                                                            <h4 className="text-base font-medium text-[#262b2b] text-left w-full">
                                                                Engagement (30%)
                                                            </h4>
                                                            <p className="text-base font-normal text-[#5d6c6b] leading-6 w-full text-left">
                                                                Tracks employee
                                                                engagement
                                                                levels,
                                                                participation in
                                                                activities, and
                                                                overall job
                                                                satisfaction.
                                                                This is the
                                                                largest
                                                                component of
                                                                your health
                                                                score.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white border border-[#b8c1c0] border-solid max-h-9 relative rounded-md shrink-0 hover:bg-gray-50 transition-all pointer-events-none">
                                                        <div className="flex items-center justify-center max-h-inherit overflow-clip p-1.5 relative rounded-[inherit]">
                                                            <CaretDown
                                                                className="w-4 h-4 text-[#262b2b] shrink-0 transition-transform duration-200 ease-in-out"
                                                                weight="regular"
                                                            />
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-4 pb-4">
                                                    <div className="flex flex-col gap-4 w-full">
                                                        {/* What goes into the score section */}
                                                        <div className="flex flex-col gap-2 items-start w-full min-w-0">
                                                            <h5 className="text-base font-medium text-[#262b2b] leading-6">
                                                                What goes into
                                                                the score:
                                                            </h5>
                                                            <ul className="list-disc ml-6 text-base font-normal text-[#5d6c6b] leading-6 space-y-0">
                                                                <li className="mb-0">
                                                                    Pulse survey
                                                                    results
                                                                </li>
                                                                <li className="mb-0">
                                                                    eNPS
                                                                </li>
                                                                <li className="mb-0">
                                                                    Participation
                                                                    rates
                                                                </li>
                                                                <li>
                                                                    Manager
                                                                    responsiveness
                                                                    &amp;
                                                                    follow-up
                                                                </li>
                                                            </ul>
                                                        </div>

                                                        {/* Engagement Score Formula Box */}
                                                        <div className="bg-[#f7f8f8] rounded-xl p-3 w-full">
                                                            <div
                                                                className="flex flex-col gap-2 text-sm font-normal text-[#5d6c6b] leading-normal"
                                                                style={{
                                                                    fontFamily:
                                                                        "var(--font-roboto-mono, 'Roboto Mono', monospace)",
                                                                }}
                                                            >
                                                                <p className="mb-0 text-[#985008]">
                                                                    Engagement
                                                                    Score =
                                                                </p>
                                                                <p>
                                                                    Weighted
                                                                    average of
                                                                    survey &amp;
                                                                    sentiment
                                                                    metrics
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>

                                            {/* Wellbeing Accordion */}
                                            <AccordionItem
                                                value="wellbeing"
                                                className="border border-[#d9dede] border-solid rounded-xl overflow-hidden"
                                            >
                                                <AccordionTrigger
                                                    showDefaultIcon={false}
                                                    className="flex gap-4 items-start justify-between min-w-[240px] p-4 hover:no-underline [&[data-state=open]>div>div>svg]:rotate-180 w-full"
                                                >
                                                    <div className="flex gap-4 items-start flex-1 w-full min-w-0">
                                                        <div className="bg-[#ff7f00] rounded w-6 h-6 shrink-0" />
                                                        <div className="flex flex-col gap-2 flex-1 items-start justify-center min-w-0 w-full">
                                                            <h4 className="text-base font-medium text-[#262b2b] text-left w-full">
                                                                Wellbeing (20%)
                                                            </h4>
                                                            <p className="text-base font-normal text-[#5d6c6b] leading-6 w-full text-left">
                                                                Assesses
                                                                employee
                                                                wellness,
                                                                work-life
                                                                balance, and
                                                                mental health
                                                                support. Healthy
                                                                employees are
                                                                more productive
                                                                and engaged.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white border border-[#b8c1c0] border-solid max-h-9 relative rounded-md shrink-0 hover:bg-gray-50 transition-all pointer-events-none">
                                                        <div className="flex items-center justify-center max-h-inherit overflow-clip p-1.5 relative rounded-[inherit]">
                                                            <CaretDown
                                                                className="w-4 h-4 text-[#262b2b] shrink-0 transition-transform duration-200 ease-in-out"
                                                                weight="regular"
                                                            />
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-4 pb-4">
                                                    <div className="flex flex-col gap-4 w-full">
                                                        {/* What goes into the score section */}
                                                        <div className="flex flex-col gap-2 items-start w-full min-w-0">
                                                            <h5 className="text-base font-medium text-[#262b2b] leading-6">
                                                                What goes into
                                                                the score:
                                                            </h5>
                                                            <ul className="list-disc ml-6 text-base font-normal text-[#5d6c6b] leading-6 space-y-0">
                                                                <li className="mb-0">
                                                                    Absenteeism
                                                                </li>
                                                                <li className="mb-0">
                                                                    Sick leave
                                                                    trends
                                                                </li>
                                                                <li className="mb-0">
                                                                    Long-leave
                                                                    frequency
                                                                </li>
                                                                <li className="mb-0">
                                                                    PTO usage
                                                                </li>
                                                                <li>
                                                                    Schedule
                                                                    stability
                                                                    &amp;
                                                                    workload
                                                                    balance
                                                                </li>
                                                            </ul>
                                                        </div>

                                                        {/* Wellbeing Score Formula Box */}
                                                        <div className="bg-[#f7f8f8] rounded-xl p-3 w-full">
                                                            <div
                                                                className="flex flex-col gap-2 text-sm font-normal text-[#5d6c6b] leading-normal"
                                                                style={{
                                                                    fontFamily:
                                                                        "var(--font-roboto-mono, 'Roboto Mono', monospace)",
                                                                }}
                                                            >
                                                                <p className="mb-0 text-[#985008]">
                                                                    Wellbeing
                                                                    Score =
                                                                </p>
                                                                <p>
                                                                    <span className="text-[#158039]">
                                                                        100
                                                                    </span>
                                                                    <span>{` – (`}</span>
                                                                    <span className="text-[#1356ba]">
                                                                        Burnout
                                                                        Risk
                                                                        Indicators
                                                                    </span>
                                                                    <span>{` + `}</span>
                                                                    <span className="text-[#b61f27]">
                                                                        High
                                                                        Absenteeism
                                                                        Penalty
                                                                    </span>
                                                                    )
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>

                                            {/* Learning Accordion */}
                                            <AccordionItem
                                                value="learning"
                                                className="border border-[#d9dede] border-solid rounded-xl overflow-hidden"
                                            >
                                                <AccordionTrigger
                                                    showDefaultIcon={false}
                                                    className="flex gap-4 items-start justify-between min-w-[240px] p-4 hover:no-underline [&[data-state=open]>div>div>svg]:rotate-180 w-full"
                                                >
                                                    <div className="flex gap-4 items-start flex-1 w-full min-w-0">
                                                        <div className="bg-[#1679fa] rounded w-6 h-6 shrink-0" />
                                                        <div className="flex flex-col gap-2 flex-1 items-start justify-center min-w-0 w-full">
                                                            <h4 className="text-base font-medium text-[#262b2b] text-left w-full">
                                                                Learning (10%)
                                                            </h4>
                                                            <p className="text-base font-normal text-[#5d6c6b] leading-6 w-full text-left">
                                                                Evaluates
                                                                professional
                                                                development
                                                                opportunities,
                                                                training
                                                                programs, and
                                                                skill growth
                                                                initiatives.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white border border-[#b8c1c0] border-solid max-h-9 relative rounded-md shrink-0 hover:bg-gray-50 transition-all pointer-events-none">
                                                        <div className="flex items-center justify-center max-h-inherit overflow-clip p-1.5 relative rounded-[inherit]">
                                                            <CaretDown
                                                                className="w-4 h-4 text-[#262b2b] shrink-0 transition-transform duration-200 ease-in-out"
                                                                weight="regular"
                                                            />
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-4 pb-4">
                                                    <div className="flex flex-col gap-4 w-full">
                                                        {/* What goes into the score section */}
                                                        <div className="flex flex-col gap-2 items-start w-full min-w-0">
                                                            <h5 className="text-base font-medium text-[#262b2b] leading-6">
                                                                What goes into
                                                                the score:
                                                            </h5>
                                                            <ul className="list-disc ml-6 text-base font-normal text-[#5d6c6b] leading-6 space-y-0">
                                                                <li className="mb-0">
                                                                    Training
                                                                    participation
                                                                </li>
                                                                <li className="mb-0">
                                                                    Skill
                                                                    completion
                                                                    rate
                                                                </li>
                                                                <li className="mb-0">
                                                                    Certification
                                                                    progress
                                                                </li>
                                                                <li>
                                                                    L&amp;D
                                                                    engagement
                                                                    over time
                                                                </li>
                                                            </ul>
                                                        </div>

                                                        {/* Learning Score Formula Box */}
                                                        <div className="bg-[#f7f8f8] rounded-xl p-3 w-full">
                                                            <div
                                                                className="flex flex-col gap-2 text-sm font-normal text-[#5d6c6b] leading-normal"
                                                                style={{
                                                                    fontFamily:
                                                                        "var(--font-roboto-mono, 'Roboto Mono', monospace)",
                                                                }}
                                                            >
                                                                <p className="mb-0 text-[#985008]">
                                                                    Learning
                                                                    Score =
                                                                </p>
                                                                <p>
                                                                    Weighted Avg
                                                                    of Training
                                                                    Completion +
                                                                    Skill Growth
                                                                    Index
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>

                                            {/* Performance Accordion */}
                                            <AccordionItem
                                                value="performance"
                                                className="border border-[#d9dede] border-solid rounded-xl overflow-hidden"
                                            >
                                                <AccordionTrigger
                                                    showDefaultIcon={false}
                                                    className="flex gap-4 items-start justify-between min-w-[240px] p-4 hover:no-underline [&[data-state=open]>div>div>svg]:rotate-180 w-full"
                                                >
                                                    <div className="flex gap-4 items-start flex-1 w-full min-w-0">
                                                        <div className="bg-[#da2f38] rounded w-6 h-6 shrink-0" />
                                                        <div className="flex flex-col gap-2 flex-1 items-start justify-center min-w-0 w-full">
                                                            <h4 className="text-base font-medium text-[#262b2b] text-left w-full">
                                                                Performance
                                                                (20%)
                                                            </h4>
                                                            <p className="text-base font-normal text-[#5d6c6b] leading-6 w-full text-left">
                                                                Monitors
                                                                individual and
                                                                team performance
                                                                metrics, goal
                                                                achievement, and
                                                                productivity
                                                                indicators.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white border border-[#b8c1c0] border-solid max-h-9 relative rounded-md shrink-0 hover:bg-gray-50 transition-all pointer-events-none">
                                                        <div className="flex items-center justify-center max-h-inherit overflow-clip p-1.5 relative rounded-[inherit]">
                                                            <CaretDown
                                                                className="w-4 h-4 text-[#262b2b] shrink-0 transition-transform duration-200 ease-in-out"
                                                                weight="regular"
                                                            />
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-4 pb-4">
                                                    <div className="flex flex-col gap-4 w-full">
                                                        {/* What goes into the score section */}
                                                        <div className="flex flex-col gap-2 items-start w-full min-w-0">
                                                            <h5 className="text-base font-medium text-[#262b2b] leading-6">
                                                                What goes into
                                                                the score:
                                                            </h5>
                                                            <ul className="list-disc ml-6 text-base font-normal text-[#5d6c6b] leading-6 space-y-0">
                                                                <li className="mb-0">
                                                                    Performance
                                                                    review
                                                                    ratings
                                                                </li>
                                                                <li className="mb-0">
                                                                    Goal
                                                                    achievement
                                                                    rate
                                                                </li>
                                                                <li className="mb-0">
                                                                    High
                                                                    performer
                                                                    ratio
                                                                </li>
                                                                <li>
                                                                    Distribution
                                                                    of low
                                                                    performers
                                                                </li>
                                                            </ul>
                                                        </div>

                                                        {/* Performance Score Formula Box */}
                                                        <div className="bg-[#f7f8f8] rounded-xl p-3 w-full">
                                                            <div
                                                                className="flex flex-col gap-2 text-sm font-normal text-[#5d6c6b] leading-normal"
                                                                style={{
                                                                    fontFamily:
                                                                        "var(--font-roboto-mono, 'Roboto Mono', monospace)",
                                                                }}
                                                            >
                                                                <p className="mb-0 text-[#985008]">
                                                                    Performance
                                                                    Score =
                                                                </p>
                                                                <p>
                                                                    Standardized
                                                                    Avg
                                                                    Performance
                                                                    Rating +
                                                                    Goal
                                                                    Completion
                                                                    Bonus
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>

                                    {/* Section 3: Understanding Your Score */}
                                    <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
                                        <h3 className="text-base font-medium text-[#262b2b] leading-5">
                                            Understanding Your Score
                                        </h3>
                                        <div className="flex gap-6 items-start relative shrink-0 w-full">
                                            {/* 80-100 Range */}
                                            <div className="flex flex-col gap-2 flex-1 items-start justify-center min-w-0 w-full">
                                                <div className="bg-[#dcfce6] border border-[#158039] border-solid h-20 relative rounded-md shrink-0 w-full">
                                                    <div className="flex items-center justify-center h-20 overflow-clip p-6 relative rounded-[inherit] w-full">
                                                        <p className="text-2xl font-medium leading-8 text-[#158039] whitespace-nowrap tracking-[-0.7px]">
                                                            80-100
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-base font-normal text-[#5d6c6b] leading-6 w-full">
                                                    Excellent health. Your
                                                    organization is performing
                                                    well across all dimensions.
                                                </p>
                                            </div>

                                            {/* 60-79 Range */}
                                            <div className="flex flex-col gap-2 flex-1 items-start justify-center min-w-0 w-full">
                                                <div className="bg-[#fff4d3] border border-[#a1470b] border-solid h-20 relative rounded-md shrink-0 w-full">
                                                    <div className="flex items-center justify-center h-20 overflow-clip p-1 relative rounded-[inherit] w-full">
                                                        <p className="text-2xl font-medium leading-8 text-[#a1470b] whitespace-nowrap tracking-[-0.7px]">
                                                            60-79
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-base font-normal text-[#5d6c6b] leading-6 w-full">
                                                    Good health. Room for
                                                    improvement in specific
                                                    areas.
                                                </p>
                                            </div>

                                            {/* 0-60 Range */}
                                            <div className="flex flex-col gap-2 flex-1 items-start justify-center min-w-0 w-full">
                                                <div className="bg-[#fee2e3] border border-[#b61f27] border-solid h-20 relative rounded-md shrink-0 w-full">
                                                    <div className="flex items-center justify-center h-20 overflow-clip p-1 relative rounded-[inherit] w-full">
                                                        <p className="text-2xl font-medium leading-8 text-[#b61f27] whitespace-nowrap tracking-[-0.7px]">
                                                            0-60
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-base font-normal text-[#5d6c6b] leading-6 w-full">
                                                    Needs attention. Focus on
                                                    improving key components.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 4: Overall Formula */}
                                    <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
                                        <h3 className="text-base font-medium text-[#262b2b] leading-5">
                                            Overall Formula
                                        </h3>
                                        <div className="bg-[#f7f8f8] rounded-xl p-3 w-full">
                                            <div
                                                className="flex flex-col gap-2 text-sm font-normal text-[#5d6c6b] leading-normal"
                                                style={{
                                                    fontFamily:
                                                        "var(--font-roboto-mono, 'Roboto Mono', monospace)",
                                                }}
                                            >
                                                <p className="mb-0 text-[#985008]">
                                                    Org Health Score =
                                                </p>
                                                <p className="mb-0">
                                                    <span>(</span>
                                                    <span className="text-[#17ad49]">
                                                        Retention
                                                    </span>
                                                    <span> * </span>
                                                    <span className="text-[#158039]">
                                                        0.30
                                                    </span>
                                                    <span>) +</span>
                                                </p>
                                                <p className="mb-0">
                                                    <span>(</span>
                                                    <span className="text-[#8139ee]">
                                                        Engagement
                                                    </span>
                                                    <span> * </span>
                                                    <span className="text-[#158039]">
                                                        0.25
                                                    </span>
                                                    <span>) +</span>
                                                </p>
                                                <p className="mb-0">
                                                    <span>(</span>
                                                    <span className="text-[#da2f38]">
                                                        Performance
                                                    </span>
                                                    <span> * </span>
                                                    <span className="text-[#158039]">
                                                        0.20
                                                    </span>
                                                    <span>) +</span>
                                                </p>
                                                <p className="mb-0">
                                                    <span>(</span>
                                                    <span className="text-[#ff7f00]">
                                                        Wellbeing
                                                    </span>
                                                    <span> * </span>
                                                    <span className="text-[#158039]">
                                                        0.15
                                                    </span>
                                                    <span>) +</span>
                                                </p>
                                                <p>
                                                    <span>(</span>
                                                    <span className="text-[#1679fa]">
                                                        Learning
                                                    </span>
                                                    <span> * </span>
                                                    <span className="text-[#158039]">
                                                        0.10
                                                    </span>
                                                    <span>)</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* Body Section */}
            <div className="box-border flex flex-wrap gap-6 items-start p-6 relative shrink-0 w-full">
                <CompanyHealthCard score={82} />
            </div>
        </div>
    );
}
