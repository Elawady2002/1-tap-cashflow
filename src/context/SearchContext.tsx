"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Post {
    id: string;
    platform: string;
    text: string;
    title?: string;
    url: string;
    engagement: string | number;
}

interface AnalysisData {
    level: string;
    count: number;
    classification: string;
    confidence?: number;
    sources?: number;
    liveData?: boolean;
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
    replies: any[];
    setReplies: (r: any[]) => void;
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
    const [replies, setReplies] = useState<any[]>([]);
    const [history, setHistory] = useState<string[]>([]);

    // Load history from Supabase on mount
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data, error } = await supabase
                    .from("search_history")
                    .select("keyword")
                    .order("created_at", { ascending: false })
                    .limit(20); // Get more to handle duplicates manually if needed

                if (!error && data) {
                    // Filter duplicates and take top 5
                    const uniqueKeywords: string[] = [];
                    data.forEach(item => {
                        if (!uniqueKeywords.includes(item.keyword) && uniqueKeywords.length < 5) {
                            uniqueKeywords.push(item.keyword);
                        }
                    });
                    setHistory(uniqueKeywords);
                    localStorage.setItem("onetap_history", JSON.stringify(uniqueKeywords));
                } else {
                    const saved = localStorage.getItem("onetap_history");
                    if (saved) setHistory(JSON.parse(saved));
                }
            } catch (e) {
                console.error("Error fetching history:", e);
                const saved = localStorage.getItem("onetap_history");
                if (saved) setHistory(JSON.parse(saved));
            }
        };
        fetchHistory();
    }, []);

    // Save current search state to local storage for persistence on refresh
    useEffect(() => {
        if (variations.length > 0 || selectedKeyword || analysis) {
            const searchState = {
                variations,
                selectedKeyword,
                keyword,
                analysis
            };
            localStorage.setItem("onetap_current_search", JSON.stringify(searchState));
        }
    }, [variations, selectedKeyword, keyword, analysis]);

    // Load current search state on mount
    useEffect(() => {
        const savedState = localStorage.getItem("onetap_current_search");
        if (savedState) {
            try {
                const { variations: v, selectedKeyword: sk, keyword: k, analysis: a } = JSON.parse(savedState);
                if (v) setVariations(v);
                if (sk) setSelectedKeyword(sk);
                if (k) setKeyword(k);
                if (a) setAnalysis(a);
            } catch (e) {
                console.error("Failed to parse saved search state:", e);
            }
        }
    }, []);

    const addToHistory = async (k: string) => {
        const newHistory = [k, ...history.filter(h => h !== k)].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem("onetap_history", JSON.stringify(newHistory));

        // Persist to Supabase
        await supabase.from("search_history").insert([{ keyword: k }]);
    };

    const resetSession = async () => {
        setKeyword("");
        setVariations([]);
        setSelectedKeyword("");
        setAnalysis(null);
        setSelectedPosts([]);
        setResults([]);
        setAffiliateLink("");
        setReplies([]);
        setHistory([]);
        localStorage.removeItem("onetap_history");
        localStorage.removeItem("onetap_current_search");
        await supabase.auth.signOut();
        window.location.href = "/login";
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
            replies, setReplies,
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
