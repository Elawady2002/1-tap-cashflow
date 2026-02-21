import { NextResponse } from "next/server";
import { searchSocialData } from "@/lib/rapidapi";
import { classifyActivity } from "@/lib/llm";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    console.log(">>> [API/ANALYSIS] Incoming Request");
    try {
        const body = await req.json();
        const { keyword } = body;
        console.log(">>> [API/ANALYSIS] Keyword:", keyword);
        if (!keyword) return NextResponse.json({ error: "Keyword required" }, { status: 400 });

        // 1. Fetch live social data
        const results = await searchSocialData(keyword);
        const sampleText = results.slice(0, 10).map(r => r.text).join("\n");

        // 2. Perform live AI analysis
        const analysis = await classifyActivity(keyword, sampleText);

        // 3. Persist to Supabase
        const { error: dbError } = await supabase.from("analysis_results").insert([{
            keyword,
            data: {
                level: analysis.level,
                count: results.length,
                classification: analysis.classification
            }
        }]);

        if (dbError) console.error("Supabase Persistence Error (analysis_results):", dbError);

        return NextResponse.json({
            level: analysis.level,
            count: results.length,
            classification: analysis.classification
        });
    } catch (error: any) {
        console.error("Analysis Error (Falling back to Mock Data):", error);

        // Return High-Quality Mock Data for Demo/Fallback
        return NextResponse.json({
            level: "High Activity",
            count: Math.floor(Math.random() * (5000 - 1000) + 1000), // Random count between 1000-5000
            classification: `Analysis indicates a highly active discussion vector for this topic. 
            
            Semantic intent is focused on "Solution Seeking" and "Comparative Analysis". Users are actively requesting specific features and pricing tiers.
            
            Recommendation: Engage with value-proposition based replies.`,
            warning: "Displaying simulated data due to a processing error."
        });
    }
}
