"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Users } from "lucide-react";
import { Sparkle } from "phosphor-react";
import type { ApexOptions } from "apexcharts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
// @ts-ignore - JavaScript file
import { getAttritionTrendData } from "@/app/data/attritionData";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AttritionTrendData {
    labels: string[];
    series: number[];
}

type TimePeriod = "monthly" | "quarterly" | "yearly";

export function AttritionTrendChart() {
    const [allData, setAllData] = useState<AttritionTrendData | null>(null);
    const [timePeriod, setTimePeriod] = useState<TimePeriod>("monthly");
    const [showForesight, setShowForesight] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [typedText, setTypedText] = useState("");
    const [hasGenerated, setHasGenerated] = useState(false);
    const [cachedInsight, setCachedInsight] = useState("");
    const [lastInsightKey, setLastInsightKey] = useState("");

    useEffect(() => {
        const trendData = getAttritionTrendData() as any;
        const fullData = {
            labels: trendData.labels,
            series: trendData.series,
        };
        setAllData(fullData);
    }, []);

    // Process data based on selected time period
    const data = useMemo(() => {
        if (!allData) return null;

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        // Get last 12 months of data
        const monthlyData: Array<{ label: string; value: number; date: Date }> = [];

        allData.labels.forEach((label, index) => {
            const monthsBack = allData.labels.length - 1 - index;
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - monthsBack,
                1
            );
            monthlyData.push({
                label,
                value: allData.series[index],
                date,
            });
        });

        if (timePeriod === "monthly") {
            // Show individual months (last 12 months)
            return {
                labels: monthlyData.map((d) => d.label),
                series: monthlyData.map((d) => d.value),
            };
        } else if (timePeriod === "quarterly") {
            // Aggregate by quarters
            const quarterMap = new Map<string, number[]>();

            monthlyData.forEach((item) => {
                const quarter = Math.floor(item.date.getMonth() / 3);
                const year = item.date.getFullYear();
                const quarterKey = `${year}-Q${quarter + 1}`;

                if (!quarterMap.has(quarterKey)) {
                    quarterMap.set(quarterKey, []);
                }
                quarterMap.get(quarterKey)!.push(item.value);
            });

            // Calculate average for each quarter and create labels
            const quarterLabels: string[] = [];
            const quarterValues: number[] = [];

            Array.from(quarterMap.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .forEach(([quarterKey, values]) => {
                    const average =
                        values.reduce((sum, val) => sum + val, 0) / values.length;
                    quarterLabels.push(quarterKey);
                    quarterValues.push(parseFloat(average.toFixed(2)));
                });

            return {
                labels: quarterLabels,
                series: quarterValues,
            };
        } else {
            // Aggregate by year
            const yearMap = new Map<number, number[]>();

            monthlyData.forEach((item) => {
                const year = item.date.getFullYear();
                if (!yearMap.has(year)) {
                    yearMap.set(year, []);
                }
                yearMap.get(year)!.push(item.value);
            });

            // Calculate average for each year
            const yearLabels: string[] = [];
            const yearValues: number[] = [];

            Array.from(yearMap.entries())
                .sort(([a], [b]) => a - b)
                .forEach(([year, values]) => {
                    const average =
                        values.reduce((sum, val) => sum + val, 0) / values.length;
                    yearLabels.push(year.toString());
                    yearValues.push(parseFloat(average.toFixed(2)));
                });

            return {
                labels: yearLabels,
                series: yearValues,
            };
        }
    }, [allData, timePeriod]);

    // Calculate quarter groups for x-axis labels (only for monthly view)
    const quarterGroups = useMemo(() => {
        if (!data || !data.labels || data.labels.length === 0) return [];
        if (timePeriod !== "monthly") return []; // Only show groups for monthly view

        const groups: Array<{ title: string; cols: number }> = [];
        const currentDate = new Date();

        let currentQuarter: number | null = null;
        let groupStartIndex = 0;

        // Calculate quarters based on actual dates (going back 12 months from current)
        data.labels.forEach((label, index) => {
            // Calculate the date for this label (going back from current date)
            const monthsBack = data.labels.length - 1 - index;
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - monthsBack,
                1
            );
            // Calculate quarter (0-3 for Q1-Q4)
            const quarter = Math.floor(date.getMonth() / 3);

            if (currentQuarter === null) {
                // First group
                currentQuarter = quarter;
                groupStartIndex = index;
            } else if (quarter !== currentQuarter) {
                // Quarter changed, save previous group
                groups.push({
                    title: `Q${currentQuarter + 1}`,
                    cols: index - groupStartIndex,
                });
                currentQuarter = quarter;
                groupStartIndex = index;
            }
        });

        // Add the last quarter group
        if (currentQuarter !== null) {
            groups.push({
                title: `Q${currentQuarter + 1}`,
                cols: data.labels.length - groupStartIndex,
            });
        }

        return groups;
    }, [data, timePeriod]);

    // Line chart for attrition trend
    const chartOptions: ApexOptions = useMemo(() => {
        if (!data) {
            return {} as ApexOptions;
        }

        return {
            chart: {
                type: "line",
                height: 300,
                toolbar: {
                    show: false,
                },
            },
            stroke: {
                curve: "smooth",
                width: 2,
                colors: ["#ef4444"],
            },
            dataLabels: {
                enabled: true,
                formatter: (val: number) => `${val}%`,
                style: {
                    colors: ["#5d6c6b"],
                    fontSize: "12px",
                },
            },
            markers: {
                size: 4,
                colors: ["#ef4444"],
            },
            xaxis: {
                type: "category",
                categories: data.labels || [],
                labels: {
                    style: {
                        colors: "#5d6c6b",
                        fontSize: "12px",
                    },
                },
                group:
                    quarterGroups.length > 0
                        ? {
                              style: {
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  colors: "#262b2b",
                              },
                              groups: quarterGroups.map((group) => ({
                                  title: group.title,
                                  cols: group.cols,
                              })),
                          }
                        : undefined,
            },
            yaxis: {
                labels: {
                    style: {
                        colors: "#5d6c6b",
                        fontSize: "12px",
                    },
                    formatter: (val: number) => `${val}%`,
                },
            },
            grid: {
                borderColor: "#e5e7eb",
                strokeDashArray: 4,
            },
            tooltip: {
                theme: "light",
                y: {
                    formatter: (val: number) => `${val}%`,
                },
            },
            colors: ["#ef4444"],
        };
    }, [data, quarterGroups]);

    const chartSeries = useMemo(() => {
        if (!data) {
            return [];
        }
        return [
            {
                name: "Attrition Rate",
                data: data.series || [],
            },
        ];
    }, [data]);

    // State for AI-generated insight
    const [insight, setInsight] = useState<string>("");
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const [insightError, setInsightError] = useState<string | null>(null);

    // Generate insight using Gemini API when data is available
    useEffect(() => {
        if (!allData || !allData.series || allData.series.length === 0) {
            setInsight("Analyzing attrition trends to provide insights...");
            return;
        }

        // Create a stable key based on the data to cache insights
        const dataKey = JSON.stringify(allData.series);
        
        // Check if we already have a cached insight for this data
        if (cachedInsight && lastInsightKey === dataKey) {
            setInsight(cachedInsight);
            return;
        }

        // Fetch insight from API with retry logic for 503 errors
        const fetchInsight = async (retryCount = 0) => {
            setIsLoadingInsight(true);
            setInsightError(null);
            
            try {
                const response = await fetch("/api/insight", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        data: {
                            series: allData.series,
                            labels: allData.labels,
                        },
                    }),
                });

                // Handle 503 errors with retry logic
                if (response.status === 503) {
                    if (retryCount < 3) {
                        // Exponential backoff: 1s, 2s, 4s
                        const delay = Math.pow(2, retryCount) * 1000;
                        await new Promise(resolve => setTimeout(resolve, delay));
                        return fetchInsight(retryCount + 1);
                    } else {
                        // Max retries reached, use fallback
                        throw new Error("Service temporarily unavailable. Please try again later.");
                    }
                }

                if (!response.ok) {
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch {
                        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
                    }
                    throw new Error(errorData.error || "Failed to generate insight");
                }

                const result = await response.json();
                const generatedInsight = result.insight || "Analyzing attrition trends to provide insights...";
                
                setInsight(generatedInsight);
                setCachedInsight(generatedInsight);
                setLastInsightKey(dataKey);
                setHasGenerated(true);
            } catch (error: any) {
                console.error("Error fetching insight:", error);
                setInsightError(error.message);
                // Fallback to a simple static insight
                const avgAttrition = allData.series.reduce((sum, val) => sum + val, 0) / allData.series.length;
                setInsight(`Attrition rate is ${avgAttrition.toFixed(1)}% on average. Monitor key departments and tenure groups for retention opportunities.`);
            } finally {
                setIsLoadingInsight(false);
            }
        };

        fetchInsight();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allData]);

    // Reset cache when data changes (data key is handled in the insight fetch effect)

    // Handle typing animation when foresight is toggled
    useEffect(() => {
        if (!showForesight) {
            // Don't clear the text when hiding, just keep it cached
            setIsGenerating(false);
            return;
        }

        // If already generated for this insight, show cached text immediately
        if (hasGenerated && cachedInsight && cachedInsight === insight) {
            setTypedText(cachedInsight);
            setIsGenerating(false);
            return;
        }

        // First time generation - show loading and typing animation
        // Wait for insight to be ready if it's still loading
        if (isLoadingInsight) {
            setIsGenerating(true);
            setTypedText("");
            // Wait for insight to be ready
            const checkInsight = setInterval(() => {
                if (!isLoadingInsight && insight) {
                    clearInterval(checkInsight);
                    startTypingAnimation();
                }
            }, 100);
            return () => clearInterval(checkInsight);
        }

        startTypingAnimation();

        function startTypingAnimation() {
            setIsGenerating(true);
            setTypedText("");

            // After a brief delay, start typing animation
            const loadingTimeout = setTimeout(() => {
                setIsGenerating(false);
                
                const fullText = insight || "Analyzing attrition trends to provide insights...";
                let currentIndex = 0;

                const typingInterval = setInterval(() => {
                    if (currentIndex < fullText.length) {
                        const newText = fullText.slice(0, currentIndex + 1);
                        setTypedText(newText);
                        currentIndex++;
                        
                        // Cache the full text when typing completes
                        if (currentIndex === fullText.length) {
                            setCachedInsight(fullText);
                            setHasGenerated(true);
                        }
                    } else {
                        clearInterval(typingInterval);
                    }
                }, 20); // Typing speed: 20ms per character

                return () => clearInterval(typingInterval);
            }, 800); // Show loading for 800ms

            return () => {
                clearTimeout(loadingTimeout);
            };
        }
    }, [showForesight, insight, hasGenerated, cachedInsight, isLoadingInsight]);

    if (!allData) {
        return (
            <div className="bg-white rounded-xl border border-[#d9dede] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#d9dede]">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex gap-1 items-center mb-1">
                                <Users className="w-5 h-5 text-[#738482]" />
                                <h2 className="text-base font-medium text-[#262b2b]">
                                    Attrition Trend
                                </h2>
                            </div>
                            <p className="text-sm text-[#5d6c6b]">
                                Measure how well the company retains its employees over time.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowForesight(!showForesight)}
                            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer shrink-0 ${
                                showForesight
                                    ? "bg-[#8139ee] text-white hover:bg-[#6b2fc7]"
                                    : "bg-white border border-[#8139ee] text-[#8139ee] hover:bg-[#f5f3ff]"
                            }`}
                        >
                            Foresight
                        </button>
                    </div>
                </div>
                <div
                    className={`border-b border-[#d9dede] border-solid relative shrink-0 w-full overflow-hidden transition-all duration-300 ease-in-out ${
                        showForesight ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="rotating-gradient-border w-full">
                        <div className="flex gap-2 items-center p-4 relative z-10">
                            <Sparkle
                                className="w-6 h-6 text-[#8139ee] shrink-0"
                                weight="fill"
                            />
                            {isGenerating ? (
                                <div className="flex-1 flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-[#8139ee] rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                                        <div className="w-2 h-2 bg-[#8139ee] rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                                        <div className="w-2 h-2 bg-[#8139ee] rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                                    </div>
                                    <p className="text-sm text-[#5d6c6b]">Generating insight...</p>
                                </div>
                            ) : (
                                <p className="flex-1 font-normal grow leading-5 min-w-0 relative shrink-0 text-[#262b2b] text-sm">
                                    {typedText}
                                    {showForesight && typedText.length < (insight?.length || 0) && (
                                        <span className="inline-block w-0.5 h-4 bg-[#262b2b] ml-1 animate-pulse" />
                                    )}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <div className="flex items-center justify-center h-[300px]">
                        <p className="text-sm text-[#5d6c6b]">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-[#d9dede] overflow-hidden">
            {/* Card Header */}
            <div className="px-4 py-3 border-b border-[#d9dede]">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex gap-1 items-center mb-1">
                            <Users className="w-5 h-5 text-[#738482]" />
                            <h2 className="text-base font-medium text-[#262b2b]">
                                Attrition Trend
                            </h2>
                        </div>
                        <p className="text-sm text-[#5d6c6b]">
                            Measure how well the company retains its employees over time.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowForesight(!showForesight)}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer shrink-0 ${
                            showForesight
                                ? "bg-[#8139ee] text-white hover:bg-[#6b2fc7]"
                                : "bg-white border border-[#8139ee] text-[#8139ee] hover:bg-[#f5f3ff]"
                        }`}
                    >
                        Foresight
                    </button>
                </div>
            </div>

            {/* Foresight Insight Section */}
            <div
                className={`border-b border-[#d9dede] border-solid relative shrink-0 w-full overflow-hidden transition-all duration-300 ease-in-out ${
                    showForesight ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="rotating-gradient-border w-full">
                    <div className="flex gap-2 items-center p-4 relative z-10">
                        <Sparkle
                            className="w-6 h-6 text-[#8139ee] shrink-0"
                            weight="fill"
                        />
                        {isGenerating ? (
                            <div className="flex-1 flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-[#8139ee] rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                                    <div className="w-2 h-2 bg-[#8139ee] rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                                    <div className="w-2 h-2 bg-[#8139ee] rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                                </div>
                                <p className="text-sm text-[#5d6c6b]">Generating insight...</p>
                            </div>
                        ) : (
                            <p className="flex-1 font-normal grow leading-5 min-w-0 relative shrink-0 text-[#262b2b] text-sm">
                                {typedText}
                                {showForesight && typedText.length < (insight?.length || 0) && (
                                    <span className="inline-block w-0.5 h-4 bg-[#262b2b] ml-1 animate-pulse" />
                                )}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Time Period Selector and Chart */}
            <div className="p-4">
                <div className="mb-4">
                    <Select
                        value={timePeriod}
                        onValueChange={(value) =>
                            setTimePeriod(value as TimePeriod)
                        }
                    >
                        <SelectTrigger
                            id="time-period-select"
                            className="w-full"
                        >
                            <SelectValue placeholder="Select time period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {data && data.labels.length > 0 ? (
                    <Chart
                        type="line"
                        options={chartOptions}
                        series={chartSeries}
                        height={300}
                    />
                ) : (
                    <div className="flex items-center justify-center h-[300px]">
                        <p className="text-sm text-[#5d6c6b]">
                            No data available
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

