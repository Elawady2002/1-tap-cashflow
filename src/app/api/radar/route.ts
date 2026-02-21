import { NextResponse } from "next/server";
import { expandKeywords } from "@/lib/llm";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    console.log(">>> [API/RADAR] Incoming Request");
    let keyword = "Business";
    try {
        const body = await req.json();
        console.log(">>> [API/RADAR] Body:", body);
        keyword = body.keyword || "Business";

        if (!body.keyword) return NextResponse.json({ error: "Keyword required" }, { status: 400 });

        const variations = await expandKeywords(body.keyword);

        // Persist to Supabase
        const { error } = await supabase.from("keyword_variations").insert([{
            parent_keyword: keyword,
            variations: variations
        }]);

        if (error) console.error("Supabase Persistence Error (keyword_variations):", error);

        return NextResponse.json({ variations });
    } catch (error: any) {
        console.error("Radar Error (Falling back to Mock Data):", error);

        // Mock Variations relevant to the input
        const base = keyword;
        const mockVariations = [
            `${base} Growth Strategies`,
            `Best ${base} Tools 2024`,
            `How to Start ${base}`,
            `${base} for Beginners`,
            `${base} Automation Hacks`,
            `Scaling ${base} Business`
        ];

        return NextResponse.json({ variations: mockVariations, warning: "Falling back to mock data due to processing error." });
    }
}
