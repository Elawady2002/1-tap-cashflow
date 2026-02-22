import { NextResponse } from "next/server";
import { searchSocialData } from "@/lib/rapidapi";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    let keyword = "Business";
    try {
        const body = await req.json();
        keyword = body.keyword || "Business";

        if (!body.keyword) return NextResponse.json({ error: "Keyword required" }, { status: 400 });

        // 1. Check Supabase for stored threads from previous analysis
        const { data: existingAnalysis } = await supabase
            .from("analysis_results")
            .select("data")
            .eq("keyword", keyword)
            .order("created_at", { ascending: false })
            .limit(1);

        if (existingAnalysis && existingAnalysis.length > 0 && existingAnalysis[0].data?.threads?.length > 0) {
            console.log(">>> [API/JACKPOTS] Using stored threads from analysis_results");
            return NextResponse.json({ results: existingAnalysis[0].data.threads });
        }

        // 2. No stored threads — fetch live data
        console.log(">>> [API/JACKPOTS] No stored threads, fetching live data");
        const results = await searchSocialData(body.keyword);
        return NextResponse.json({ results });
    } catch (error: any) {
        console.error("Jackpots Error (Falling back to Mock Data):", error);

        // Return empty array instead of fake data so the UI accurately reflects failure
        return NextResponse.json({ results: [], error: error.message }, { status: 500 });
    }
}
