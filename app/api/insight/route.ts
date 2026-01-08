import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { data } = await request.json();

        if (!data || !data.series || !Array.isArray(data.series)) {
            return NextResponse.json(
                { error: "Valid data is required" },
                { status: 400 }
            );
        }

        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                {
                    error: "Gemini API key is not configured. Please set GEMINI_API_KEY environment variable.",
                },
                { status: 500 }
            );
        }

        // Initialize Google GenAI
        const ai = new GoogleGenAI({});

        // Calculate key metrics from the data
        const avgAttrition =
            data.series.reduce((sum: number, val: number) => sum + val, 0) /
            data.series.length;
        const recentTrend = data.series.slice(-3);
        const earlierTrend = data.series.slice(0, 3);
        const recentAvg =
            recentTrend.reduce((sum: number, val: number) => sum + val, 0) /
            recentTrend.length;
        const earlierAvg =
            earlierTrend.reduce((sum: number, val: number) => sum + val, 0) /
            earlierTrend.length;
        const trendDirection =
            recentAvg > earlierAvg ? "increasing" : "decreasing";
        const change = Math.abs(recentAvg - earlierAvg);
        const minRate = Math.min(...data.series);
        const maxRate = Math.max(...data.series);

        // Build the prompt with strict guardrails and specific guidance
        const months = data.labels || [];
        const recentMonths = months.slice(-3).join(", ");
        const earlierMonths = months.slice(0, 3).join(", ");

        // Calculate volatility (standard deviation)
        const variance =
            data.series.reduce((sum: number, val: number) => {
                return sum + Math.pow(val - avgAttrition, 2);
            }, 0) / data.series.length;
        const volatility = Math.sqrt(variance);

        // Identify peak and low points
        const peakIndex = data.series.indexOf(maxRate);
        const lowIndex = data.series.indexOf(minRate);
        const peakMonth = months[peakIndex] || "unknown";
        const lowMonth = months[lowIndex] || "unknown";

        // Calculate annualized rate
        const annualizedRate = avgAttrition * 12;

        // Determine health status
        const isHealthy = avgAttrition < 0.8;
        const isConcerning = avgAttrition > 1.0;
        const healthStatus = isHealthy
            ? "healthy"
            : isConcerning
            ? "concerning"
            : "moderate";

        const prompt = `You are a senior HR analytics consultant providing executive-level insights. Generate a precise, actionable insight about attrition trends.

=== DATA ANALYSIS ===
Average Rate: ${avgAttrition.toFixed(1)}% monthly (${annualizedRate.toFixed(
            1
        )}% annualized) - ${healthStatus} range
Recent Trend: ${recentAvg.toFixed(1)}% (${recentMonths})
Earlier Period: ${earlierAvg.toFixed(1)}% (${earlierMonths})
Change: ${trendDirection} by ${change.toFixed(1)} percentage points
Volatility: ${volatility.toFixed(2)}% (${
            volatility < 0.5 ? "low" : volatility < 1.0 ? "moderate" : "high"
        } variability)
Peak: ${maxRate.toFixed(1)}% in ${peakMonth} | Low: ${minRate.toFixed(
            1
        )}% in ${lowMonth}
Current: ${data.series[data.series.length - 1].toFixed(1)}%

=== INDUSTRY BENCHMARKS ===
Healthy: 5-10% annually (0.4-0.8% monthly)
Concerning: >12% annually (>1% monthly)
Your Status: ${
            isHealthy
                ? "Below industry average - excellent retention"
                : isConcerning
                ? "Above healthy threshold - needs attention"
                : "Within acceptable range"
        }

=== OUTPUT REQUIREMENTS ===
1. EXACTLY 2 sentences, each 15-25 words
2. Start with a specific observation (use actual numbers: "${avgAttrition.toFixed(
            1
        )}%", "${recentMonths}", etc.)
3. Follow with actionable insight (what to do, what's working, or what to investigate)
4. NO generic phrases: avoid "monitor", "consider", "keep an eye on", "may want to"
5. NO filler: avoid "it is important", "it should be noted", "worth noting"
6. Use active voice and direct language
7. Include specific percentages or timeframes from the data

=== QUALITY EXAMPLES ===
❌ BAD: "Attrition trends are largely stable at 6.9%, showing only a slight 0.3% increase. Monitor key departments and tenure groups for retention opportunities."
✅ GOOD: "Attrition averaged 6.9% over the past 12 months, with a 0.3% uptick in recent months suggesting early warning signs. Investigate exit interviews from ${recentMonths} to identify specific departure drivers."

❌ BAD: "The attrition rate remains relatively stable. Consider reviewing retention strategies."
✅ GOOD: "Attrition held steady at 6.5% monthly, well below the 0.8% industry benchmark. This stability suggests current retention programs are effective—document what's working to replicate success."

=== FOCUS DIRECTION ===
${
    trendDirection === "increasing" && change > 1
        ? `PRIORITY: Explain the ${change.toFixed(
              1
          )}% increase and identify which factors (departments, tenure groups, or seasonal patterns) are driving the rise.`
        : trendDirection === "decreasing" && change > 1
        ? `PRIORITY: Explain the ${change.toFixed(
              1
          )}% improvement and highlight which retention strategies or initiatives are driving success.`
        : change < 1
        ? `PRIORITY: Explain why the stability matters (${
              isHealthy ? "below industry average" : "within acceptable range"
          }) and identify any underlying patterns or risks in the data.`
        : `PRIORITY: Analyze the ${change.toFixed(
              1
          )}% change and provide context on what it means for the organization.`
}

=== GENERATE INSIGHT ===
Write a clean, professional insight that executives can immediately act on:`;

        // Generate response using Gemini 2.5 Flash
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        let responseText =
            response.text ||
            "Analyzing attrition trends to provide insights...";

        // Post-process to ensure it's max 2 sentences
        const sentences = responseText
            .split(/[.!?]+/)
            .filter((s: string) => s.trim().length > 0);
        if (sentences.length > 2) {
            responseText = sentences.slice(0, 2).join(". ").trim();
            if (!responseText.endsWith(".")) {
                responseText += ".";
            }
        }

        // Additional guardrail: if response is too long, truncate at 200 characters
        if (responseText.length > 200) {
            const truncated = responseText.substring(0, 197);
            const lastSentence = truncated.lastIndexOf(".");
            if (lastSentence > 100) {
                responseText = truncated.substring(0, lastSentence + 1);
            } else {
                responseText = truncated + "...";
            }
        }

        return NextResponse.json({ insight: responseText });
    } catch (error: any) {
        console.error("Error calling Gemini API for insight:", error);

        // Handle specific API errors
        if (error?.error?.code === 503) {
            return NextResponse.json(
                {
                    error: "The AI model is currently overloaded. Please try again in a moment.",
                },
                { status: 503 }
            );
        }

        if (error?.error?.code === 429) {
            return NextResponse.json(
                {
                    error: "Rate limit exceeded. Please wait a moment before trying again.",
                },
                { status: 429 }
            );
        }

        if (error?.error?.code === 401) {
            return NextResponse.json(
                {
                    error: "Invalid API key. Please check your GEMINI_API_KEY configuration.",
                },
                { status: 401 }
            );
        }

        // Generic error response - return fallback insight
        const errorMessage =
            error?.error?.message ||
            error?.message ||
            "Failed to generate insight. Please try again.";

        return NextResponse.json(
            {
                error: errorMessage,
                insight: "Analyzing attrition trends to provide insights...",
            },
            { status: error?.error?.code || error?.status || 500 }
        );
    }
}
