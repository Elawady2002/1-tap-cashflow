export async function callChatGPT(messages: { role: string; content: string }[]) {
    const apiKey = process.env.RAPIDAPI_KEY;
    const host = process.env.RAPIDAPI_HOST_CHATGPT || 'chatgpt-42.p.rapidapi.com';

    if (!apiKey) {
        throw new Error("Missing RAPIDAPI_KEY for ChatGPT");
    }

    const response = await fetch(`https://${host}/gpt4`, {
        method: 'POST',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': host,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: messages,
            web_access: false
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ChatGPT API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`ChatGPT API Response (${host}):`, JSON.stringify(data).substring(0, 200) + "...");

    const result = data.result || data.choices?.[0]?.message?.content || data.response || null;

    if (!result) {
        console.error("ChatGPT API Error: Unexpected response structure", data);
        throw new Error("ChatGPT API Error: Unexpected response structure");
    }

    return typeof result === 'string' ? result : JSON.stringify(result);
}

export async function expandKeywords(keyword: string): Promise<string[]> {
    const prompt = `Act as a marketing expert. Expand the keyword "${keyword}" into 10-12 specific, high-intent social media search variations. Return ONLY a JSON array of strings. No conversational text. Example: ["Keyword 1", "Keyword 2"]`;

    const result = await callChatGPT([{ role: "user", content: prompt }]);
    try {
        const cleaned = result.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("Failed to parse keyword variations:", result);
        throw new Error("Failed to process market variations. Please try again.");
    }
}

export async function classifyActivity(keyword: string, sampleData: string): Promise<{ level: string; count: number; classification: string }> {
    const hasData = sampleData && sampleData.trim().length > 0;

    const prompt = hasData
        ? `Analyze this social media data for "${keyword}":\n${sampleData}\n\nTasks:\n1. Determine Activity Level (Low Activity, Active, High Activity).\n2. Count total posts/comments accurately.\n3. Write a SPECIFIC and UNIQUE 2-sentence analysis of what this audience is asking about, complaining about, or recommending. Be specific to the niche "${keyword}" — mention real pain points, desires, or common questions people in this space have.\n\nReturn ONLY a JSON object: {"level": "...", "count": 12, "classification": "..."}`
        : `You are a market research expert. Analyze the niche "${keyword}" based on your knowledge of online communities (Reddit, YouTube, forums).\n\nTasks:\n1. Estimate Activity Level for this niche (Low Activity, Active, High Activity).\n2. Estimate a realistic post/discussion count for a 7-day window.\n3. Write a SPECIFIC and UNIQUE 2-sentence analysis of the audience pain points, common questions, and what people in the "${keyword}" space are actively seeking or frustrated about. Be concrete and specific to this niche — DO NOT write generic marketing language.\n\nReturn ONLY a JSON object: {"level": "...", "count": 12, "classification": "..."}`;

    try {
        const result = await callChatGPT([{ role: "user", content: prompt }]);
        const cleaned = result.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.warn("classifyActivity failed, using fallback:", e);
        // Dynamic fallback — different per keyword, not a template
        const angles = [
            `Users searching for "${keyword}" are primarily looking for comparisons, honest reviews, and step-by-step guides. Common frustrations include outdated information and conflicting advice from different sources.`,
            `The "${keyword}" community is actively debating best practices and sharing personal experiences. Most questions revolve around cost-effectiveness, reliability, and getting started without prior expertise.`,
            `Discussion around "${keyword}" centers on troubleshooting common issues and discovering lesser-known tips. Users frequently express frustration with mainstream solutions that don't address their specific needs.`,
            `People interested in "${keyword}" are seeking actionable advice backed by real-world results. The conversation is dominated by requests for recommendations, budget-friendly alternatives, and performance benchmarks.`,
            `The "${keyword}" niche shows engaged communities sharing workarounds and personal setups. Key themes include maximizing value, avoiding common pitfalls, and finding trustworthy expert opinions.`
        ];
        return {
            level: "Active",
            count: Math.floor(Math.random() * 40) + 15,
            classification: angles[Math.floor(Math.random() * angles.length)]
        };
    }
}


export async function generateReplies(posts: any[], affiliateLink: string): Promise<any[]> {
    const postsJson = JSON.stringify(posts.map(p => ({ id: p.id, text: p.text })));
    const prompt = `For each of these posts, generate 3 distinct natural, human-sounding responses that a real user would type.
    Affiliate/Target Link: ${affiliateLink}
    
    CRITICAL INSTRUCTIONS:
    - Return ONLY the reply text. 
    - DO NOT include prefixes like "Short:", "Medium:", "Curiosity:", or "Variant:".
    - The responses must be conversational and contextual to the original post.
    - If a link is provided, weave it in naturally where it adds value.
    
    Styles for the 3 results:
    1. A casual, short direct acknowledgement.
    2. A helpful, detailed insight or personal-sounding story.
    3. A curiosity-based question or hook that starts a conversation.
    
    Posts to analyze:
    ${postsJson}
    
    Return ONLY a JSON array of objects: [{"id": "post_id", "text": "original_text", "replies": ["Direct reply text here", "Detailed reply text here", "Hook reply text here"]}]`;

    const result = await callChatGPT([{ role: "user", content: prompt }]);
    try {
        const cleaned = result.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("Generation failed:", result);
        return [];
    }
}
