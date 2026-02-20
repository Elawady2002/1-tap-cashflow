"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Post {
    id: string;
    platform: string;
    text: string;
    url: string;
    engagement: number;
}

interface AnalysisData {
    level: string;
    count: number;
    classification: string;
}

interface SearchContextType {
    keyword: string;
    setKeyword: (k: string) => void;
    variations: string[];
    setVariations: (v: string[]) => void;
    selectedKeyword: string;
    setSelectedKeyword: (sk: string) => void;
    analysis: AnalysisData | null;
    setAnalysis: (a: AnalysisData | null) => void;
    selectedPosts: Post[];
    setSelectedPosts: (p: Post[]) => void;
    results: Post[];
    setResults: (r: Post[]) => void;
    affiliateLink: string;
    setAffiliateLink: (l: string) => void;
    history: string[];
    addToHistory: (k: string) => void;
    resetSession: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [keyword, setKeyword] = useState("");
    const [variations, setVariations] = useState<string[]>([]);
    const [selectedKeyword, setSelectedKeyword] = useState("");
    const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
    const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
    const [results, setResults] = useState<Post[]>([]);
    const [affiliateLink, setAffiliateLink] = useState("");
    const [history, setHistory] = useState<string[]>([]);

    // Load history from Supabase on mount
    useEffect(() => {
        const fetchHistory = async () => {
            const { data, error } = await supabase
                .from("search_history")
                .select("keyword")
                .order("created_at", { ascending: false })
                .limit(5);

            if (!error && data) {
                setHistory(data.map(item => item.keyword));
            } else {
                // Fallback to local storage if supabase fails or is empty
                const saved = localStorage.getItem("onetap_history");
                if (saved) setHistory(JSON.parse(saved));
            }
        };
        fetchHistory();
    }, []);

    const addToHistory = async (k: string) => {
        const newHistory = [k, ...history.filter(h => h !== k)].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem("onetap_history", JSON.stringify(newHistory));

        // Persist to Supabase
        await supabase.from("search_history").insert([{ keyword: k }]);
    };

    const resetSession = () => {
        setKeyword("");
        setVariations([]);
        setSelectedKeyword("");
        setAnalysis(null);
        setSelectedPosts([]);
        setResults([]);
        setAffiliateLink("");
    };

    return (
        <SearchContext.Provider value={{
            keyword, setKeyword,
            variations, setVariations,
            selectedKeyword, setSelectedKeyword,
            analysis, setAnalysis,
            selectedPosts, setSelectedPosts,
            results, setResults,
            affiliateLink, setAffiliateLink,
            history, addToHistory,
            resetSession
        }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
}
