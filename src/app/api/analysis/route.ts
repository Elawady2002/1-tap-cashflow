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

        // 0. Check for existing analysis in Supabase (Cache)
        const { data: existingAnalysis, error: fetchError } = await supabase
            .from("analysis_results")
            .select("data")
            .eq("keyword", keyword)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (existingAnalysis) {
            console.log(">>> [API/ANALYSIS] Using Cached Analysis Results");
            return NextResponse.json(existingAnalysis.data);
        }

        // 1. Fetch live social data
        const results = await searchSocialData(keyword);
        const sampleText = results.slice(0, 10).map(r => r.text).join("\n");

        // 2. Perform live AI analysis
        const analysis = await classifyActivity(keyword, sampleText);
        const analysisData = {
            level: analysis.level,
            count: results.length,
            classification: analysis.classification
        };

        // 3. Persist to Supabase
        const { error: dbError } = await supabase.from("analysis_results").insert([{
            keyword,
            data: analysisData
        }]);

        if (dbError) console.error("Supabase Persistence Error (analysis_results):", dbError);

        return NextResponse.json(analysisData);
    } catch (error: any) {
        console.error("Analysis Error:", error);
        return NextResponse.json(
            { error: error.message || "Market analysis failed. Please try again." },
            { status: 500 }
        );
    }
}
